import { ENV } from '../config/env.js';

let db;
const DB_NAME = 'contact_form_db';
const STORE_NAME = 'messages';

// Encryption utilities
async function encryptData(data) {
  const text = JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(text);
  
  // Create a key from the password
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(ENV.ENCRYPTION_KEY),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Generate a key for AES-GCM
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  
  // Generate an IV
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt the data
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataBuffer
  );
  
  // Combine IV and encrypted data
  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encryptedData))
  };
}

async function decryptData(encryptedObj) {
  const encoder = new TextEncoder();
  
  // Create a key from the password
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(ENV.ENCRYPTION_KEY),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Generate the key for AES-GCM
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  
  // Decrypt the data
  const decryptedData = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(encryptedObj.iv) },
    key,
    new Uint8Array(encryptedObj.data)
  );
  
  // Convert back to text and parse JSON
  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decryptedData));
}

async function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => {
      console.error("Database error:", request.error);
      reject(request.error);
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      console.log("Database opened successfully");
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { 
          keyPath: 'id',
          autoIncrement: true 
        });
        
        store.createIndex('created_at', 'created_at', { unique: false });
      }
    };
  });
}

async function resetDatabase(password) {
  if (password !== ENV.ADMIN_PASSWORD) {
    throw new Error('Unauthorized access');
  }

  // Close the current database connection
  if (db) {
    db.close();
    db = null;
  }

  return new Promise((resolve, reject) => {
    const deleteRequest = indexedDB.deleteDatabase(DB_NAME);

    deleteRequest.onerror = () => {
      reject(new Error('Failed to delete database'));
    };

    deleteRequest.onsuccess = async () => {
      try {
        // Reinitialize the database
        await initDB();
        console.log('Database reset successfully');
        resolve();
      } catch (error) {
        reject(error);
      }
    };
  });
}

async function addMessage(message) {
  const messageData = {
    ...message,
    created_at: new Date().toISOString()
  };

  // Encrypt the message data
  const encryptedData = await encryptData(messageData);

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.add(encryptedData);

    request.onsuccess = () => {
      console.log('Message saved successfully');
      resolve(request.result);
    };

    request.onerror = () => {
      console.error('Error saving message:', request.error);
      reject(request.error);
    };
  });
}

async function getAllMessages(password) {
  if (password !== ENV.ADMIN_PASSWORD) {
    throw new Error('Unauthorized access');
  }

  return new Promise(async (resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = async () => {
      try {
        // Decrypt all messages
        const decryptedMessages = await Promise.all(
          request.result.map(async (encryptedMessage) => {
            const decryptedData = await decryptData(encryptedMessage);
            return {
              id: encryptedMessage.id,
              ...decryptedData
            };
          })
        );
        resolve(decryptedMessages);
      } catch (error) {
        reject(error);
      }
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Initialize the database
initDB().then(() => {
  console.log('Database initialized successfully!');
  self.postMessage('ready');
}).catch(error => {
  console.error('Failed to initialize database:', error);
  self.postMessage({ 
    type: 'error', 
    error: error.message || 'Failed to initialize the database'
  });
});

// Handle messages
self.onmessage = async (e) => {
  try {
    const { action, data, password } = e.data;
    
    switch (action) {
      case 'submit-form':
        await addMessage(data);
        self.postMessage({ 
          type: 'submit-success',
          message: 'Message saved successfully'
        });
        break;

      case 'get-messages':
        try {
          const allMessages = await getAllMessages(password);
          self.postMessage({ 
            type: 'messages',
            data: allMessages
          });
        } catch (error) {
          self.postMessage({ 
            type: 'error',
            error: 'Unauthorized access'
          });
        }
        break;

      case 'reset-database':
        try {
          await resetDatabase(password);
          self.postMessage({ 
            type: 'reset-success',
            message: 'Database reset successfully'
          });
        } catch (error) {
          self.postMessage({ 
            type: 'error',
            error: 'Failed to reset database: ' + error.message
          });
        }
        break;

      default:
        console.warn('Unknown action:', action);
    }
  } catch (error) {
    console.error('Error in worker:', error);
    self.postMessage({ 
      type: 'error', 
      error: error.message || 'An error occurred'
    });
  }
}; 
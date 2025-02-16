import { ENV } from '../config/env.js';

// This file will be completely removed in production builds
export const initDevTools = (worker, isDbReady) => {
  // Initialize in both dev and prod, but with different behaviors
  console.log('🔧 Console tools initialized');
  
  // Hidden admin commands - not shown in help
  const ADMIN_KEY = 'show_admin_tools';
  
  // Define showAdmin command (hidden)
  Object.defineProperty(window, 'showAdmin', {
    value: (password) => {
      if (password === ENV.ADMIN_PASSWORD) {
        sessionStorage.setItem(ADMIN_KEY, 'true');
        console.log('🔐 Admin tools enabled');
        help(); // Show updated help with admin commands
      } else {
        console.error('❌ Invalid password');
      }
    },
    writable: false,
    configurable: false
  });

  // Define resetDatabase command (hidden by default)
  Object.defineProperty(window, 'resetDatabase', {
    value: (password) => {
      if (!worker) {
        console.error('❌ Worker not initialized');
        return;
      }
      if (!isDbReady) {
        console.error('❌ Database not ready');
        return;
      }
      if (!password) {
        console.error('❌ Password required');
        return;
      }
      
      // Ask for confirmation
      const confirmed = window.confirm('⚠️ WARNING: This will delete all messages. Are you sure?');
      if (!confirmed) {
        console.log('❌ Database reset cancelled');
        return;
      }

      console.log('🗑️ Resetting database...');
      worker.postMessage({
        action: 'reset-database',
        password
      });
    },
    writable: false,
    configurable: false
  });

  // Define queryContacts in a way that persists in the console
  Object.defineProperty(window, 'queryContacts', {
    value: (password) => {
      if (!worker) {
        console.error('❌ Worker not initialized');
        return;
      }
      if (!isDbReady) {
        console.error('❌ Database not ready');
        return;
      }
      if (!password) {
        console.error('❌ Password required');
        return;
      }
      
      console.log('🔍 Querying contacts...');
      worker.postMessage({
        action: 'get-messages',
        password
      });
    },
    writable: false,
    configurable: false
  });

  // Enhanced message handler with better formatting
  const messageHandler = (e) => {
    if (e.data.type === 'messages') {
      console.log('📬 Messages retrieved successfully:');
      
      // Format the data for better console display
      const formattedData = e.data.data.map(msg => ({
        ID: msg.id,
        Name: msg.name,
        Email: msg.email,
        Message: msg.message,
        'Sent At': new Date(msg.created_at).toLocaleString()
      }));

      // Log total count
      console.log(`📊 Total messages: ${formattedData.length}`);
      
      // Create groups for better organization
      console.group('📝 Messages');
      formattedData.forEach((msg) => {
        console.group(`Message #${msg.ID}`);
        console.log('From:', msg.Name, `<${msg.Email}>`);
        console.log('Sent:', msg['Sent At']);
        console.log('Message:', msg.Message);
        console.groupEnd();
      });
      console.groupEnd();
      
      // Also show as table for quick overview
      console.table(formattedData);
    } else if (e.data.type === 'reset-success') {
      console.log('✅ Database reset successfully');
      console.log('💡 The database has been cleared and reinitialized');
    } else if (e.data.type === 'error') {
      console.error('❌ Error:', e.data.error);
    }
  };

  // Remove any existing listeners before adding new one
  worker.removeEventListener('message', messageHandler);
  worker.addEventListener('message', messageHandler);

  // Add help function
  Object.defineProperty(window, 'help', {
    value: () => {
      const isAdmin = sessionStorage.getItem(ADMIN_KEY) === 'true';
      
      console.log(`
🔍 Available Commands:

queryContacts(password)
  - View all contact form submissions
  - Example: queryContacts("your-password")

help()
  - Show this help message
${isAdmin ? `
🔐 Admin Commands:

resetDatabase(password)
  - ⚠️ Reset the database (deletes all messages)
  - Example: resetDatabase("your-password")
  - WARNING: This action cannot be undone!
` : ''}`);
    },
    writable: false,
    configurable: false
  });

  // Show initial help without revealing password
  console.log('💡 Type help() to see available commands');
}; 
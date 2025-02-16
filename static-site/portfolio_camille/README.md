# Portfolio Website - Camille

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory with these variables:
```env
VITE_ADMIN_PASSWORD=your-chosen-password
VITE_ENCRYPTION_KEY=your-encryption-key
```

3. Start the development server:
```bash
npm run dev
```

## 📬 Accessing Contact Form Data

The contact form data is securely stored and encrypted in the browser's IndexedDB. To access this data:

### 1. Enable Admin Tools
1. Open your browser's developer console (F12)
2. Type: `showAdmin("your-password")`
3. You should see: "🔐 Admin tools enabled"

### 2. View Messages
- Type: `queryContacts("your-password")`
- This will display all messages in a formatted table

### 3. Reset Database (if needed)
After enabling admin tools:
- Type: `resetDatabase("your-password")`
- ⚠️ Warning: This will permanently delete all messages

## 🔐 Security Features

- All messages are encrypted using AES-GCM encryption
- Password protection for accessing messages
- Hidden admin commands
- Session-based admin access (resets on page refresh)
- Data is stored locally and can't be accessed without proper credentials

## 📝 Important Notes

1. Keep your password and encryption key secure
2. Don't share the admin commands with others
3. Admin access is temporary and resets when you:
   - Refresh the page
   - Close the browser
   - Clear browser data

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run setup
npm run build

# Preview production build
npm run preview
```

## 🔍 Troubleshooting

If you can't access the messages:
1. Make sure you're using the correct password
2. Check if the database is initialized (no console errors)
3. Try refreshing the page and enabling admin tools again

## 📚 Documentation References

For more details about the implementation:
- Contact Form: `src/components/ContactForm.vue`
- Database Worker: `src/workers/sql.worker.js`
- Dev Tools: `src/utils/devTools.js`

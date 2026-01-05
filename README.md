# Deliveroo Invoice Collector

A script to automatically download all receipt PDFs from your Deliveroo orders page with month filtering and email integration.

## Two Ways to Use

### Option 1: Tampermonkey Userscript (Recommended) ⭐

**Easiest and most convenient way to use the script.**

1. Install [Tampermonkey](https://www.tampermonkey.net/) extension
2. Follow the setup guide in [TAMPERMONKEY_SETUP.md](./TAMPERMONKEY_SETUP.md)
3. Go to `https://deliveroo.fr/en/orders`
4. Click the "📥 Download Receipts" button that appears
5. Follow the on-screen instructions

**Benefits:**
- One-click activation (no console needed)
- Auto-updates from GitHub
- Email stored securely in browser
- Works across browser sessions

### Option 2: Browser Console (Manual)

**For one-time use or testing.**

1. Navigate to [https://deliveroo.fr/en/orders](https://deliveroo.fr/en/orders)
2. Make sure you are logged in
3. Open your browser's developer console:
   - **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - **Firefox**: Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
   - **Safari**: Enable Developer menu first, then `Cmd+Option+C`
4. Copy the entire contents of `extract_receipts.js`
5. Paste it into the console and press `Enter`
6. Wait for the script to complete (it will process each order and download PDFs)
7. Check your browser's download folder for the PDF files

## Features

- 📅 **Month Filtering**: Select specific months to download (avoid re-downloading everything)
- 📁 **Folder Selection**: Save all receipts to a single folder (Chrome/Edge only)
- 📧 **Email Integration**: Automatically open Gmail with pre-filled email
- 🔒 **Privacy**: Email address stored securely in browser (not in code)
- 📊 **Progress Tracking**: Real-time UI showing download progress
- ✅ **Smart Filtering**: Only downloads receipts for selected months

## Files

- `deliveroo-receipts.user.js` - Tampermonkey userscript (recommended)
- `extract_receipts.js` - Console script (for manual use)
- `TAMPERMONKEY_SETUP.md` - Detailed setup instructions for Tampermonkey

## Output

- PDF files are automatically downloaded to selected folder or default download folder
- Real-time UI shows progress and completion status
- Email button opens Gmail with pre-filled message
- Download information is stored in `window.deliverooDownloads`

## Order and Receipt URL Formats

- **Order page**: `https://deliveroo.fr/en/orders/{order_id}`
- **Receipt page**: `https://deliveroo.fr/order/receipt/{receipt_id}`

Note: The `receipt_id` is different from the `order_id`, so the script visits each order page to find its receipt URL.

## Troubleshooting

- **No order links found**: Make sure you're on the orders page and logged in
- **PDF downloads fail**: The receipt page structure might have changed, or some receipts might not have PDFs available
- **Browser blocks downloads**: You may need to allow multiple downloads in your browser settings
- **CORS/Network errors**: Make sure you're logged in and the page hasn't expired

## Browser Compatibility

Works in modern browsers (Chrome, Firefox, Safari, Edge) that support:
- ES6 async/await
- Fetch API
- Blob API
- File download APIs

# deliveroo-invoice-collector

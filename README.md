# Deliveroo Receipts Downloader - Tampermonkey Userscript

A Tampermonkey userscript to automatically download all receipt PDFs from your Deliveroo orders page with month filtering and email integration.

## Features

- 📅 **Month Filtering**: Select specific months to download (avoid re-downloading everything)
- 📁 **Folder Selection**: Save all receipts to a single folder (Chrome/Edge only)
- 📧 **Email Integration**: Automatically open Gmail with pre-filled email
- 🔒 **Privacy**: Email address stored securely in browser (not in code)
- 📊 **Progress Tracking**: Real-time UI showing download progress
- ✅ **Smart Filtering**: Only downloads receipts for selected months
- ✏️ **Change Email**: Easy email management from the UI

## Step 1: Install Tampermonkey

1. **Chrome/Edge**: Go to [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) and click "Add to Chrome"
2. **Firefox**: Go to [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) and click "Add to Firefox"

## Step 2: Create the Userscript

1. Click the Tampermonkey icon in your browser toolbar
2. Click "Create a new script"
3. Delete all the default code
4. Copy the entire contents of `deliveroo-receipts.user.js`
5. Paste it into the Tampermonkey editor
6. **Important**: Update the `@updateURL` and `@downloadURL` lines (lines 11-12) with your GitHub repository URL:
   ```
   // @updateURL    https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/deliveroo-receipts.user.js
   // @downloadURL  https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/deliveroo-receipts.user.js
   ```
7. Click "File" → "Save" (or press Ctrl+S / Cmd+S)

## Step 3: Upload to GitHub

1. Create a new repository on GitHub (or use existing)
2. Upload `deliveroo-receipts.user.js` to the repository
3. Make sure the file is in the root or a folder (update the URL path accordingly)
4. Get the raw URL:
   - Go to your file on GitHub
   - Click "Raw" button
   - Copy the URL
   - Update the `@updateURL` and `@downloadURL` in Tampermonkey

## Step 4: Use the Script

1. Go to `https://deliveroo.fr/en/orders`
2. You'll see a green "📥 Download Receipts" button in the top-left corner
3. Click the button
4. On first run, you'll be prompted to enter your email address
5. Follow the on-screen instructions to:
   - Select months to download
   - Select folder (optional)
   - Start downloads

## Updating the Script

### Automatic Updates (Recommended)
- Tampermonkey checks for updates automatically (daily by default)
- When an update is available, you'll see a notification
- Click the notification to update

### Manual Update
- Click Tampermonkey icon → "Check for userscript updates"
- Or edit the script and save (if you made local changes)

## Changing Your Email

- The email is stored in your browser
- Click the "✏️ Change Email" button in the UI to update your email address
- The new email will be saved and used for all future email operations

## Troubleshooting

- **Button doesn't appear**: Make sure you're on `https://deliveroo.fr/en/orders` and the script is enabled in Tampermonkey
- **Email prompt keeps appearing**: Check Tampermonkey permissions for `GM_setValue` and `GM_getValue`
- **Script doesn't update**: Check that the `@updateURL` points to the correct GitHub raw URL
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
- Tampermonkey extension

## Files

- `deliveroo-receipts.user.js` - Tampermonkey userscript (main file)

## Output

- PDF files are automatically downloaded to selected folder or default download folder
- Real-time UI shows progress and completion status
- Email button opens Gmail with pre-filled message
- Download information is stored in `window.deliverooDownloads`

## Order and Receipt URL Formats

- **Order page**: `https://deliveroo.fr/en/orders/{order_id}`
- **Receipt page**: `https://deliveroo.fr/order/receipt/{receipt_id}`

Note: The `receipt_id` is different from the `order_id`, so the script visits each order page to find its receipt URL.

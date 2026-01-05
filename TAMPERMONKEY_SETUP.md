# Tampermonkey Setup Guide

## Step 1: Install Tampermonkey

1. **Chrome/Edge**: Go to [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) and click "Add to Chrome"
2. **Firefox**: Go to [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) and click "Add to Firefox"

## Step 2: Create the Userscript

1. Click the Tampermonkey icon in your browser toolbar
2. Click "Create a new script"
3. Delete all the default code
4. Copy the entire contents of `deliveroo-receipts.user.js`
5. Paste it into the Tampermonkey editor
6. **Important**: Update the `@updateURL` and `@downloadURL` lines (lines 10-11) with your GitHub repository URL:
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
- To change it, you can:
  1. Click Tampermonkey icon → "Dashboard"
  2. Find "Deliveroo Receipts Downloader"
  3. Click the script name
  4. In the script, find `GM_getValue('deliveroo_user_email', null)`
  5. Or delete the stored value and you'll be prompted again on next run

## Troubleshooting

- **Button doesn't appear**: Make sure you're on `https://deliveroo.fr/en/orders` and the script is enabled in Tampermonkey
- **Email prompt keeps appearing**: Check Tampermonkey permissions for `GM_setValue` and `GM_getValue`
- **Script doesn't update**: Check that the `@updateURL` points to the correct GitHub raw URL


# Deliveroo Invoice Collector

A browser console script to automatically download all receipt PDFs from your Deliveroo orders page.

## Usage

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

## What It Does

1. Finds all order links on the orders page
2. For each order, extracts the receipt URL
3. Downloads the receipt PDF file
4. Saves files with names like `deliveroo_receipt_{receipt_id}_{timestamp}.pdf`

## Output

- PDF files are automatically downloaded to your browser's default download folder
- Console shows progress and completion status
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

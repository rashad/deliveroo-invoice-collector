/**
 * Deliveroo Receipt PDF Downloader
 * 
 * Paste this script into the browser console on https://deliveroo.fr/en/orders
 * It will extract all order IDs and download the receipt PDF files locally.
 * 
 * Usage:
 * 1. Go to https://deliveroo.fr/en/orders
 * 2. Open browser console (F12 or Cmd+Option+I)
 * 3. Paste this entire script and press Enter
 * 4. Wait for the script to complete
 * 5. PDF files will be downloaded to your browser's download folder
 */

(async function() {
    console.log('🚀 Starting Deliveroo receipt PDF download...');
    
    // Helper function to trigger file download
    function downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Find all order links - use /orders/ pattern (not /en/orders/)
    const orderLinks = Array.from(document.querySelectorAll('a[href*="/orders/"]'))
        .map(link => {
            const href = link.getAttribute('href');
            return href.startsWith('http') 
                ? href 
                : `https://deliveroo.fr${href.startsWith('/') ? href : '/' + href}`;
        })
        .filter((url, index, self) => self.indexOf(url) === index);
    
    // Extract order IDs
    const orderIds = orderLinks
        .map(url => url.match(/\/orders\/(\d+)/)?.[1])
        .filter(Boolean)
        .filter((id, index, self) => self.indexOf(id) === index); // Remove duplicates
    
    console.log(`📋 Found ${orderIds.length} unique orders`);
    
    if (orderIds.length === 0) {
        console.warn('⚠️  No order IDs found. Make sure you are on the orders page and logged in.');
        return;
    }
    
    const downloadedFiles = [];
    const failedOrders = [];
    
    // Process each order ID
    for (let i = 0; i < orderIds.length; i++) {
        const orderId = orderIds[i];
        console.log(`📦 Processing order ${i + 1}/${orderIds.length}: ${orderId}`);
        
        try {
            // Construct receipt URL directly from order ID
            // Try different patterns since receipt ID might be the same as order ID
            const receiptUrlPatterns = [
                `https://deliveroo.fr/order/receipt/${orderId}`,
            ];
            
            // Try to construct PDF URL directly
            const pdfUrlPatterns = [
                `https://deliveroo.fr/order/receipt/${orderId}.pdf`,
                `https://deliveroo.fr/order/receipt/${orderId}/download`,
                `https://deliveroo.fr/order/receipt/pdf/${orderId}`,
            ];
            
            let success = false;
            
            // First, try direct PDF URLs
            for (const pdfUrl of pdfUrlPatterns) {
                try {
                    const pdfResponse = await fetch(pdfUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/pdf,*/*',
                        },
                        credentials: 'include'
                    });
                    
                    if (pdfResponse.ok) {
                        const contentType = pdfResponse.headers.get('content-type');
                        const blob = await pdfResponse.blob();
                        
                        // Verify it's a PDF (or accept if it's a binary stream)
                        if (contentType && contentType.includes('application/pdf') || 
                            blob.type && blob.type.includes('pdf') ||
                            blob.size > 0) {
                            const filename = `deliveroo_receipt_${orderId}.pdf`;
                            downloadFile(blob, filename);
                            downloadedFiles.push({ orderId, filename, url: pdfUrl });
                            console.log(`✅ Downloaded: ${filename}`);
                            success = true;
                            break;
                        }
                    }
                } catch (e) {
                    continue;
                }
            }
            
            // If direct PDF didn't work, try fetching receipt page first
            if (!success) {
                for (const receiptUrl of receiptUrlPatterns) {
                    try {
                        const receiptResponse = await fetch(receiptUrl, {
                            method: 'GET',
                            headers: {
                                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                            },
                            credentials: 'include'
                        });
                        
                        if (receiptResponse.ok) {
                            const contentType = receiptResponse.headers.get('content-type');
                            
                            // Check if it's already a PDF
                            if (contentType && contentType.includes('application/pdf')) {
                                const blob = await receiptResponse.blob();
                                const filename = `deliveroo_receipt_${orderId}.pdf`;
                                downloadFile(blob, filename);
                                downloadedFiles.push({ orderId, filename, url: receiptUrl });
                                console.log(`✅ Downloaded: ${filename}`);
                                success = true;
                                break;
                            } else {
                                // Parse HTML to find PDF link
                                const html = await receiptResponse.text();
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(html, 'text/html');
                                
                                // Look for PDF download links
                                const pdfLink = doc.querySelector('a[href*=".pdf"], a[href*="/pdf"], a[download*=".pdf"]');
                                if (pdfLink) {
                                    const pdfHref = pdfLink.getAttribute('href');
                                    const pdfUrl = pdfHref.startsWith('http') 
                                        ? pdfHref 
                                        : `https://deliveroo.fr${pdfHref.startsWith('/') ? pdfHref : '/' + pdfHref}`;
                                    
                                    const pdfResponse = await fetch(pdfUrl, {
                                        method: 'GET',
                                        headers: { 'Accept': 'application/pdf,*/*' },
                                        credentials: 'include'
                                    });
                                    
                                    if (pdfResponse.ok) {
                                        const blob = await pdfResponse.blob();
                                        const filename = `deliveroo_receipt_${orderId}.pdf`;
                                        downloadFile(blob, filename);
                                        downloadedFiles.push({ orderId, filename, url: pdfUrl });
                                        console.log(`✅ Downloaded: ${filename}`);
                                        success = true;
                                        break;
                                    }
                                }
                                
                                // Also try searching in HTML content for receipt ID
                                const receiptIdMatch = html.match(/\/order\/receipt\/(\d+)/);
                                if (receiptIdMatch && receiptIdMatch[1] !== orderId) {
                                    const receiptId = receiptIdMatch[1];
                                    const altPdfUrl = `https://deliveroo.fr/order/receipt/${receiptId}.pdf`;
                                    try {
                                        const altResponse = await fetch(altPdfUrl, {
                                            method: 'GET',
                                            headers: { 'Accept': 'application/pdf,*/*' },
                                            credentials: 'include'
                                        });
                                        if (altResponse.ok) {
                                            const blob = await altResponse.blob();
                                            const filename = `deliveroo_receipt_${receiptId}.pdf`;
                                            downloadFile(blob, filename);
                                            downloadedFiles.push({ orderId, receiptId, filename, url: altPdfUrl });
                                            console.log(`✅ Downloaded: ${filename}`);
                                            success = true;
                                            break;
                                        }
                                    } catch (e) {
                                        continue;
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        continue;
                    }
                }
            }
            
            if (!success) {
                throw new Error('Could not find or download PDF');
            }
            
            // Add delay to avoid overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 800));
            
        } catch (error) {
            console.error(`❌ Error processing order ${orderId}:`, error.message);
            failedOrders.push({ orderId, error: error.message });
        }
    }
    
    // Print results
    console.log('\n' + '='.repeat(60));
    console.log('📊 DOWNLOAD COMPLETE');
    console.log('='.repeat(60));
    console.log(`\n✅ Successfully downloaded ${downloadedFiles.length} PDF files`);
    
    if (downloadedFiles.length > 0) {
        console.log('\n📄 Downloaded Files:');
        downloadedFiles.forEach((file, index) => {
            console.log(`${index + 1}. ${file.filename} (Order: ${file.orderId})`);
        });
    }
    
    if (failedOrders.length > 0) {
        console.log(`\n❌ Failed to download ${failedOrders.length} receipts:`);
        failedOrders.forEach(({ orderId, error }) => {
            console.log(`  - Order ${orderId}: ${error}`);
        });
    }
    
    console.log('\n💡 Files saved to your browser\'s default download folder');
    console.log('💡 Tip: Access download info via window.deliverooDownloads');
    
    window.deliverooDownloads = downloadedFiles;
    return downloadedFiles;
})();

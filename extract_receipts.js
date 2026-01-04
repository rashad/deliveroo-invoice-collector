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
    
    // Create UI overlay
    const uiContainer = document.createElement('div');
    uiContainer.id = 'deliveroo-downloader-ui';
    uiContainer.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            max-height: 80vh;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        ">
            <div style="
                background: linear-gradient(135deg, #00ccbc 0%, #00a896 100%);
                color: white;
                padding: 20px;
                font-size: 18px;
                font-weight: 600;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <span>📥 Downloading Receipts</span>
                <button id="deliveroo-downloader-close" style="
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    line-height: 1;
                ">×</button>
            </div>
            <div style="padding: 20px; overflow-y: auto; flex: 1;">
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #666;">
                        <span>Progress</span>
                        <span id="deliveroo-progress-text">0 / 0</span>
                    </div>
                    <div style="
                        width: 100%;
                        height: 8px;
                        background: #e0e0e0;
                        border-radius: 4px;
                        overflow: hidden;
                    ">
                        <div id="deliveroo-progress-bar" style="
                            height: 100%;
                            background: linear-gradient(90deg, #00ccbc 0%, #00a896 100%);
                            width: 0%;
                            transition: width 0.3s ease;
                        "></div>
                    </div>
                </div>
                <div style="margin-bottom: 20px;">
                    <div style="font-size: 14px; color: #666; margin-bottom: 8px;">Current Order</div>
                    <div id="deliveroo-current-order" style="
                        font-size: 16px;
                        font-weight: 500;
                        color: #333;
                        padding: 12px;
                        background: #f5f5f5;
                        border-radius: 8px;
                    ">Preparing...</div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                    <div style="
                        padding: 16px;
                        background: #e8f5e9;
                        border-radius: 8px;
                        text-align: center;
                    ">
                        <div style="font-size: 24px; font-weight: 600; color: #2e7d32;" id="deliveroo-success-count">0</div>
                        <div style="font-size: 12px; color: #666; margin-top: 4px;">Downloaded</div>
                    </div>
                    <div style="
                        padding: 16px;
                        background: #ffebee;
                        border-radius: 8px;
                        text-align: center;
                    ">
                        <div style="font-size: 24px; font-weight: 600; color: #c62828;" id="deliveroo-error-count">0</div>
                        <div style="font-size: 12px; color: #666; margin-top: 4px;">Failed</div>
                    </div>
                </div>
                <div>
                    <div style="font-size: 14px; color: #666; margin-bottom: 8px;">Downloaded Files</div>
                    <div id="deliveroo-file-list" style="
                        max-height: 200px;
                        overflow-y: auto;
                        background: #f9f9f9;
                        border-radius: 8px;
                        padding: 12px;
                    ">
                        <div style="color: #999; font-size: 13px; text-align: center; padding: 20px;">
                            No files downloaded yet
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(uiContainer);
    
    // Helper functions to update UI
    function updateProgress(current, total) {
        const progressBar = document.getElementById('deliveroo-progress-bar');
        const progressText = document.getElementById('deliveroo-progress-text');
        const percentage = total > 0 ? (current / total) * 100 : 0;
        progressBar.style.width = percentage + '%';
        progressText.textContent = `${current} / ${total}`;
    }
    
    function updateCurrentOrder(orderId, status) {
        const currentOrder = document.getElementById('deliveroo-current-order');
        const statusEmoji = status === 'success' ? '✅' : status === 'error' ? '❌' : '📦';
        currentOrder.textContent = `${statusEmoji} Order ${orderId || '...'}`;
    }
    
    function updateCounts(success, failed) {
        document.getElementById('deliveroo-success-count').textContent = success;
        document.getElementById('deliveroo-error-count').textContent = failed;
    }
    
    function addFileToList(filename, orderId) {
        const fileList = document.getElementById('deliveroo-file-list');
        if (fileList.children[0] && fileList.children[0].textContent.includes('No files')) {
            fileList.innerHTML = '';
        }
        const fileItem = document.createElement('div');
        fileItem.style.cssText = 'padding: 8px; margin-bottom: 4px; background: white; border-radius: 4px; font-size: 13px; color: #333;';
        fileItem.textContent = `✅ ${filename}`;
        fileList.insertBefore(fileItem, fileList.firstChild);
    }
    
    // Close button handler
    document.getElementById('deliveroo-downloader-close').onclick = function() {
        uiContainer.style.display = 'none';
    };
    
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
    
    // Initialize UI
    updateProgress(0, orderIds.length);
    updateCurrentOrder('', 'processing');
    updateCounts(0, 0);
    
    // Process each order ID
    for (let i = 0; i < orderIds.length; i++) {
        const orderId = orderIds[i];
        console.log(`📦 Processing order ${i + 1}/${orderIds.length}: ${orderId}`);
        updateCurrentOrder(orderId, 'processing');
        updateProgress(i, orderIds.length);
        
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
                            updateCurrentOrder(orderId, 'success');
                            addFileToList(filename, orderId);
                            updateCounts(downloadedFiles.length, failedOrders.length);
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
                                updateCurrentOrder(orderId, 'success');
                                addFileToList(filename, orderId);
                                updateCounts(downloadedFiles.length, failedOrders.length);
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
                                        updateCurrentOrder(orderId, 'success');
                                        addFileToList(filename, orderId);
                                        updateCounts(downloadedFiles.length, failedOrders.length);
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
                                            updateCurrentOrder(orderId, 'success');
                                            addFileToList(filename, orderId);
                                            updateCounts(downloadedFiles.length, failedOrders.length);
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
            updateCurrentOrder(orderId, 'error');
            updateCounts(downloadedFiles.length, failedOrders.length);
        }
    }
    
    // Final update
    updateProgress(orderIds.length, orderIds.length);
    updateCurrentOrder('', downloadedFiles.length > 0 ? 'success' : 'error');
    
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

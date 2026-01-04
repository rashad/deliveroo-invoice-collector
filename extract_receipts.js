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
                <div style="margin-bottom: 20px;" id="deliveroo-month-filter-section">
                    <div style="font-size: 14px; color: #666; margin-bottom: 8px;">Filter by Month</div>
                    <div id="deliveroo-month-filter-list" style="
                        max-height: 200px;
                        overflow-y: auto;
                        background: #f9f9f9;
                        border-radius: 8px;
                        padding: 12px;
                        margin-bottom: 8px;
                    ">
                        <div style="color: #999; font-size: 13px; text-align: center; padding: 20px;">
                            Loading months...
                        </div>
                    </div>
                    <div id="deliveroo-filter-count" style="
                        font-size: 13px;
                        color: #666;
                        padding: 8px;
                        background: #e3f2fd;
                        border-radius: 6px;
                        text-align: center;
                    ">0 orders selected</div>
                </div>
                <div style="margin-bottom: 20px;" id="deliveroo-folder-section">
                    <div style="font-size: 14px; color: #666; margin-bottom: 8px;">Save Location</div>
                    <div id="deliveroo-folder-status" style="
                        font-size: 14px;
                        color: #333;
                        padding: 12px;
                        background: #fff3cd;
                        border-radius: 8px;
                        margin-bottom: 8px;
                    ">⚠️ Please select a folder</div>
                    <button id="deliveroo-select-folder" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #00ccbc 0%, #00a896 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                    ">📁 Select Folder</button>
                    <button id="deliveroo-start-downloads" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #00ccbc 0%, #00a896 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        margin-top: 8px;
                        display: none;
                    ">🚀 Start Downloads</button>
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
                <div id="deliveroo-email-section" style="display: none; margin-top: 20px;">
                    <button id="deliveroo-email-btn" style="
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #00ccbc 0%, #00a896 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                    ">📧 Open Email Client</button>
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
    
    // File System Access API support check
    const hasFileSystemAccess = 'showDirectoryPicker' in window;
    let directoryHandle = null;
    let selectedFolderPath = null;
    
    // Orders data storage
    let ordersWithDates = [];
    let selectedMonths = new Set();
    
    // Folder selection handler
    const selectFolderBtn = document.getElementById('deliveroo-select-folder');
    const folderStatus = document.getElementById('deliveroo-folder-status');
    
    // Extract orders with dates from the page
    function extractOrdersWithDates() {
        const orderElements = Array.from(document.querySelectorAll('li[class*="OrderList-"]'));
        const orders = [];
        
        orderElements.forEach(li => {
            // Find order link
            const orderLink = li.querySelector('a[href*="/orders/"]');
            if (!orderLink) return;
            
            const href = orderLink.getAttribute('href');
            const orderId = href.match(/\/orders\/(\d+)/)?.[1];
            if (!orderId) return;
            
            // Find date text - look for pattern like "04 January 2026"
            const textElements = li.querySelectorAll('p');
            let dateText = null;
            
            for (const p of textElements) {
                const text = p.textContent || p.innerText;
                // Look for date pattern: day month year (e.g., "04 January 2026")
                const dateMatch = text.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
                if (dateMatch) {
                    dateText = text.match(/(\d{1,2}\s+\w+\s+\d{4})/)?.[0];
                    if (dateText) break;
                }
            }
            
            if (dateText) {
                try {
                    // Parse date - format like "04 January 2026"
                    const date = new Date(dateText);
                    if (!isNaN(date.getTime())) {
                        const month = date.getMonth(); // 0-11
                        const year = date.getFullYear();
                        const monthKey = `${year}-${(month + 1).toString().padStart(2, '0')}`;
                        
                        orders.push({
                            orderId,
                            date,
                            month,
                            year,
                            monthKey,
                            dateText
                        });
                    }
                } catch (e) {
                    console.warn(`Could not parse date for order ${orderId}:`, dateText);
                }
            }
        });
        
        return orders;
    }
    
    // Build month filter UI
    function buildMonthFilterUI(orders) {
        // Get unique months
        const monthMap = new Map();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        
        orders.forEach(order => {
            if (!monthMap.has(order.monthKey)) {
                monthMap.set(order.monthKey, {
                    key: order.monthKey,
                    month: order.month,
                    year: order.year,
                    monthName: monthNames[order.month],
                    count: 0
                });
            }
            monthMap.get(order.monthKey).count++;
        });
        
        // Sort by year (desc), then month (desc) - most recent first
        const months = Array.from(monthMap.values()).sort((a, b) => {
            if (b.year !== a.year) return b.year - a.year;
            return b.month - a.month;
        });
        
        // Build checkbox list
        const filterList = document.getElementById('deliveroo-month-filter-list');
        filterList.innerHTML = '';
        
        if (months.length === 0) {
            filterList.innerHTML = '<div style="color: #999; font-size: 13px; text-align: center; padding: 20px;">No dates found in orders</div>';
            return;
        }
        
        months.forEach(monthInfo => {
            const label = document.createElement('label');
            label.style.cssText = 'display: flex; align-items: center; padding: 8px; cursor: pointer; border-radius: 4px; margin-bottom: 4px;';
            label.onmouseover = function() { this.style.background = '#f0f0f0'; };
            label.onmouseout = function() { this.style.background = 'transparent'; };
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = monthInfo.key;
            checkbox.style.cssText = 'margin-right: 8px; cursor: pointer;';
            checkbox.onchange = function() {
                updateSelectedMonths();
            };
            
            const text = document.createElement('span');
            text.style.cssText = 'flex: 1; font-size: 14px; color: #333;';
            text.textContent = `${monthInfo.monthName} ${monthInfo.year} (${monthInfo.count} orders)`;
            
            label.appendChild(checkbox);
            label.appendChild(text);
            filterList.appendChild(label);
        });
    }
    
    // Update selected months and count
    function updateSelectedMonths() {
        const checkboxes = document.querySelectorAll('#deliveroo-month-filter-list input[type="checkbox"]');
        selectedMonths.clear();
        
        checkboxes.forEach(cb => {
            if (cb.checked) {
                selectedMonths.add(cb.value);
            }
        });
        
        // Count filtered orders
        const filteredCount = ordersWithDates.filter(order => selectedMonths.has(order.monthKey)).length;
        const countDiv = document.getElementById('deliveroo-filter-count');
        countDiv.textContent = `${filteredCount} order${filteredCount !== 1 ? 's' : ''} selected`;
    }
    
    // Filter orders by selected months
    function getFilteredOrderIds() {
        if (selectedMonths.size === 0) {
            return [];
        }
        return ordersWithDates
            .filter(order => selectedMonths.has(order.monthKey))
            .map(order => order.orderId);
    }
    
    async function selectFolder() {
        if (!hasFileSystemAccess) {
            folderStatus.innerHTML = '⚠️ Your browser doesn\'t support folder selection. Files will download to default folder.';
            folderStatus.style.background = '#fff3cd';
            selectFolderBtn.style.display = 'none';
            return;
        }
        
        try {
            directoryHandle = await window.showDirectoryPicker({
                mode: 'readwrite'
            });
            
            // Get folder name
            selectedFolderPath = directoryHandle.name;
            folderStatus.innerHTML = `✅ Selected: <strong>${selectedFolderPath}</strong>`;
            folderStatus.style.background = '#e8f5e9';
            selectFolderBtn.textContent = '📁 Change Folder';
            
            // Show start button
            const startBtn = document.getElementById('deliveroo-start-downloads');
            startBtn.style.display = 'block';
            
            console.log(`📁 Selected folder: ${selectedFolderPath}`);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error selecting folder:', error);
                folderStatus.innerHTML = '❌ Failed to select folder. Using default downloads.';
                folderStatus.style.background = '#ffebee';
            }
        }
    }
    
    // Wrap download logic in a function so it can be called after folder selection
    async function startDownloads() {
        // Hide start button and disable folder button during downloads
        const startBtn = document.getElementById('deliveroo-start-downloads');
        startBtn.style.display = 'none';
        selectFolderBtn.disabled = true;
        selectFolderBtn.style.opacity = '0.5';
        selectFolderBtn.style.cursor = 'not-allowed';
        
        // Helper function to save file (uses File System API if available, otherwise falls back)
    async function saveFile(blob, filename) {
        if (directoryHandle && hasFileSystemAccess) {
            try {
                // Save to selected folder using File System Access API
                const fileHandle = await directoryHandle.getFileHandle(filename, { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(blob);
                await writable.close();
                console.log(`✅ Saved to folder: ${filename}`);
            } catch (error) {
                console.error('Error saving to folder:', error);
                // Fallback to download
                fallbackDownload(blob, filename);
            }
        } else {
            // Fallback to regular download
            fallbackDownload(blob, filename);
        }
    }
    
        // Fallback download function
        function fallbackDownload(blob, filename) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        
        // Get filtered order IDs based on selected months
        const orderIds = getFilteredOrderIds();
        
        console.log(`📋 Filtered to ${orderIds.length} orders for selected months`);
        
        if (orderIds.length === 0) {
            console.warn('⚠️  No orders selected. Please select at least one month.');
            alert('No orders selected. Please select at least one month to download receipts.');
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
        updateProgress(downloadedFiles.length + failedOrders.length, orderIds.length);
        
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
                            await saveFile(blob, filename);
                            downloadedFiles.push({ orderId, filename, url: pdfUrl });
                            console.log(`✅ Downloaded: ${filename}`);
                            updateCurrentOrder(orderId, 'success');
                            addFileToList(filename, orderId);
                            updateCounts(downloadedFiles.length, failedOrders.length);
                            updateProgress(downloadedFiles.length + failedOrders.length, orderIds.length);
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
                                await saveFile(blob, filename);
                                downloadedFiles.push({ orderId, filename, url: receiptUrl });
                                console.log(`✅ Downloaded: ${filename}`);
                                updateCurrentOrder(orderId, 'success');
                                addFileToList(filename, orderId);
                                updateCounts(downloadedFiles.length, failedOrders.length);
                                updateProgress(downloadedFiles.length + failedOrders.length, orderIds.length);
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
                                        await saveFile(blob, filename);
                                        downloadedFiles.push({ orderId, filename, url: pdfUrl });
                                        console.log(`✅ Downloaded: ${filename}`);
                                        updateCurrentOrder(orderId, 'success');
                                        addFileToList(filename, orderId);
                                        updateCounts(downloadedFiles.length, failedOrders.length);
                                        updateProgress(downloadedFiles.length + failedOrders.length, orderIds.length);
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
                                            await saveFile(blob, filename);
                                            downloadedFiles.push({ orderId, receiptId, filename, url: altPdfUrl });
                                            console.log(`✅ Downloaded: ${filename}`);
                                            updateCurrentOrder(orderId, 'success');
                                            addFileToList(filename, orderId);
                                            updateCounts(downloadedFiles.length, failedOrders.length);
                                            updateProgress(downloadedFiles.length + failedOrders.length, orderIds.length);
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
            updateProgress(downloadedFiles.length + failedOrders.length, orderIds.length);
        }
    }
    
    // Final update
    updateProgress(downloadedFiles.length + failedOrders.length, orderIds.length);
    updateCurrentOrder('', downloadedFiles.length > 0 ? 'success' : 'error');
    
    // Re-enable folder button after downloads complete
    selectFolderBtn.disabled = false;
    selectFolderBtn.style.opacity = '1';
    selectFolderBtn.style.cursor = 'pointer';
    
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
    
    const saveLocation = directoryHandle ? `Selected folder: ${selectedFolderPath}` : 'Browser default download folder';
    console.log(`\n💡 Files saved to: ${saveLocation}`);
    console.log('💡 Tip: Access download info via window.deliverooDownloads');
    
    // Show email button if files were downloaded
    if (downloadedFiles.length > 0) {
        const emailSection = document.getElementById('deliveroo-email-section');
        const emailBtn = document.getElementById('deliveroo-email-btn');
        emailSection.style.display = 'block';
        
        emailBtn.onclick = function() {
            const emailTo = 'yourbestfriend@example.com';
            const subject = encodeURIComponent(`Deliveroo Receipts - ${downloadedFiles.length} PDF Files`);
            
            let body = `Dear,\n\nPlease find attached ${downloadedFiles.length} Deliveroo receipt PDF files:\n\n`;
            downloadedFiles.forEach((file, index) => {
                body += `${index + 1}. ${file.filename} (Order ID: ${file.orderId})\n`;
            });
            body += `\n\nAll files have been saved`;
            if (directoryHandle && selectedFolderPath) {
                body += ` to the folder: ${selectedFolderPath}`;
            } else {
                body += ` to your default download folder`;
            }
            body += `.\n\nPlease attach all PDF files from this location.\n\nBest regards`;
            
            const bodyEncoded = encodeURIComponent(body);
            
            // Use Gmail compose URL to open Gmail in browser
            const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(emailTo)}&su=${subject}&body=${bodyEncoded}`;
            window.open(gmailUrl, '_blank');
            
            console.log('📧 Gmail compose opened');
            if (directoryHandle && selectedFolderPath) {
                console.log(`💡 Files are in folder: ${selectedFolderPath}`);
            } else {
                console.log('💡 Files are in your browser\'s default download folder');
            }
        };
    }
    
    // Show completion alert
    let alertMessage = '';
    if (downloadedFiles.length > 0 && failedOrders.length === 0) {
        alertMessage = `✅ Success!\n\nSuccessfully downloaded ${downloadedFiles.length} receipt${downloadedFiles.length !== 1 ? 's' : ''}.\n\nFiles saved to: ${directoryHandle ? selectedFolderPath : 'your default download folder'}`;
    } else if (downloadedFiles.length > 0 && failedOrders.length > 0) {
        alertMessage = `⚠️ Partial Success\n\nDownloaded: ${downloadedFiles.length} receipt${downloadedFiles.length !== 1 ? 's' : ''}\nFailed: ${failedOrders.length} receipt${failedOrders.length !== 1 ? 's' : ''}\n\nFiles saved to: ${directoryHandle ? selectedFolderPath : 'your default download folder'}`;
    } else {
        alertMessage = `❌ No Downloads\n\nNo receipts were downloaded.\n\nPlease check the console for details.`;
    }
    
    alert(alertMessage);
    
        window.deliverooDownloads = downloadedFiles;
        return downloadedFiles;
    }
    
    // Handle folder selection
    selectFolderBtn.onclick = async function() {
        await selectFolder();
    };
    
    // Handle start downloads button
    const startBtn = document.getElementById('deliveroo-start-downloads');
    startBtn.onclick = async function() {
        // Check if months are selected
        if (selectedMonths.size === 0) {
            alert('Please select at least one month to download receipts.');
            return;
        }
        await startDownloads();
    };
    
    // Extract orders and build filter UI on script start
    ordersWithDates = extractOrdersWithDates();
    if (ordersWithDates.length > 0) {
        buildMonthFilterUI(ordersWithDates);
        updateSelectedMonths();
    }
    
    // If File System API not available, show start button immediately
    if (!hasFileSystemAccess) {
        folderStatus.innerHTML = '⚠️ Browser doesn\'t support folder selection. Files will download to default folder.';
        folderStatus.style.background = '#fff3cd';
        startBtn.style.display = 'block';
        startBtn.textContent = '🚀 Start Downloads';
    } else {
        // If File System API is available, wait for folder selection
        folderStatus.innerHTML = '⏳ Please select a folder to save receipts...';
        folderStatus.style.background = '#e3f2fd';
    }
})();

// 二维码生成器
document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const generateBtn = document.getElementById('generateBtn');
    const qrcodeCanvas = document.getElementById('qrcodeCanvas');
    const downloadPNGBtn = document.getElementById('downloadPNG');
    const downloadSVGBtn = document.getElementById('downloadSVGBtn');
    const printQRBtn = document.getElementById('printQR');
    const regenerateBtn = document.getElementById('regenerateQR');
    const copyURLBtn = document.getElementById('copyURL');
    
    let currentQRCode = null;
    
    // 页面加载时自动生成二维码
    generateQRCode(urlInput.value);
    
    // 生成按钮点击事件
    generateBtn.addEventListener('click', function() {
        const url = urlInput.value.trim();
        if (!url) {
            alert('请输入有效的URL');
            return;
        }
        
        generateQRCode(url);
        showNotification('二维码已生成', 'success');
    });
    
    // 输入框回车事件
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });
    
    // 重新生成按钮
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', function() {
            generateQRCode(urlInput.value);
            showNotification('重新生成二维码', 'info');
        });
    }
    
    // 复制URL按钮
    if (copyURLBtn) {
        copyURLBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(urlInput.value)
                .then(() => showNotification('URL已复制到剪贴板', 'success'))
                .catch(err => console.error('复制失败:', err));
        });
    }
    
    // 下载PNG
    downloadPNGBtn.addEventListener('click', function() {
        downloadQRCode('png');
    });
    
    // 下载SVG
    if (downloadSVGBtn) {
        downloadSVGBtn.addEventListener('click', function() {
            downloadQRCode('svg');
        });
    }
    
    // 打印二维码
    if (printQRBtn) {
        printQRBtn.addEventListener('click', function() {
            printQRCode();
        });
    }
    
    // 生成二维码函数
    function generateQRCode(url) {
        // 清除现有二维码
        qrcodeCanvas.innerHTML = '';
        
        // 生成新的二维码
        currentQRCode = new QRCode(qrcodeCanvas, {
            text: url,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // 添加点击扫描提示
        const scanHint = document.createElement('div');
        scanHint.className = 'scan-hint';
        scanHint.innerHTML = `
            <i class="fas fa-mobile-alt"></i>
            <p>使用手机扫描二维码</p>
        `;
        qrcodeCanvas.appendChild(scanHint);
        
        // 更新页面标题显示当前URL
        updatePageTitle(url);
    }
    
    // 下载二维码
    function downloadQRCode(format) {
        if (!currentQRCode) {
            alert('请先生成二维码');
            return;
        }
        
        const url = urlInput.value;
        const filename = `ecommerce-ux-qrcode-${Date.now()}.${format}`;
        
        if (format === 'png') {
            // 对于PNG，使用canvas导出
            const canvas = qrcodeCanvas.querySelector('canvas');
            if (!canvas) {
                alert('无法获取二维码图像');
                return;
            }
            
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } else if (format === 'svg') {
            // SVG需要特殊处理
            const svg = qrcodeCanvas.querySelector('svg');
            if (!svg) {
                alert('SVG格式暂不可用');
                return;
            }
            
            const serializer = new XMLSerializer();
            const source = serializer.serializeToString(svg);
            const blob = new Blob([source], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.download = filename;
            link.href = url;
            link.click();
            
            // 清理URL对象
            setTimeout(() => URL.revokeObjectURL(url), 100);
        }
        
        showNotification(`二维码已下载为${format.toUpperCase()}格式`, 'success');
    }
    
    // 打印二维码
    function printQRCode() {
        const printWindow = window.open('', '_blank');
        const url = urlInput.value;
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>打印二维码 - 电商UX演示</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
                    .qr-container { margin: 40px auto; max-width: 300px; }
                    .info { margin-top: 20px; font-size: 14px; color: #666; }
                    @media print {
                        .no-print { display: none; }
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                <h1>电商UX优化演示</h1>
                <p>扫描二维码访问演示页面</p>
                
                <div class="qr-container">
                    <div id="printQRCode"></div>
                </div>
                
                <div class="info">
                    <p>URL: ${url}</p>
                    <p>生成时间: ${new Date().toLocaleString()}</p>
                </div>
                
                <button class="no-print" onclick="window.print()">打印</button>
                <button class="no-print" onclick="window.close()">关闭</button>
                
                <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
                <script>
                    new QRCode(document.getElementById('printQRCode'), {
                        text: '${url}',
                        width: 256,
                        height: 256,
                        colorDark: '#000000',
                        colorLight: '#ffffff'
                    });
                    
                    // 自动触发打印
                    setTimeout(() => {
                        window.print();
                    }, 500);
                </script>
            </body>
            </html>
        `);
        
        printWindow.document.close();
    }
    
    // 更新页面标题
    function updatePageTitle(url) {
        document.title = `二维码生成 - ${new URL(url).hostname}`;
    }
    
    // 显示通知
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `qr-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .scan-hint {
            position: absolute;
            bottom: 10px;
            left: 0;
            right: 0;
            text-align: center;
            color: #666;
            font-size: 12px;
            background: rgba(255,255,255,0.9);
            padding: 8px;
            border-radius: 0 0 8px 8px;
        }
        
        .scan-hint i {
            font-size: 16px;
            margin-bottom: 4px;
            display: block;
        }
    `;
    document.head.appendChild(style);
    
    // 自动检测并填充本地URL
    detectLocalURL();
    
    function detectLocalURL() {
        // 如果是本地开发环境，自动填充本地URL
        if (window.location.protocol === 'file:') {
            // 无法直接获取本地文件系统的URL，使用占位符
            urlInput.value = 'http://localhost:8000';
        } else if (window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1') {
            // 本地服务器
            urlInput.value = window.location.href;
        }
    }
    
    // 分享功能
    initSharing();
    
    function initSharing() {
        // 添加分享按钮
        const shareBtn = document.createElement('button');
        shareBtn.id = 'shareQR';
        shareBtn.className = 'btn-secondary';
        shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> 分享二维码';
        
        const downloadOptions = document.querySelector('.download-options');
        if (downloadOptions) {
            downloadOptions.appendChild(shareBtn);
        }
        
        shareBtn.addEventListener('click', async function() {
            if (navigator.share) {
                try {
                    const url = urlInput.value;
                    await navigator.share({
                        title: '电商UX优化演示',
                        text: '扫描二维码查看电商用户体验优化方案',
                        url: url
                    });
                } catch (error) {
                    console.log('分享取消或失败:', error);
                }
            } else {
                // 备用方案：复制链接
                navigator.clipboard.writeText(urlInput.value)
                    .then(() => showNotification('链接已复制，可以分享给他人', 'success'));
            }
        });
    }
});
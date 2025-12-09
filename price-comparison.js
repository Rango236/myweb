// 智能比价模式交互脚本
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initSearchFunctionality();
    initPriceChart();
    initPlatformComparison();
    initPriceAlerts();
    initSimilarProducts();
    initPriceHistory();
    initFloatingComparison();
    initScreenshotTool();
    initEventListeners();
    loadMockData();
});

// 搜索功能
function initSearchFunctionality() {
    const searchInput = document.getElementById('productSearch');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const scanButton = document.getElementById('scanProduct');
    
    // 搜索建议数据
    const suggestions = [
        'iPhone 14 Pro',
        'MacBook Air M2',
        '索尼 PlayStation 5',
        '戴森吹风机',
        '华为 Mate 50',
        '小米电视',
        '佳能相机',
        '耐克运动鞋',
        '茅台酒',
        '乐高积木'
    ];
    
    // 输入事件
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        if (query.length > 0) {
            const filtered = suggestions.filter(s => 
                s.toLowerCase().includes(query)
            );
            renderSearchSuggestions(filtered);
        } else {
            renderSearchSuggestions(suggestions.slice(0, 5));
        }
    });
    
    // 渲染搜索建议
    function renderSearchSuggestions(suggestionsList) {
        searchSuggestions.innerHTML = '';
        suggestionsList.forEach(suggestion => {
            const element = document.createElement('div');
            element.className = 'search-suggestion';
            element.textContent = suggestion;
            element.addEventListener('click', () => {
                searchInput.value = suggestion;
                performSearch(suggestion);
            });
            searchSuggestions.appendChild(element);
        });
    }
    
    // 执行搜索
    function performSearch(query) {
        if (!query.trim()) return;
        
        showNotification(`正在搜索: ${query}`, 'info');
        
        // 模拟搜索延迟
        setTimeout(() => {
            updateProductInfo(query);
            showNotification(`找到 ${Math.floor(Math.random() * 1000) + 500} 个结果`, 'success');
        }, 800);
    }
    
    // 扫描功能
    scanButton.addEventListener('click', function() {
        showScreenshotTool();
    });
    
    // 初始显示热门建议
    renderSearchSuggestions(suggestions.slice(0, 5));
}

// 价格图表
function initPriceChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    const timeButtons = document.querySelectorAll('.time-btn');
    
    // 模拟价格数据
    const priceData = {
        labels: generateDateLabels(30),
        datasets: [
            {
                label: '淘宝',
                data: generateRandomPrices(30, 8000, 9000),
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            },
            {
                label: '京东',
                data: generateRandomPrices(30, 8200, 9200),
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            },
            {
                label: '拼多多',
                data: generateRandomPrices(30, 7500, 8500),
                borderColor: '#FF6B00',
                backgroundColor: 'rgba(255, 107, 0, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }
        ]
    };
    
    // 创建图表
    const priceChart = new Chart(ctx, {
        type: 'line',
        data: priceData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '¥' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'nearest'
            }
        }
    });
    
    // 时间范围切换
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有激活状态
            timeButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前激活状态
            this.classList.add('active');
            
            const days = parseInt(this.dataset.range);
            updateChartData(days);
        });
    });
    
    // 更新图表数据
    function updateChartData(days) {
        priceChart.data.labels = generateDateLabels(days);
        priceChart.data.datasets[0].data = generateRandomPrices(days, 8000, 9000);
        priceChart.data.datasets[1].data = generateRandomPrices(days, 8200, 9200);
        priceChart.data.datasets[2].data = generateRandomPrices(days, 7500, 8500);
        priceChart.update();
        
        showNotification(`显示 ${days} 天价格趋势`, 'info');
    }
    
    // 辅助函数：生成日期标签
    function generateDateLabels(days) {
        const labels = [];
        const now = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            if (days <= 30) {
                labels.push(date.getDate() + '日');
            } else if (days <= 90) {
                labels.push((date.getMonth() + 1) + '/' + date.getDate());
            } else {
                labels.push((date.getMonth() + 1) + '月');
            }
        }
        
        return labels;
    }
    
    // 辅助函数：生成随机价格数据
    function generateRandomPrices(days, min, max) {
        const prices = [];
        let current = (min + max) / 2;
        
        for (let i = 0; i < days; i++) {
            // 随机波动
            const change = (Math.random() - 0.5) * (max - min) * 0.1;
            current += change;
            
            // 保持在范围内
            current = Math.max(min, Math.min(max, current));
            
            prices.push(Math.round(current));
        }
        
        return prices;
    }
}

// 平台比价
function initPlatformComparison() {
    const platformsGrid = document.getElementById('platformsGrid');
    const compareAllButton = document.getElementById('compareAllPlatforms');
    
    // 平台数据
    const platforms = [
        {
            id: 'taobao',
            name: '淘宝',
            price: 7999,
            originalPrice: 8999,
            shipping: '包邮',
            rating: 4.8,
            features: ['官方旗舰店', '7天无理由', '正品保证', '急速退款'],
            isBest: true
        },
        {
            id: 'jd',
            name: '京东',
            price: 8199,
            originalPrice: 8999,
            shipping: '京东物流',
            rating: 4.9,
            features: ['自营', '次日达', '以旧换新', '延保服务']
        },
        {
            id: 'pdd',
            name: '拼多多',
            price: 7599,
            originalPrice: 8799,
            shipping: '部分包邮',
            rating: 4.5,
            features: ['百亿补贴', '品牌特卖', '拼单更优惠']
        },
        {
            id: 'amazon',
            name: '亚马逊',
            price: 8499,
            originalPrice: 8999,
            shipping: '海外直邮',
            rating: 4.7,
            features: ['海外正品', '30天退换', 'Prime会员免邮']
        }
    ];
    
    // 渲染平台卡片
    function renderPlatforms() {
        platformsGrid.innerHTML = '';
        
        platforms.forEach(platform => {
            const card = document.createElement('div');
            card.className = `platform-card ${platform.isBest ? 'best' : ''}`;
            card.innerHTML = `
                <div class="platform-header">
                    <div class="platform-name">
                        <span class="platform-logo ${platform.id}">
                            ${platform.name.charAt(0)}
                        </span>
                        ${platform.name}
                    </div>
                    <div class="platform-rating">
                        <i class="fas fa-star"></i>
                        ${platform.rating}
                    </div>
                </div>
                
                <div class="platform-price">¥${platform.price.toLocaleString()}</div>
                <div class="platform-shipping">
                    <i class="fas fa-shipping-fast"></i>
                    ${platform.shipping}
                    ${platform.originalPrice ? 
                        `<span style="text-decoration: line-through; color: #999; margin-left: 8px;">
                            ¥${platform.originalPrice.toLocaleString()}
                        </span>` : ''}
                </div>
                
                <ul class="platform-features">
                    ${platform.features.map(feature => `
                        <li>
                            <i class="fas fa-check-circle"></i>
                            ${feature}
                        </li>
                    `).join('')}
                </ul>
                
                <div class="platform-actions">
                    <button class="platform-action-btn" onclick="viewOnPlatform('${platform.id}')">
                        <i class="fas fa-external-link-alt"></i>
                        查看
                    </button>
                    <button class="platform-action-btn buy" onclick="buyOnPlatform('${platform.id}')">
                        <i class="fas fa-shopping-cart"></i>
                        购买
                    </button>
                </div>
            `;
            
            platformsGrid.appendChild(card);
        });
    }
    
    // 全部平台比价
    compareAllButton.addEventListener('click', function() {
        showNotification('正在比较所有平台价格...', 'info');
        
        // 模拟比价过程
        setTimeout(() => {
            const bestPlatform = platforms.reduce((best, current) => 
                current.price < best.price ? current : best
            );
            
            showNotification(`最优平台: ${bestPlatform.name} - ¥${bestPlatform.price}`, 'success');
        }, 1500);
    });
    
    // 初始渲染
    renderPlatforms();
}

// 降价提醒
function initPriceAlerts() {
    const priceAlertToggle = document.getElementById('priceAlertToggle');
    const saveAlertButton = document.getElementById('saveAlert');
    
    // 保存提醒设置
    saveAlertButton.addEventListener('click', function() {
        const targetPrice = document.getElementById('targetPrice').value;
        const selectedPlatforms = Array.from(
            document.querySelectorAll('input[name="platform"]:checked')
        ).map(input => input.value);
        
        const selectedNotifications = Array.from(
            document.querySelectorAll('input[name="notification"]:checked')
        ).map(input => input.value);
        
        const isEnabled = priceAlertToggle.checked;
        
        if (isEnabled) {
            showNotification(`降价提醒已设置: 目标价格¥${targetPrice}`, 'success');
            
            // 保存到本地存储
            const alertSettings = {
                enabled: true,
                targetPrice: targetPrice,
                platforms: selectedPlatforms,
                notifications: selectedNotifications,
                lastUpdated: new Date().toISOString()
            };
            
            localStorage.setItem('priceAlertSettings', JSON.stringify(alertSettings));
        } else {
            showNotification('降价提醒已关闭', 'info');
            localStorage.removeItem('priceAlertSettings');
        }
    });
    
    // 加载保存的设置
    function loadSavedSettings() {
        const saved = localStorage.getItem('priceAlertSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                priceAlertToggle.checked = settings.enabled;
                document.getElementById('targetPrice').value = settings.targetPrice;
                
                // 恢复平台选择
                document.querySelectorAll('input[name="platform"]').forEach(input => {
                    input.checked = settings.platforms.includes(input.value);
                });
                
                // 恢复通知选择
                document.querySelectorAll('input[name="notification"]').forEach(input => {
                    input.checked = settings.notifications.includes(input.value);
                });
                
                showNotification('已加载保存的提醒设置', 'info');
            } catch (error) {
                console.error('加载设置失败:', error);
            }
        }
    }
    
    // 加载保存的设置
    loadSavedSettings();
}

// 相似商品推荐
function initSimilarProducts() {
    const similarGrid = document.getElementById('similarGrid');
    const refreshButton = document.getElementById('refreshSimilar');
    
    // 相似商品数据
    let similarProducts = [
        {
            id: 1,
            name: 'iPhone 14 Pro Max 256GB',
            price: 8999,
            originalPrice: 9999,
            discount: '-10%',
            imageColor: '#1a237e'
        },
        {
            id: 2,
            name: '三星 Galaxy S23 Ultra',
            price: 8499,
            originalPrice: 9499,
            discount: '-11%',
            imageColor: '#311b92'
        },
        {
            id: 3,
            name: '华为 Mate 50 Pro',
            price: 6999,
            originalPrice: 7999,
            discount: '-13%',
            imageColor: '#004d40'
        },
        {
            id: 4,
            name: '小米 13 Pro',
            price: 4999,
            originalPrice: 5499,
            discount: '-9%',
            imageColor: '#bf360c'
        },
        {
            id: 5,
            name: 'OPPO Find X6 Pro',
            price: 5999,
            originalPrice: 6499,
            discount: '-8%',
            imageColor: '#0d47a1'
        },
        {
            id: 6,
            name: 'vivo X90 Pro+',
            price: 6499,
            originalPrice: 6999,
            discount: '-7%',
            imageColor: '#880e4f'
        }
    ];
    
    // 渲染相似商品
    function renderSimilarProducts() {
        similarGrid.innerHTML = '';
        
        similarProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'similar-card';
            card.innerHTML = `
                <div class="similar-image" style="background: linear-gradient(45deg, ${product.imageColor}, #${Math.floor(Math.random()*16777215).toString(16)})">
                    ${product.discount ? `<div class="similar-badge">${product.discount}</div>` : ''}
                </div>
                <div class="similar-info">
                    <h4 class="similar-name">${product.name}</h4>
                    <p class="similar-price">¥${product.price.toLocaleString()}</p>
                    ${product.originalPrice ? 
                        `<p class="similar-original-price">¥${product.originalPrice.toLocaleString()}</p>` : ''}
                </div>
            `;
            
            card.addEventListener('click', () => {
                viewProductDetails(product.id);
            });
            
            similarGrid.appendChild(card);
        });
    }
    
    // 刷新相似商品
    refreshButton.addEventListener('click', function() {
        // 添加旋转动画
        this.innerHTML = '<span class="loading"></span> 加载中';
        
        // 模拟API调用延迟
        setTimeout(() => {
            // 随机排序以显示新商品
            similarProducts = [...similarProducts].sort(() => Math.random() - 0.5);
            renderSimilarProducts();
            
            this.innerHTML = '<i class="fas fa-sync-alt"></i> 换一批';
            showNotification('已更新相似商品推荐', 'success');
        }, 1000);
    });
    
    // 初始渲染
    renderSimilarProducts();
}

// 价格历史记录
function initPriceHistory() {
    const historyTable = document.querySelector('#historyTable tbody');
    const exportButton = document.getElementById('exportHistory');
    
    // 历史价格数据
    const priceHistory = [
        { date: '2023-10-15', platform: '淘宝', price: 8999, change: -300, action: '降价' },
        { date: '2023-10-10', platform: '京东', price: 9199, change: 0, action: '稳定' },
        { date: '2023-10-05', platform: '拼多多', price: 8499, change: -500, action: '大促' },
        { date: '2023-10-01', platform: '淘宝', price: 9299, change: 200, action: '调价' },
        { date: '2023-09-25', platform: '京东', price: 9099, change: -100, action: '活动' },
        { date: '2023-09-20', platform: '拼多多', price: 8999, change: -300, action: '补贴' },
        { date: '2023-09-15', platform: '淘宝', price: 9499, change: 0, action: '上新' }
    ];
    
    // 渲染历史记录
    function renderPriceHistory() {
        historyTable.innerHTML = '';
        
        priceHistory.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.date}</td>
                <td>
                    <span class="platform-logo ${record.platform === '淘宝' ? 'taobao' : record.platform === '京东' ? 'jd' : 'pdd'}">
                        ${record.platform.charAt(0)}
                    </span>
                    ${record.platform}
                </td>
                <td>¥${record.price.toLocaleString()}</td>
                <td class="price-change-cell ${record.change < 0 ? 'down' : record.change > 0 ? 'up' : ''}">
                    ${record.change !== 0 ? 
                        `<i class="fas fa-arrow-${record.change < 0 ? 'down' : 'up'}"></i>
                         ${Math.abs(record.change)}` : 
                        '—'}
                </td>
                <td>
                    <span class="tag ${record.action === '降价' || record.action === '大促' ? 'discount' : 
                                    record.action === '补贴' ? 'best-price' : ''}">
                        ${record.action}
                    </span>
                </td>
            `;
            
            historyTable.appendChild(row);
        });
    }
    
    // 导出数据
    exportButton.addEventListener('click', function() {
        // 创建CSV内容
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "日期,平台,价格,变化,备注\n";
        
        priceHistory.forEach(record => {
            csvContent += `${record.date},${record.platform},${record.price},${record.change},${record.action}\n`;
        });
        
        // 创建下载链接
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "价格历史记录.csv");
        document.body.appendChild(link);
        
        // 触发下载
        link.click();
        document.body.removeChild(link);
        
        showNotification('价格历史记录已导出为CSV文件', 'success');
    });
    
    // 初始渲染
    renderPriceHistory();
}

// 浮动比价工具
function initFloatingComparison() {
    const floatingBtn = document.getElementById('floatingCompare');
    const floatingPanel = document.getElementById('floatingPanel');
    const closePanel = document.querySelector('.close-panel');
    const quickSearchInput = document.getElementById('quickSearch');
    const quickSearchBtn = document.getElementById('quickSearchBtn');
    const quickResults = document.getElementById('quickResults');
    
    // 切换浮动面板显示
    floatingBtn.addEventListener('click', function() {
        floatingPanel.classList.toggle('show');
    });
    
    // 关闭面板
    closePanel.addEventListener('click', function() {
        floatingPanel.classList.remove('show');
    });
    
    // 点击外部关闭
    document.addEventListener('click', function(event) {
        if (!floatingBtn.contains(event.target) && !floatingPanel.contains(event.target)) {
            floatingPanel.classList.remove('show');
        }
    });
    
    // 快速搜索
    quickSearchBtn.addEventListener('click', performQuickSearch);
    quickSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performQuickSearch();
        }
    });
    
    function performQuickSearch() {
        const query = quickSearchInput.value.trim();
        if (!query) return;
        
        showNotification(`快速搜索: ${query}`, 'info');
        
        // 模拟搜索
        const mockResults = [
            { name: `${query} - 淘宝`, price: Math.floor(Math.random() * 1000) + 500 },
            { name: `${query} - 京东`, price: Math.floor(Math.random() * 1000) + 600 },
            { name: `${query} - 拼多多`, price: Math.floor(Math.random() * 1000) + 400 }
        ];
        
        renderQuickResults(mockResults);
    }
    
    function renderQuickResults(results) {
        quickResults.innerHTML = '';
        
        results.forEach(result => {
            const element = document.createElement('div');
            element.className = 'quick-result';
            element.innerHTML = `
                <div class="quick-result-name">${result.name}</div>
                <div class="quick-result-price">¥${result.price}</div>
            `;
            
            element.addEventListener('click', () => {
                quickSearchInput.value = result.name.split(' - ')[0];
                floatingPanel.classList.remove('show');
                performSearch(quickSearchInput.value);
            });
            
            quickResults.appendChild(element);
        });
    }
    
    // 初始显示一些示例
    renderQuickResults([
        { name: '无线耳机', price: 299 },
        { name: '机械键盘', price: 499 },
        { name: '智能手表', price: 899 }
    ]);
}

// 截图比价工具
function initScreenshotTool() {
    const screenshotTool = document.getElementById('screenshotTool');
    const closeScreenshot = document.querySelector('.close-screenshot');
    const screenshotArea = document.getElementById('screenshotArea');
    const screenshotUpload = document.getElementById('screenshotUpload');
    const takeScreenshotBtn = document.getElementById('takeScreenshot');
    const uploadScreenshotBtn = document.getElementById('uploadScreenshot');
    const analyzeScreenshotBtn = document.getElementById('analyzeScreenshot');
    const screenshotResults = document.getElementById('screenshotResults');
    
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    // 显示截图工具
    window.showScreenshotTool = function() {
        screenshotTool.classList.add('show');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    };
    
    // 隐藏截图工具
    function hideScreenshotTool() {
        screenshotTool.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // 关闭按钮
    closeScreenshot.addEventListener('click', hideScreenshotTool);
    overlay.addEventListener('click', hideScreenshotTool);
    
    // 拖拽上传
    screenshotArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });
    
    screenshotArea.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
    });
    
    screenshotArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    });
    
    // 点击上传
    screenshotArea.addEventListener('click', function() {
        screenshotUpload.click();
    });
    
    // 文件选择
    screenshotUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });
    
    // 处理图片上传
    function handleImageUpload(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // 显示预览
            screenshotArea.innerHTML = `
                <img src="${e.target.result}" alt="上传的图片" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            `;
            
            showNotification('图片上传成功，点击识别按钮进行比价', 'success');
        };
        
        reader.readAsDataURL(file);
    }
    
    // 截屏功能
    takeScreenshotBtn.addEventListener('click', function() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
            showNotification('您的浏览器不支持屏幕截图功能', 'error');
            return;
        }
        
        showNotification('请选择要截图的屏幕或窗口', 'info');
        
        navigator.mediaDevices.getDisplayMedia({ video: true })
            .then(stream => {
                const video = document.createElement('video');
                video.srcObject = stream;
                video.play();
                
                video.onloadedmetadata = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0);
                    
                    // 停止所有视频轨道
                    stream.getTracks().forEach(track => track.stop());
                    
                    // 显示截图
                    const imageUrl = canvas.toDataURL('image/png');
                    screenshotArea.innerHTML = `
                        <img src="${imageUrl}" alt="截图" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                    `;
                    
                    showNotification('截图成功，点击识别按钮进行比价', 'success');
                };
            })
            .catch(error => {
                console.error('截图失败:', error);
                showNotification('截图失败: ' + error.message, 'error');
            });
    });
    
    // 上传按钮
    uploadScreenshotBtn.addEventListener('click', function() {
        screenshotUpload.click();
    });
    
    // 分析截图
    analyzeScreenshotBtn.addEventListener('click', function() {
        const img = screenshotArea.querySelector('img');
        if (!img) {
            showNotification('请先上传或截取图片', 'warning');
            return;
        }
        
        showNotification('正在分析图片中的商品信息...', 'info');
        
        // 模拟OCR识别和比价
        setTimeout(() => {
            const mockResults = [
                { product: 'iPhone 14 Pro 256GB', confidence: '95%', price: 7999, platform: '淘宝' },
                { product: '类似商品: iPhone 14 256GB', confidence: '87%', price: 6999, platform: '京东' },
                { product: '类似商品: iPhone 13 Pro 256GB', confidence: '76%', price: 6499, platform: '拼多多' }
            ];
            
            renderScreenshotResults(mockResults);
            showNotification('识别完成，找到3个相关商品', 'success');
        }, 2000);
    });
    
    // 渲染识别结果
    function renderScreenshotResults(results) {
        screenshotResults.innerHTML = '';
        
        results.forEach(result => {
            const element = document.createElement('div');
            element.className = 'screenshot-result-item';
            element.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <strong>${result.product}</strong>
                    <span style="font-size: 12px; color: #4CAF50;">${result.confidence}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>平台: ${result.platform}</span>
                    <strong style="color: #F44336;">¥${result.price.toLocaleString()}</strong>
                </div>
            `;
            
            screenshotResults.appendChild(element);
        });
    }
}

// 事件监听器
function initEventListeners() {
    // 帮助按钮
    document.getElementById('priceHelp').addEventListener('click', function() {
        showNotification('智能比价功能说明：\n1. 搜索商品查看价格趋势\n2. 比较不同平台价格\n3. 设置降价提醒\n4. 使用截图比价功能', 'info', 5000);
    });
}

// 加载模拟数据
function loadMockData() {
    // 模拟初始商品信息
    updateProductInfo('iPhone 14 Pro 256GB');
}

// 更新商品信息
function updateProductInfo(productName) {
    document.getElementById('productName').textContent = productName;
    
    // 更新商品图片
    const productImage = document.getElementById('productImage');
    productImage.alt = productName;
    
    // 随机选择图片颜色
    const colors = ['#4CAF50', '#2196F3', '#FF6B00', '#9C27B0', '#F44336'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    productImage.src = `https://via.placeholder.com/120x120/${randomColor.substring(1)}/FFFFFF?text=${encodeURIComponent(productName.substring(0, 2))}`;
    
    // 更新价格信息
    const randomPrice = Math.floor(Math.random() * 3000) + 6000;
    document.getElementById('currentLowestPrice').textContent = `¥${randomPrice.toLocaleString()}`;
    
    showNotification(`已切换到商品: ${productName}`, 'success');
}

// 平台操作函数
function viewOnPlatform(platform) {
    const platformNames = {
        'taobao': '淘宝',
        'jd': '京东',
        'pdd': '拼多多',
        'amazon': '亚马逊'
    };
    
    showNotification(`正在打开${platformNames[platform]}商品页面...`, 'info');
    
    // 模拟延迟后打开新窗口
    setTimeout(() => {
        window.open(`https://www.${platform}.com/search?q=${encodeURIComponent(document.getElementById('productName').textContent)}`, '_blank');
    }, 500);
}

function buyOnPlatform(platform) {
    const platformNames = {
        'taobao': '淘宝',
        'jd': '京东',
        'pdd': '拼多多',
        'amazon': '亚马逊'
    };
    
    showNotification(`正在跳转到${platformNames[platform]}购买页面...`, 'info');
    
    // 模拟购买流程
    setTimeout(() => {
        showNotification(`商品已添加到${platformNames[platform]}购物车`, 'success');
    }, 1000);
}

// 查看商品详情
function viewProductDetails(productId) {
    showNotification(`正在加载商品详情...`, 'info');
    
    // 模拟加载
    setTimeout(() => {
        const products = {
            1: 'iPhone 14 Pro Max 256GB',
            2: '三星 Galaxy S23 Ultra',
            3: '华为 Mate 50 Pro',
            4: '小米 13 Pro',
            5: 'OPPO Find X6 Pro',
            6: 'vivo X90 Pro+'
        };
        
        updateProductInfo(products[productId]);
        showNotification(`已切换到商品: ${products[productId]}`, 'success');
    }, 800);
}

// 显示通知
function showNotification(message, type = 'info', duration = 3000) {
    // 移除现有通知
    const existing = document.querySelector('.price-notification');
    if (existing) {
        existing.remove();
    }
    
    // 创建新通知
    const notification = document.createElement('div');
    notification.className = `price-notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        background: ${type === 'success' ? '#4CAF50' : 
                     type === 'error' ? '#F44336' : 
                     type === 'warning' ? '#FFC107' : '#2196F3'};
        color: white;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: priceNotificationIn 0.3s ease, priceNotificationOut 0.3s ease ${duration - 300}ms;
        max-width: 80%;
        text-align: center;
        white-space: pre-line;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 自动移除
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, duration);
}

// 添加通知动画
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes priceNotificationIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes priceNotificationOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(notificationStyle);

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl+F 聚焦搜索框
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        document.getElementById('productSearch').focus();
    }
    
    // Ctrl+S 打开截图工具
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        showScreenshotTool();
    }
    
    // ESC 关闭所有弹窗
    if (e.key === 'Escape') {
        const screenshotTool = document.getElementById('screenshotTool');
        const floatingPanel = document.getElementById('floatingPanel');
        
        if (screenshotTool.classList.contains('show')) {
            screenshotTool.classList.remove('show');
            document.querySelector('.overlay').classList.remove('show');
        }
        
        if (floatingPanel.classList.contains('show')) {
            floatingPanel.classList.remove('show');
        }
    }
});
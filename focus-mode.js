// 极速模式交互脚本
document.addEventListener('DOMContentLoaded', function() {
    initCommandPanel();
    initQuickCommands();
    initRecentPurchases();
    initSuperFilters();
    initSearchPreview();
    initFAB();
    initKeyboardShortcuts();
});

// 命令面板
function initCommandPanel() {
    const commandInput = document.getElementById('commandInput');
    const commandSubmit = document.getElementById('commandSubmit');
    const commandSuggestions = document.getElementById('commandSuggestions');
    
    // 命令建议数据
    const suggestions = [
        '搜索 手机',
        '搜索 笔记本电脑',
        '搜索 耳机',
        '打开 购物车',
        '查看 订单',
        '快速购买 咖啡',
        '过滤器 价格<1000',
        '排序 销量',
        '清空 搜索历史'
    ];
    
    // 渲染命令建议
    function renderSuggestions() {
        commandSuggestions.innerHTML = '';
        suggestions.forEach(suggestion => {
            const element = document.createElement('div');
            element.className = 'command-suggestion';
            element.textContent = suggestion;
            element.addEventListener('click', () => {
                commandInput.value = suggestion.replace('搜索 ', '');
                handleCommand(suggestion);
            });
            commandSuggestions.appendChild(element);
        });
    }
    
    // 处理命令
    function handleCommand(command) {
        if (command.startsWith('搜索 ')) {
            const query = command.replace('搜索 ', '');
            performSearch(query);
        } else if (command === '打开 购物车') {
            showNotification('打开购物车', 'info');
        } else if (command === '查看 订单') {
            showNotification('查看订单', 'info');
        } else if (command.startsWith('快速购买 ')) {
            const item = command.replace('快速购买 ', '');
            quickBuy(item);
        } else if (command.startsWith('过滤器 ')) {
            const filter = command.replace('过滤器 ', '');
            applyFilter(filter);
        } else if (command.startsWith('排序 ')) {
            const sort = command.replace('排序 ', '');
            applySort(sort);
        } else if (command === '清空 搜索历史') {
            clearSearchHistory();
        }
    }
    
    // 搜索功能
    function performSearch(query) {
        if (!query.trim()) return;
        
        showNotification(`搜索: ${query}`, 'info');
        updateSearchPreview(query);
        
        // 保存到搜索历史
        saveToSearchHistory(query);
    }
    
    // 输入事件
    commandInput.addEventListener('input', function() {
        // 实时搜索建议
        const query = this.value.toLowerCase();
        if (query.length > 0) {
            const filtered = suggestions.filter(s => 
                s.toLowerCase().includes(query)
            );
            renderFilteredSuggestions(filtered);
        } else {
            renderSuggestions();
        }
    });
    
    commandInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(this.value);
        }
        
        // Ctrl+K 聚焦搜索框
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            this.focus();
        }
    });
    
    // 提交按钮
    commandSubmit.addEventListener('click', () => {
        performSearch(commandInput.value);
    });
    
    // 渲染过滤后的建议
    function renderFilteredSuggestions(filtered) {
        commandSuggestions.innerHTML = '';
        filtered.forEach(suggestion => {
            const element = document.createElement('div');
            element.className = 'command-suggestion';
            element.textContent = suggestion;
            element.addEventListener('click', () => {
                commandInput.value = suggestion.replace('搜索 ', '');
                handleCommand(suggestion);
            });
            commandSuggestions.appendChild(element);
        });
    }
    
    // 初始渲染
    renderSuggestions();
}

// 快速命令
function initQuickCommands() {
    const commandButtons = document.querySelectorAll('.command-btn');
    
    commandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const command = this.dataset.command;
            executeQuickCommand(command);
        });
    });
}

function executeQuickCommand(command) {
    let notification = '';
    
    switch(command) {
        case 'cart':
            notification = '打开购物车';
            break;
        case 'orders':
            notification = '打开订单';
            break;
        case 'search history':
            notification = '打开搜索历史';
            showSearchHistory();
            break;
        case 'favorites':
            notification = '打开收藏夹';
            break;
        case 'recent':
            notification = '打开最近浏览';
            break;
        case 'quick buy':
            notification = '打开快速购买';
            showQuickBuyPanel();
            break;
    }
    
    if (notification) {
        showNotification(notification, 'info');
    }
}

// 最近购买
function initRecentPurchases() {
    const purchasesList = document.getElementById('purchasesList');
    
    // 示例购买数据
    const purchases = [
        { name: '机械键盘', price: '¥399', date: '昨天' },
        { name: '无线鼠标', price: '¥129', date: '前天' },
        { name: '4K显示器', price: '¥1,899', date: '3天前' },
        { name: '笔记本电脑支架', price: '¥89', date: '1周前' }
    ];
    
    // 渲染购买列表
    purchases.forEach(purchase => {
        const item = document.createElement('div');
        item.className = 'purchase-item';
        item.innerHTML = `
            <div>
                <div class="purchase-name">${purchase.name}</div>
                <div class="purchase-date">${purchase.date}</div>
            </div>
            <div class="purchase-price">${purchase.price}</div>
        `;
        
        item.addEventListener('click', () => {
            showNotification(`重新购买: ${purchase.name}`, 'info');
            // 模拟快速重新购买
            setTimeout(() => {
                showNotification(`已加入购物车: ${purchase.name}`, 'success');
            }, 500);
        });
        
        purchasesList.appendChild(item);
    });
}

// 超级过滤器
function initSuperFilters() {
    // 价格范围
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    
    function updatePriceDisplay() {
        minPrice.textContent = `¥${priceMin.value}`;
        maxPrice.textContent = `¥${priceMax.value}`;
        
        // 实时筛选
        applyPriceFilter(priceMin.value, priceMax.value);
    }
    
    priceMin.addEventListener('input', updatePriceDisplay);
    priceMax.addEventListener('input', updatePriceDisplay);
    
    // 筛选芯片
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            this.classList.toggle('active');
            const filter = this.dataset.filter;
            applyChipFilter(filter, this.classList.contains('active'));
        });
    });
    
    // 排序选项
    const sortOptions = document.querySelectorAll('.sort-option');
    sortOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除所有激活状态
            sortOptions.forEach(o => o.classList.remove('active'));
            // 添加当前激活状态
            this.classList.add('active');
            
            const sort = this.dataset.sort;
            applySorting(sort);
        });
    });
}

// 搜索预览
function initSearchPreview() {
    const productsGrid = document.getElementById('productsGrid');
    
    // 示例商品数据
    const products = [
        { id: 1, name: '无线蓝牙耳机', price: '¥299', icon: 'fas fa-headphones' },
        { id: 2, name: '智能手机', price: '¥3,999', icon: 'fas fa-mobile-alt' },
        { id: 3, name: '笔记本电脑', price: '¥6,999', icon: 'fas fa-laptop' },
        { id: 4, name: '智能手表', price: '¥899', icon: 'fas fa-clock' },
        { id: 5, name: '平板电脑', price: '¥2,499', icon: 'fas fa-tablet-alt' },
        { id: 6, name: '蓝牙音箱', price: '¥199', icon: 'fas fa-volume-up' },
        { id: 7, name: '游戏手柄', price: '¥399', icon: 'fas fa-gamepad' },
        { id: 8, name: '移动电源', price: '¥129', icon: 'fas fa-battery-full' }
    ];
    
    // 渲染商品
    function renderProducts() {
        productsGrid.innerHTML = '';
        
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image">
                    <i class="${product.icon}"></i>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${product.price}</p>
                </div>
                <button class="product-action" onclick="quickAddToCart(${product.id})">
                    快速购买
                </button>
            `;
            
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('product-action')) {
                    showNotification(`查看: ${product.name}`, 'info');
                }
            });
            
            productsGrid.appendChild(card);
        });
    }
    
    // 初始渲染
    renderProducts();
}

// 浮动操作按钮
function initFAB() {
    const fab = document.getElementById('quickActionFab');
    
    fab.addEventListener('click', function() {
        showQuickActions();
    });
}

// 键盘快捷键
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // 忽略输入框中的快捷键
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Ctrl+/ 显示快捷键帮助
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            showKeyboardHelp();
        }
        
        // 1-6 数字键对应快捷命令
        if (e.key >= '1' && e.key <= '6') {
            const index = parseInt(e.key) - 1;
            const commandButtons = document.querySelectorAll('.command-btn');
            if (commandButtons[index]) {
                commandButtons[index].click();
            }
        }
        
        // ESC 关闭所有弹窗
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// 功能函数
function showNotification(message, type = 'info') {
    // 移除现有通知
    const existing = document.querySelector('.focus-notification');
    if (existing) {
        existing.remove();
    }
    
    // 创建新通知
    const notification = document.createElement('div');
    notification.className = `focus-notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 70px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: focusNotificationIn 0.2s ease, focusNotificationOut 0.2s ease 2.8s;
        white-space: nowrap;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后移除
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// 添加通知动画
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes focusNotificationIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes focusNotificationOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
        }
    }
`;
document.head.appendChild(notificationStyle);

function updateSearchPreview(query) {
    // 模拟搜索结果显示
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--focus-text-secondary);">
            <i class="fas fa-search" style="font-size: 32px; margin-bottom: 16px;"></i>
            <p>正在搜索 "${query}"...</p>
        </div>
    `;
    
    // 模拟延迟后显示结果
    setTimeout(() => {
        initSearchPreview();
        showNotification(`找到 ${Math.floor(Math.random() * 100) + 50} 个相关商品`, 'success');
    }, 800);
}

function quickAddToCart(productId) {
    showNotification('商品已加入购物车', 'success');
    
    // 动画反馈
    const button = event.target;
    button.innerHTML = '<i class="fas fa-check"></i> 已添加';
    button.style.background = '#4CAF50';
    
    setTimeout(() => {
        button.innerHTML = '快速购买';
        button.style.background = '';
    }, 1500);
}

function showQuickActions() {
    const actions = [
        { icon: 'fas fa-search', label: '搜索', action: () => document.getElementById('commandInput').focus() },
        { icon: 'fas fa-filter', label: '过滤', action: () => document.querySelector('.super-filters').scrollIntoView() },
        { icon: 'fas fa-shopping-cart', label: '购物车', action: () => showNotification('打开购物车', 'info') },
        { icon: 'fas fa-history', label: '历史', action: () => showSearchHistory() }
    ];
    
    // 创建快速操作面板
    const panel = document.createElement('div');
    panel.className = 'quick-actions-panel';
    panel.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 24px;
        background: var(--focus-surface);
        border-radius: 12px;
        padding: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        z-index: 100;
        animation: slideUp 0.2s ease;
    `;
    
    actions.forEach(action => {
        const button = document.createElement('button');
        button.className = 'quick-action-btn';
        button.innerHTML = `
            <i class="${action.icon}"></i>
            <span>${action.label}</span>
        `;
        button.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 12px 16px;
            background: transparent;
            border: none;
            color: var(--focus-text);
            cursor: pointer;
            border-radius: 8px;
            transition: background 0.2s;
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = 'transparent';
        });
        
        button.addEventListener('click', () => {
            action.action();
            panel.remove();
        });
        
        panel.appendChild(button);
    });
    
    // 点击外部关闭
    const closeHandler = (e) => {
        if (!panel.contains(e.target) && e.target.id !== 'quickActionFab') {
            panel.remove();
            document.removeEventListener('click', closeHandler);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeHandler);
    }, 0);
    
    document.body.appendChild(panel);
}

function showKeyboardHelp() {
    const help = `
        键盘快捷键:
        Ctrl+K - 聚焦搜索框
        1-6    - 快捷命令
        ESC    - 关闭所有弹窗
        Ctrl+/ - 显示此帮助
    `;
    
    showNotification(help, 'info');
}

function closeAllModals() {
    const modals = document.querySelectorAll('.quick-actions-panel, .search-history-panel');
    modals.forEach(modal => modal.remove());
}

function showSearchHistory() {
    const history = ['手机', '笔记本电脑', '耳机', '咖啡', '鼠标'];
    
    const panel = document.createElement('div');
    panel.className = 'search-history-panel';
    panel.style.cssText = `
        position: fixed;
        top: 120px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 400px;
        background: var(--focus-surface);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        z-index: 100;
        animation: fadeIn 0.2s ease;
    `;
    
    panel.innerHTML = `
        <h3 style="margin: 0 0 16px 0; color: var(--focus-text);">搜索历史</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${history.map(item => `
                <button class="history-item" 
                        onclick="performSearch('${item}'); this.closest('.search-history-panel').remove();"
                        style="background: var(--focus-surface-light); color: var(--focus-text); border: 1px solid var(--focus-border); border-radius: 20px; padding: 6px 12px; cursor: pointer; transition: all 0.2s;">
                    ${item}
                </button>
            `).join('')}
        </div>
        <button onclick="clearSearchHistory(); this.closest('.search-history-panel').remove();"
                style="margin-top: 16px; width: 100%; padding: 12px; background: transparent; color: var(--focus-text-secondary); border: 1px solid var(--focus-border); border-radius: 8px; cursor: pointer; transition: all 0.2s;">
            清空历史记录
        </button>
    `;
    
    document.body.appendChild(panel);
}

function clearSearchHistory() {
    showNotification('已清空搜索历史', 'success');
}

// 过滤器函数
function applyPriceFilter(min, max) {
    showNotification(`价格筛选: ¥${min} - ¥${max}`, 'info');
}

function applyChipFilter(filter, active) {
    showNotification(`${active ? '应用' : '移除'}筛选: ${filter}`, 'info');
}

function applySorting(sort) {
    const sortNames = {
        'relevance': '综合排序',
        'price-asc': '价格升序',
        'price-desc': '价格降序',
        'sales': '销量排序'
    };
    
    showNotification(`排序方式: ${sortNames[sort] || sort}`, 'info');
}

function quickBuy(item) {
    showNotification(`快速购买: ${item}`, 'info');
    // 模拟快速购买流程
    setTimeout(() => {
        showNotification(`已为您下单: ${item}`, 'success');
    }, 1000);
}

function applyFilter(filter) {
    showNotification(`应用过滤器: ${filter}`, 'info');
}

function applySort(sort) {
    showNotification(`应用排序: ${sort}`, 'info');
}

function saveToSearchHistory(query) {
    // 在实际应用中，这里应该保存到本地存储
    console.log('保存搜索历史:', query);
}

// 添加动画样式
const animationsStyle = document.createElement('style');
animationsStyle.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(animationsStyle);
// 无障碍功能实现
document.addEventListener('DOMContentLoaded', function() {
    // 高对比度切换
    const highContrastToggle = document.getElementById('highContrastToggle');
    highContrastToggle.addEventListener('click', function() {
        document.body.classList.toggle('high-contrast');
        const isActive = document.body.classList.contains('high-contrast');
        this.setAttribute('aria-label', isActive ? '关闭高对比度模式' : '开启高对比度模式');
        
        // 语音反馈
        speakText(isActive ? '已开启高对比度模式' : '已关闭高对比度模式');
    });
    
    // 字体大小控制
    const fontSizeIncrease = document.getElementById('fontSizeIncrease');
    const fontSizeDecrease = document.getElementById('fontSizeDecrease');
    
    fontSizeIncrease.addEventListener('click', function() {
        increaseFontSize();
        speakText('字体已放大');
    });
    
    fontSizeDecrease.addEventListener('click', function() {
        decreaseFontSize();
        speakText('字体已缩小');
    });
    
    // 页面朗读
    const speakPage = document.getElementById('speakPage');
    speakPage.addEventListener('click', function() {
        speakPageContent();
    });
    
    // 导航菜单切换
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            this.setAttribute('aria-expanded', navMenu.style.display === 'flex');
        });
    }
    
    // 演示区域交互
    setupDemoControls();
    
    // 模式卡片交互
    setupModeCards();
    
    // 手机屏幕动画
    animatePhoneScreen();
});

// 字体大小控制函数
let currentFontSize = 'normal';

function increaseFontSize() {
    const sizes = ['normal', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(currentFontSize);
    
    if (currentIndex < sizes.length - 1) {
        document.body.classList.remove(`font-${currentFontSize}`);
        currentFontSize = sizes[currentIndex + 1];
        document.body.classList.add(`font-${currentFontSize}`);
        
        // 更新演示区域的按钮状态
        updateFontButtons();
    }
}

function decreaseFontSize() {
    const sizes = ['normal', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(currentFontSize);
    
    if (currentIndex > 0) {
        document.body.classList.remove(`font-${currentFontSize}`);
        currentFontSize = sizes[currentIndex - 1];
        document.body.classList.add(`font-${currentFontSize}`);
        
        // 更新演示区域的按钮状态
        updateFontButtons();
    }
}

function updateFontButtons() {
    const fontButtons = document.querySelectorAll('.font-btn');
    fontButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.size === currentFontSize) {
            btn.classList.add('active');
        }
    });
}

// 语音合成功能
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        speechSynthesis.speak(utterance);
    }
}

function speakPageContent() {
    const pageTitle = document.querySelector('h1')?.textContent || '';
    const mainContent = document.querySelector('.hero-subtitle')?.textContent || '';
    const textToSpeak = `${pageTitle}。${mainContent}`;
    speakText(textToSpeak);
}

// 演示控制设置
function setupDemoControls() {
    // 字体大小控制
    const fontButtons = document.querySelectorAll('.font-btn');
    fontButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有激活状态
            fontButtons.forEach(b => b.classList.remove('active'));
            // 添加当前激活状态
            this.classList.add('active');
            
            // 应用字体大小
            const size = this.dataset.size;
            document.body.classList.remove('font-large', 'font-xlarge');
            if (size !== 'normal') {
                document.body.classList.add(`font-${size}`);
            }
            currentFontSize = size;
            
            speakText(`已切换到${getSizeName(size)}字体`);
        });
    });
    
    // 对比度控制
    const contrastButtons = document.querySelectorAll('.contrast-btn');
    contrastButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有激活状态
            contrastButtons.forEach(b => b.classList.remove('active'));
            // 添加当前激活状态
            this.classList.add('active');
            
            // 应用对比度模式
            const mode = this.dataset.contrast;
            document.body.classList.remove('high-contrast', 'dark-mode');
            if (mode === 'high') {
                document.body.classList.add('high-contrast');
            } else if (mode === 'dark') {
                document.body.classList.add('dark-mode');
            }
            
            speakText(`已切换到${getContrastName(mode)}`);
        });
    });
    
    // 语音演示
    const voiceDemoBtn = document.getElementById('voiceDemoBtn');
    const voiceStatus = document.getElementById('voiceStatus');
    
    if (voiceDemoBtn) {
        voiceDemoBtn.addEventListener('click', function() {
            voiceStatus.textContent = '正在朗读商品信息...';
            voiceStatus.style.color = '#FF6B00';
            
            const productTitle = document.querySelector('.product-title').textContent;
            const productPrice = document.querySelector('.current-price').textContent;
            const productRating = document.querySelector('.rating-text').textContent;
            
            const voiceText = `商品名称：${productTitle}。价格：${productPrice}。评分：${productRating}。`;
            
            speakText(voiceText);
            
            // 重置状态
            setTimeout(() => {
                voiceStatus.textContent = '准备就绪';
                voiceStatus.style.color = '';
            }, 3000);
        });
    }
    
    // 商品卡片交互
    const demoCard = document.getElementById('demoCard');
    if (demoCard) {
        demoCard.addEventListener('click', function(e) {
            if (e.target.classList.contains('add-to-cart')) {
                speakText('商品已加入购物车');
                showNotification('商品已加入购物车', 'success');
            } else if (e.target.classList.contains('buy-now')) {
                speakText('正在跳转到购买页面');
                showNotification('正在跳转到购买页面...', 'info');
            }
        });
    }
}

// 辅助函数
function getSizeName(size) {
    const sizeNames = {
        'normal': '正常',
        'large': '大号',
        'xlarge': '特大'
    };
    return sizeNames[size] || size;
}

function getContrastName(mode) {
    const modeNames = {
        'normal': '正常模式',
        'high': '高对比度模式',
        'dark': '深色模式'
    };
    return modeNames[mode] || mode;
}

// 模式卡片交互
function setupModeCards() {
    const modeCards = document.querySelectorAll('.mode-card');
    
    modeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const mode = this.dataset.mode;
            updatePhoneScreen(mode);
        });
        
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('mode-link')) {
                const mode = this.dataset.mode;
                speakText(`进入${getModeName(mode)}`);
            }
        });
    });
}

function getModeName(mode) {
    const modeNames = {
        'senior': '长辈模式',
        'focus': '极速模式',
        'price': '智能比价',
        'accessibility': '无障碍设计'
    };
    return modeNames[mode] || mode;
}

// 手机屏幕动画
function animatePhoneScreen() {
    const phoneScreen = document.getElementById('phoneScreen');
    if (!phoneScreen) return;
    
    const modes = ['senior', 'focus', 'price', 'accessibility'];
    let currentModeIndex = 0;
    
    // 初始显示
    updatePhoneScreen(modes[currentModeIndex]);
    
    // 自动轮播
    setInterval(() => {
        currentModeIndex = (currentModeIndex + 1) % modes.length;
        updatePhoneScreen(modes[currentModeIndex]);
    }, 5000);
}

function updatePhoneScreen(mode) {
    const phoneScreen = document.getElementById('phoneScreen');
    if (!phoneScreen) return;
    
    let content = '';
    
    switch(mode) {
        case 'senior':
            content = `
                <div class="senior-phone-screen">
                    <div class="senior-header">
                        <div class="senior-search">
                            <i class="fas fa-search"></i>
                            <span>说你想买的东西</span>
                        </div>
                        <button class="senior-voice-btn">
                            <i class="fas fa-microphone"></i>
                        </button>
                    </div>
                    <div class="senior-grid">
                        <div class="senior-item">
                            <i class="fas fa-qrcode"></i>
                            <span>扫一扫</span>
                        </div>
                        <div class="senior-item">
                            <i class="fas fa-receipt"></i>
                            <span>我的订单</span>
                        </div>
                        <div class="senior-item">
                            <i class="fas fa-heart"></i>
                            <span>收藏夹</span>
                        </div>
                        <div class="senior-item">
                            <i class="fas fa-headset"></i>
                            <span>客服</span>
                        </div>
                    </div>
                    <div class="senior-products">
                        <div class="senior-product">
                            <div class="senior-product-image"></div>
                            <div class="senior-product-info">
                                <h4>智能电饭煲</h4>
                                <p class="senior-price">¥299</p>
                                <button class="senior-buy-btn">买</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'focus':
            content = `
                <div class="focus-phone-screen">
                    <div class="focus-search">
                        <input type="text" placeholder="输入商品或命令...">
                    </div>
                    <div class="focus-quick-actions">
                        <button class="focus-action">🛒 购物车</button>
                        <button class="focus-action">📦 订单</button>
                        <button class="focus-action">🔍 搜索历史</button>
                    </div>
                    <div class="focus-recent">
                        <h4>最近购买</h4>
                        <div class="focus-item">
                            <span>咖啡豆</span>
                            <span class="focus-price">¥89</span>
                        </div>
                        <div class="focus-item">
                            <span>手机壳</span>
                            <span class="focus-price">¥39</span>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'price':
            content = `
                <div class="price-phone-screen">
                    <div class="price-header">
                        <h4>iPhone 14 价格趋势</h4>
                    </div>
                    <div class="price-chart">
                        <div class="chart-line"></div>
                    </div>
                    <div class="price-comparison">
                        <div class="platform-price">
                            <span>淘宝</span>
                            <span class="price-value">¥5,999</span>
                        </div>
                        <div class="platform-price">
                            <span>京东</span>
                            <span class="price-value">¥5,899</span>
                        </div>
                        <div class="platform-price">
                            <span>拼多多</span>
                            <span class="price-value lowest">¥5,499</span>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'accessibility':
            content = `
                <div class="accessibility-phone-screen">
                    <div class="accessibility-header">
                        <h4>无障碍模式</h4>
                    </div>
                    <div class="accessibility-controls">
                        <div class="accessibility-option">
                            <i class="fas fa-eye"></i>
                            <span>高对比度</span>
                            <div class="toggle-switch active"></div>
                        </div>
                        <div class="accessibility-option">
                            <i class="fas fa-text-height"></i>
                            <span>大字体</span>
                            <div class="toggle-switch active"></div>
                        </div>
                        <div class="accessibility-option">
                            <i class="fas fa-volume-up"></i>
                            <span>语音反馈</span>
                            <div class="toggle-switch"></div>
                        </div>
                        <div class="accessibility-option">
                            <i class="fas fa-keyboard"></i>
                            <span>键盘导航</span>
                            <div class="toggle-switch active"></div>
                        </div>
                    </div>
                </div>
            `;
            break;
    }
    
    phoneScreen.innerHTML = content;
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .senior-phone-screen {
            padding: 20px;
            font-family: var(--font-family);
        }
        
        .senior-header {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
        }
        
        .senior-search {
            flex: 1;
            background: #FFE0B2;
            border-radius: 30px;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 18px;
            color: #FF6B00;
        }
        
        .senior-voice-btn {
            width: 60px;
            height: 60px;
            background: #FF6B00;
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 20px;
        }
        
        .senior-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .senior-item {
            background: white;
            border-radius: 16px;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            font-size: 16px;
            color: #333;
        }
        
        .senior-item i {
            font-size: 24px;
            color: #FF6B00;
        }
        
        .focus-phone-screen {
            padding: 20px;
        }
        
        .focus-search input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #2196F3;
            border-radius: 8px;
            font-size: 16px;
            margin-bottom: 20px;
        }
        
        .focus-quick-actions {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .focus-action {
            flex: 1;
            padding: 12px;
            background: #E3F2FD;
            border: none;
            border-radius: 8px;
            font-size: 14px;
        }
        
        .focus-recent h4 {
            margin-bottom: 10px;
            color: #333;
        }
        
        .focus-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        
        .price-phone-screen {
            padding: 20px;
        }
        
        .price-header h4 {
            margin-bottom: 20px;
            color: #333;
        }
        
        .price-chart {
            height: 100px;
            background: #F5F5F5;
            border-radius: 8px;
            margin-bottom: 20px;
            position: relative;
            overflow: hidden;
        }
        
        .chart-line {
            position: absolute;
            top: 20px;
            left: 0;
            right: 0;
            height: 60px;
            background: linear-gradient(90deg, #4CAF50, transparent);
            border-radius: 4px;
        }
        
        .platform-price {
            display: flex;
            justify-content: space-between;
            padding: 12px;
            background: white;
            margin-bottom: 8px;
            border-radius: 8px;
            border: 1px solid #eee;
        }
        
        .lowest {
            color: #4CAF50;
            font-weight: bold;
        }
        
        .accessibility-phone-screen {
            padding: 20px;
        }
        
        .accessibility-header h4 {
            margin-bottom: 20px;
            color: #333;
        }
        
        .accessibility-option {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 0;
            border-bottom: 1px solid #eee;
        }
        
        .accessibility-option i {
            width: 30px;
            color: #9C27B0;
        }
        
        .toggle-switch {
            width: 50px;
            height: 25px;
            background: #E0E0E0;
            border-radius: 25px;
            position: relative;
            cursor: pointer;
        }
        
        .toggle-switch.active {
            background: #9C27B0;
        }
        
        .toggle-switch::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 21px;
            height: 21px;
            background: white;
            border-radius: 50%;
            transition: transform 0.3s;
        }
        
        .toggle-switch.active::after {
            transform: translateX(25px);
        }
    `;
    
    phoneScreen.appendChild(style);
}

// 通知功能
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 添加动画关键帧
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(animationStyles);

// 键盘导航支持
document.addEventListener('keydown', function(e) {
    // Tab键导航
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
    
    // 空格键触发语音
    if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        speakPageContent();
    }
    
    // ESC键关闭所有弹窗
    if (e.key === 'Escape') {
        // 可以在这里添加关闭弹窗的逻辑
    }
});

// 移除键盘导航样式当鼠标使用时
document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// 键盘导航样式
const keyboardNavStyles = document.createElement('style');
keyboardNavStyles.textContent = `
    .keyboard-navigation *:focus {
        outline: 3px solid #2196F3 !important;
        outline-offset: 2px;
    }
`;
document.head.appendChild(keyboardNavStyles);
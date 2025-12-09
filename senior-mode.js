// 长辈模式交互脚本
document.addEventListener('DOMContentLoaded', function() {
    // 初始化语音功能
    initVoiceFeatures();
    
    // 初始化功能卡片
    initFunctionCards();
    
    // 初始化商品推荐
    initProductRecommendations();
    
    // 初始化购物助手
    initShoppingAssistant();
    
    // 初始化语音助手
    initVoiceAssistant();
    
    // 初始化视频客服
    initVideoService();
    
    // 初始化放大镜功能
    initMagnifier();
    
    // 初始化触摸反馈
    initTouchFeedback();
});

// 语音功能
function initVoiceFeatures() {
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');
    const voiceControl = document.getElementById('voiceControl');
    const exampleTags = document.querySelectorAll('.example-tag');
    const voiceStatus = document.getElementById('voiceStatus');
    
    if (voiceSearchBtn) {
        voiceSearchBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
            this.style.backgroundColor = '#E65A00';
            voiceStatus.textContent = '正在聆听...';
            
            // 模拟语音识别
            setTimeout(() => {
                voiceStatus.textContent = '识别到："大米"';
                speakText('正在为您搜索大米相关商品');
                showNotification('正在搜索"大米"...', 'info');
            }, 1500);
        });
        
        voiceSearchBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.style.transform = '';
            this.style.backgroundColor = '';
        });
    }
    
    if (voiceControl) {
        voiceControl.addEventListener('click', function() {
            toggleVoiceAssistant();
        });
    }
    
    // 示例标签点击
    exampleTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const query = this.dataset.query;
            voiceStatus.textContent = `搜索：${query}`;
            speakText(`正在搜索${query}`);
            showNotification(`正在搜索"${query}"...`, 'info');
        });
    });
    
    // 帮助按钮
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            speakText('正在联系客服，请稍候');
            toggleVideoService();
        });
    }
}

// 功能卡片
function initFunctionCards() {
    const functionCards = document.querySelectorAll('.function-card');
    
    functionCards.forEach(card => {
        card.addEventListener('click', function() {
            const functionType = this.dataset.function;
            handleFunctionClick(functionType);
        });
        
        // 添加触摸反馈
        card.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
        });
        
        card.addEventListener('touchend', function() {
            this.style.opacity = '';
        });
    });
}

function handleFunctionClick(functionType) {
    let message = '';
    let notification = '';
    
    switch(functionType) {
        case 'scan':
            message = '打开扫一扫功能，请将摄像头对准商品条码';
            notification = '打开扫一扫';
            break;
        case 'orders':
            message = '正在打开订单页面，显示您的购买记录';
            notification = '打开订单页面';
            break;
        case 'favorites':
            message = '正在打开收藏夹，显示您收藏的商品';
            notification = '打开收藏夹';
            break;
        case 'cart':
            message = '正在打开购物车，显示待购买商品';
            notification = '打开购物车';
            break;
        case 'customer-service':
            message = '正在联系客服，请稍候';
            notification = '联系客服';
            toggleVideoService();
            break;
        case 'settings':
            message = '打开设置页面，可以调整字体大小等选项';
            notification = '打开设置';
            break;
    }
    
    if (message) {
        speakText(message);
        if (notification && functionType !== 'customer-service') {
            showNotification(notification, 'info');
        }
    }
}

// 商品推荐
function initProductRecommendations() {
    const recommendationsContainer = document.querySelector('.product-recommendations');
    const refreshBtn = document.querySelector('.refresh-btn');
    
    // 示例商品数据
    const products = [
        {
            id: 1,
            name: '东北大米 10kg',
            price: '¥59.90',
            originalPrice: '¥79.90',
            icon: 'fas fa-rice'
        },
        {
            id: 2,
            name: '纯牛奶 250ml×24盒',
            price: '¥68.80',
            originalPrice: '¥88.00',
            icon: 'fas fa-wine-bottle'
        },
        {
            id: 3,
            name: '抽纸 3层×120抽×24包',
            price: '¥39.90',
            originalPrice: '¥49.90',
            icon: 'fas fa-toilet-paper'
        },
        {
            id: 4,
            name: '老年手机 大字大声',
            price: '¥199.00',
            originalPrice: '¥299.00',
            icon: 'fas fa-mobile-alt'
        }
    ];
    
    // 渲染商品
    function renderProducts() {
        recommendationsContainer.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <i class="${product.icon}"></i>
                </div>
                <div class="product-details">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${product.price}</p>
                    <p class="product-original-price">${product.originalPrice}</p>
                    <button class="product-action" onclick="addToCart(${product.id})">
                        加入购物车
                    </button>
                </div>
            `;
            
            productCard.addEventListener('click', function(e) {
                if (!e.target.classList.contains('product-action')) {
                    speakText(`${product.name}，价格${product.price}`);
                    showNotification(`查看${product.name}`, 'info');
                }
            });
            
            recommendationsContainer.appendChild(productCard);
        });
    }
    
    // 刷新商品
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            speakText('正在刷新推荐商品');
            // 模拟延迟
            setTimeout(() => {
                renderProducts();
                showNotification('已刷新商品推荐', 'success');
            }, 800);
        });
    }
    
    // 初始渲染
    renderProducts();
}

// 购物助手
function initShoppingAssistant() {
    const quickQuestions = document.querySelectorAll('.quick-question');
    
    quickQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const query = this.dataset.question;
            handleAssistantQuery(query);
        });
    });
}

function handleAssistantQuery(query) {
    let response = '';
    
    switch(query) {
        case '今日特价':
            response = '今日特价商品有大米、牛奶、纸巾等，都在首页为您推荐区域';
            break;
        case '买菜':
            response = '买菜请到生鲜频道，或者直接搜索蔬菜、水果、肉类';
            break;
        case '送货':
            response = '查看送货进度请点击"我的订单"，选择对应订单查看物流信息';
            break;
        case '退货':
            response = '退货退款请先联系客服，或者在我的订单中选择需要退货的商品';
            break;
    }
    
    if (response) {
        speakText(response);
        showNotification(response, 'info');
    }
}

// 语音助手
function initVoiceAssistant() {
    const voiceAssistant = document.getElementById('voiceAssistant');
    const closeAssistant = document.querySelector('.close-assistant');
    const startListeningBtn = document.getElementById('startListening');
    const voiceInstruction = document.getElementById('voiceInstruction');
    const voiceResult = document.getElementById('voiceResult');
    
    let isListening = false;
    let recognition = null;
    
    // 语音识别支持检测
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = function() {
            isListening = true;
            startListeningBtn.innerHTML = '<i class="fas fa-microphone-slash"></i><span>停止说话</span>';
            voiceInstruction.textContent = '请开始说话...';
            voiceResult.textContent = '';
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            voiceResult.textContent = `识别到：${transcript}`;
            voiceInstruction.textContent = '正在处理您的请求...';
            
            // 处理识别结果
            processVoiceCommand(transcript);
            
            // 停止识别
            setTimeout(() => {
                recognition.stop();
            }, 500);
        };
        
        recognition.onend = function() {
            isListening = false;
            startListeningBtn.innerHTML = '<i class="fas fa-microphone"></i><span>开始说话</span>';
            voiceInstruction.textContent = '请说出您的需求...';
        };
        
        recognition.onerror = function(event) {
            console.error('语音识别错误:', event.error);
            voiceResult.textContent = '抱歉，语音识别失败，请重试';
            isListening = false;
            startListeningBtn.innerHTML = '<i class="fas fa-microphone"></i><span>开始说话</span>';
        };
    } else {
        // 不支持语音识别的fallback
        voiceInstruction.textContent = '您的浏览器不支持语音识别功能';
        startListeningBtn.disabled = true;
    }
    
    // 开始/停止监听
    if (startListeningBtn) {
        startListeningBtn.addEventListener('click', function() {
            if (!isListening && recognition) {
                recognition.start();
            } else if (isListening && recognition) {
                recognition.stop();
            }
        });
    }
    
    // 关闭语音助手
    if (closeAssistant) {
        closeAssistant.addEventListener('click', function() {
            if (isListening && recognition) {
                recognition.stop();
            }
            toggleVoiceAssistant();
        });
    }
}

function processVoiceCommand(command) {
    command = command.toLowerCase();
    let response = '';
    
    if (command.includes('大米') || command.includes('米饭')) {
        response = '正在为您搜索大米相关商品';
        showNotification('搜索大米...', 'info');
    } else if (command.includes('牛奶')) {
        response = '正在为您搜索牛奶相关商品';
        showNotification('搜索牛奶...', 'info');
    } else if (command.includes('订单')) {
        response = '正在打开订单页面';
        showNotification('打开订单', 'info');
    } else if (command.includes('客服') || command.includes('帮助')) {
        response = '正在联系客服，请稍候';
        toggleVideoService();
        toggleVoiceAssistant();
    } else if (command.includes('返回') || command.includes('退出')) {
        response = '返回首页';
        toggleVoiceAssistant();
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        response = `您说的是：${command}，请问需要什么帮助？`;
    }
    
    speakText(response);
}

// 语音助手显示/隐藏
function toggleVoiceAssistant() {
    const voiceAssistant = document.getElementById('voiceAssistant');
    voiceAssistant.classList.toggle('hidden');
    
    if (!voiceAssistant.classList.contains('hidden')) {
        speakText('语音助手已打开，请说出您的需求');
    }
}

// 视频客服
function initVideoService() {
    const videoService = document.getElementById('videoService');
    const closeVideo = document.querySelector('.close-video');
    const endCallBtn = document.querySelector('.end-call');
    
    if (closeVideo) {
        closeVideo.addEventListener('click', function() {
            toggleVideoService();
        });
    }
    
    if (endCallBtn) {
        endCallBtn.addEventListener('click', function() {
            speakText('已结束视频通话');
            toggleVideoService();
        });
    }
}

function toggleVideoService() {
    const videoService = document.getElementById('videoService');
    videoService.classList.toggle('hidden');
    
    if (!videoService.classList.contains('hidden')) {
        speakText('正在连接视频客服，请稍候');
        // 模拟连接中
        setTimeout(() => {
            speakText('已连接客服，可以开始通话');
        }, 2000);
    }
}

// 放大镜功能
function initMagnifier() {
    const magnifier = document.getElementById('magnifier');
    const magnifierContent = document.querySelector('.magnifier-content');
    
    // 为所有文字元素添加长按放大功能
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, p, span, button, a');
    
    textElements.forEach(element => {
        let pressTimer;
        
        element.addEventListener('touchstart', function(e) {
            pressTimer = setTimeout(() => {
                showMagnifier(this.textContent);
            }, 800); // 长按800毫秒触发
        });
        
        element.addEventListener('touchend', function() {
            clearTimeout(pressTimer);
        });
        
        element.addEventListener('touchmove', function() {
            clearTimeout(pressTimer);
        });
    });
    
    // 点击关闭放大镜
    if (magnifier) {
        magnifier.addEventListener('click', function() {
            this.classList.add('hidden');
        });
    }
}

function showMagnifier(text) {
    const magnifier = document.getElementById('magnifier');
    const magnifierContent = document.querySelector('.magnifier-content');
    
    if (magnifier && magnifierContent) {
        magnifierContent.textContent = text;
        magnifier.classList.remove('hidden');
        speakText(text); // 同时朗读内容
    }
}

// 触摸反馈
function initTouchFeedback() {
    // 为所有按钮添加触摸反馈
    const buttons = document.querySelectorAll('button, .function-card, .product-card');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transition = 'transform 0.1s, opacity 0.1s';
            this.style.transform = 'scale(0.98)';
            this.style.opacity = '0.9';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
            this.style.opacity = '';
        });
    });
}

// 添加到购物车
function addToCart(productId) {
    speakText('商品已加入购物车');
    showNotification('商品已加入购物车', 'success');
    
    // 更新购物车数量
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const currentCount = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = currentCount + 1;
    }
}

// 语音合成
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.9; // 稍微慢一点
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // 设置长辈模式更清晰的声音
        const voices = speechSynthesis.getVoices();
        const chineseVoice = voices.find(voice => 
            voice.lang.includes('zh') || voice.lang.includes('CN')
        );
        
        if (chineseVoice) {
            utterance.voice = chineseVoice;
        }
        
        speechSynthesis.speak(utterance);
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `senior-notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        padding: 20px 30px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
        color: white;
        border-radius: 12px;
        font-size: 20px;
        font-weight: 600;
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: seniorNotificationIn 0.3s ease, seniorNotificationOut 0.3s ease 2.7s;
        max-width: 80%;
        text-align: center;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后移除
    setTimeout(() => {
        if (notification.parentNode) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

// 添加通知动画样式
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes seniorNotificationIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes seniorNotificationOut {
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

// 键盘导航支持
document.addEventListener('keydown', function(e) {
    // ESC键关闭所有弹窗
    if (e.key === 'Escape') {
        const voiceAssistant = document.getElementById('voiceAssistant');
        const videoService = document.getElementById('videoService');
        const magnifier = document.getElementById('magnifier');
        
        if (voiceAssistant && !voiceAssistant.classList.contains('hidden')) {
            toggleVoiceAssistant();
        } else if (videoService && !videoService.classList.contains('hidden')) {
            toggleVideoService();
        } else if (magnifier && !magnifier.classList.contains('hidden')) {
            magnifier.classList.add('hidden');
        }
    }
    
    // 空格键触发语音助手
    if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        toggleVoiceAssistant();
    }
    
    // Tab键导航视觉反馈
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

// 移除键盘导航样式当鼠标使用时
document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// 键盘导航样式
const keyboardNavStyle = document.createElement('style');
keyboardNavStyle.textContent = `
    .keyboard-navigation *:focus {
        outline: 4px solid #0000FF !important;
        outline-offset: 3px;
        border-radius: 8px;
    }
    
    .senior-mode.keyboard-navigation button:focus,
    .senior-mode.keyboard-navigation a:focus,
    .senior-mode.keyboard-navigation .function-card:focus,
    .senior-mode.keyboard-navigation .product-card:focus {
        outline: 4px solid #0000FF !important;
        outline-offset: 3px;
        border-radius: 8px;
    }
`;
document.head.appendChild(keyboardNavStyle);
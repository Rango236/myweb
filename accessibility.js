// 无障碍设计模式交互脚本
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initAccessibilityToolbar();
    initNavigation();
    initVisualFeatures();
    initAuditoryFeatures();
    initMotorFeatures();
    initCognitiveFeatures();
    initTestingTools();
    initScreenReader();
    initVoiceControl();
    
    // 加载保存的设置
    loadSavedSettings();
    
    // 初始化语音合成
    initSpeechSynthesis();
});

// 无障碍工具栏
function initAccessibilityToolbar() {
    const toolbar = document.querySelector('.accessibility-toolbar');
    const decreaseFontBtn = document.getElementById('decreaseFont');
    const increaseFontBtn = document.getElementById('increaseFont');
    const fontSizeDisplay = document.getElementById('fontSizeDisplay');
    const highContrastToggle = document.getElementById('highContrastToggle');
    const screenReaderToggle = document.getElementById('screenReaderToggle');
    const keyboardModeToggle = document.getElementById('keyboardModeToggle');
    const simulateDisabilityBtn = document.getElementById('simulateDisability');
    const resetSettingsBtn = document.getElementById('resetSettings');
    
    // 字体大小控制
    const fontSizes = ['small', 'normal', 'large', 'xlarge'];
    const fontSizeLabels = {
        'small': '小',
        'normal': '中',
        'large': '大',
        'xlarge': '特大'
    };
    
    let currentFontSizeIndex = fontSizes.indexOf('normal');
    
    decreaseFontBtn.addEventListener('click', function() {
        if (currentFontSizeIndex > 0) {
            currentFontSizeIndex--;
            updateFontSize(fontSizes[currentFontSizeIndex]);
        }
    });
    
    increaseFontBtn.addEventListener('click', function() {
        if (currentFontSizeIndex < fontSizes.length - 1) {
            currentFontSizeIndex++;
            updateFontSize(fontSizes[currentFontSizeIndex]);
        }
    });
    
    function updateFontSize(size) {
        document.body.setAttribute('data-font-size', size);
        fontSizeDisplay.textContent = fontSizeLabels[size];
        
        // 更新字体大小选项
        updateFontSizeOptions(size);
        
        // 保存设置
        saveSetting('fontSize', size);
        
        // 屏幕阅读器反馈
        speakText(`字体大小已调整为${fontSizeLabels[size]}`);
    }
    
    // 高对比度切换
    highContrastToggle.addEventListener('click', function() {
        const currentContrast = document.body.getAttribute('data-contrast');
        const contrasts = ['normal', 'high', 'inverse'];
        const contrastLabels = {
            'normal': '正常',
            'high': '高对比度',
            'inverse': '反色'
        };
        
        let currentIndex = contrasts.indexOf(currentContrast);
        let nextIndex = (currentIndex + 1) % contrasts.length;
        const nextContrast = contrasts[nextIndex];
        
        document.body.setAttribute('data-contrast', nextContrast);
        
        // 更新对比度选项
        updateContrastOptions(nextContrast);
        
        // 保存设置
        saveSetting('contrast', nextContrast);
        
        // 屏幕阅读器反馈
        speakText(`已切换到${contrastLabels[nextContrast]}模式`);
    });
    
    // 屏幕阅读器模式
    screenReaderToggle.addEventListener('click', function() {
        const isActive = document.getElementById('screenReaderStatus').getAttribute('aria-live') === 'polite';
        
        if (isActive) {
            disableScreenReader();
            speakText('屏幕阅读器已关闭');
        } else {
            enableScreenReader();
            speakText('屏幕阅读器已开启');
        }
        
        // 保存设置
        saveSetting('screenReader', !isActive);
    });
    
    // 键盘导航模式
    keyboardModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('keyboard-navigation');
        const isActive = document.body.classList.contains('keyboard-navigation');
        
        if (isActive) {
            speakText('键盘导航模式已开启，请使用Tab键进行导航');
            showNotification('键盘导航模式已开启', 'info');
        } else {
            speakText('键盘导航模式已关闭');
        }
        
        // 保存设置
        saveSetting('keyboardNavigation', isActive);
    });
    
    // 模拟障碍体验
    simulateDisabilityBtn.addEventListener('click', function() {
        showSimulationPanel();
    });
    
    // 重置设置
    resetSettingsBtn.addEventListener('click', function() {
        if (confirm('确定要重置所有无障碍设置吗？')) {
            resetAllSettings();
            speakText('所有设置已重置为默认值');
            showNotification('所有设置已重置', 'success');
        }
    });
    
    // 初始化字体大小显示
    fontSizeDisplay.textContent = fontSizeLabels['normal'];
}

// 导航菜单
function initNavigation() {
    const navMenuBtn = document.getElementById('navMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    navMenuBtn.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navMenu.setAttribute('aria-hidden', isExpanded);
    });
    
    // 平滑滚动到锚点
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 关闭移动端菜单
                navMenuBtn.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
                
                // 屏幕阅读器反馈
                speakText(`跳转到${targetElement.querySelector('h2').textContent}`);
            }
        });
    });
}

// 视觉辅助功能
function initVisualFeatures() {
    // 对比度选项
    const contrastOptions = document.querySelectorAll('.contrast-option');
    contrastOptions.forEach(option => {
        option.addEventListener('click', function() {
            const contrast = this.dataset.contrast;
            
            // 更新所有选项状态
            contrastOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // 应用对比度
            document.body.setAttribute('data-contrast', contrast);
            
            // 保存设置
            saveSetting('contrast', contrast);
            
            // 反馈
            speakText(`已切换到${this.textContent}模式`);
        });
    });
    
    // 字体大小选项
    const fontSizeOptions = document.querySelectorAll('.font-size-option');
    fontSizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const size = this.dataset.size;
            
            // 更新所有选项状态
            fontSizeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // 应用字体大小
            document.body.setAttribute('data-font-size', size);
            
            // 更新工具栏显示
            const fontSizeLabels = {
                'small': '小',
                'normal': '中',
                'large': '大',
                'xlarge': '特大'
            };
            document.getElementById('fontSizeDisplay').textContent = fontSizeLabels[size];
            
            // 保存设置
            saveSetting('fontSize', size);
            
            // 反馈
            speakText(`字体大小已调整为${fontSizeLabels[size]}`);
        });
    });
    
    // 阅读辅助线
    const readingGuideToggle = document.getElementById('readingGuideToggle');
    const readingGuide = document.getElementById('readingGuide');
    
    readingGuideToggle.addEventListener('change', function() {
        if (this.checked) {
            readingGuide.setAttribute('aria-hidden', 'false');
            speakText('阅读辅助线已开启');
        } else {
            readingGuide.setAttribute('aria-hidden', 'true');
            speakText('阅读辅助线已关闭');
        }
        
        // 保存设置
        saveSetting('readingGuide', this.checked);
    });
    
    // 色盲模式
    const colorBlindMode = document.getElementById('colorBlindMode');
    colorBlindMode.addEventListener('change', function() {
        const mode = this.value;
        
        // 移除现有的色盲模式类
        document.body.classList.remove(
            'protanopia-mode',
            'deuteranopia-mode',
            'tritanopia-mode',
            'monochromacy-mode'
        );
        
        // 添加新的色盲模式类
        if (mode !== 'normal') {
            document.body.classList.add(`${mode}-mode`);
        }
        
        // 保存设置
        saveSetting('colorBlindMode', mode);
        
        // 反馈
        speakText(`已切换到${this.options[this.selectedIndex].text}模式`);
    });
    
    // 焦点高亮
    const focusOptions = document.querySelectorAll('.focus-option');
    focusOptions.forEach(option => {
        option.addEventListener('click', function() {
            const focus = this.dataset.focus;
            
            // 更新所有选项状态
            focusOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // 更新焦点样式
            updateFocusStyle(focus);
            
            // 保存设置
            saveSetting('focusStyle', focus);
            
            // 反馈
            speakText(`焦点高亮已设置为${this.textContent}`);
        });
    });
}

// 听觉辅助功能
function initAuditoryFeatures() {
    // 语音合成
    const voiceSelect = document.getElementById('voiceSelect');
    const rateRange = document.getElementById('rateRange');
    const rateValue = document.getElementById('rateValue');
    const pitchRange = document.getElementById('pitchRange');
    const pitchValue = document.getElementById('pitchValue');
    const readPageBtn = document.getElementById('readPage');
    const pauseSpeechBtn = document.getElementById('pauseSpeech');
    const stopSpeechBtn = document.getElementById('stopSpeech');
    
    // 语速控制
    rateRange.addEventListener('input', function() {
        rateValue.textContent = `${this.value}x`;
        saveSetting('speechRate', this.value);
    });
    
    // 音调控制
    pitchRange.addEventListener('input', function() {
        pitchValue.textContent = this.value;
        saveSetting('speechPitch', this.value);
    });
    
    // 朗读页面
    readPageBtn.addEventListener('click', function() {
        readCurrentPage();
    });
    
    // 暂停朗读
    pauseSpeechBtn.addEventListener('click', function() {
        if (window.speechSynthesis.speaking) {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
                speakText('继续朗读');
            } else {
                window.speechSynthesis.pause();
                speakText('已暂停');
            }
        }
    });
    
    // 停止朗读
    stopSpeechBtn.addEventListener('click', function() {
        window.speechSynthesis.cancel();
        speakText('朗读已停止');
    });
    
    // 字幕设置
    const captionSize = document.getElementById('captionSize');
    const captionColor = document.getElementById('captionColor');
    const captionBackground = document.getElementById('captionBackground');
    const captionDisplay = document.getElementById('captionDisplay');
    
    captionSize.addEventListener('change', updateCaptionStyle);
    captionColor.addEventListener('input', updateCaptionStyle);
    captionBackground.addEventListener('input', updateCaptionStyle);
    
    function updateCaptionStyle() {
        const sizeMap = {
            'small': '14px',
            'normal': '16px',
            'large': '20px',
            'xlarge': '24px'
        };
        
        captionDisplay.style.fontSize = sizeMap[captionSize.value];
        captionDisplay.style.color = captionColor.value;
        captionDisplay.style.backgroundColor = captionBackground.value;
        
        // 保存设置
        saveSetting('captionSize', captionSize.value);
        saveSetting('captionColor', captionColor.value);
        saveSetting('captionBackground', captionBackground.value);
    }
    
    // 音频描述
    const playAudioDescBtn = document.getElementById('playAudioDescription');
    const audioDescText = document.getElementById('audioDescText');
    
    playAudioDescBtn.addEventListener('click', function() {
        speakText(audioDescText.textContent);
    });
    
    // 声音反馈
    const successSoundBtn = document.getElementById('successSound');
    const errorSoundBtn = document.getElementById('errorSound');
    const clickSoundBtn = document.getElementById('clickSound');
    
    successSoundBtn.addEventListener('click', function() {
        playSound('success');
    });
    
    errorSoundBtn.addEventListener('click', function() {
        playSound('error');
    });
    
    clickSoundBtn.addEventListener('click', function() {
        playSound('click');
    });
}

// 运动辅助功能
function initMotorFeatures() {
    // 键盘导航演示
    const focusDemoItems = document.querySelectorAll('.focus-demo-item');
    focusDemoItems.forEach(item => {
        item.addEventListener('focus', function() {
            speakText(`焦点在元素 ${this.dataset.item}`);
        });
    });
    
    // 语音控制
    const startVoiceControlBtn = document.getElementById('startVoiceControl');
    const voiceControlStatus = document.getElementById('voiceControlStatus');
    const commandExamples = document.querySelectorAll('.command-example');
    const voiceFeedback = document.getElementById('voiceFeedback');
    
    let isVoiceControlActive = false;
    
    startVoiceControlBtn.addEventListener('click', function() {
        if (!isVoiceControlActive) {
            startVoiceControl();
        } else {
            stopVoiceControl();
        }
    });
    
    commandExamples.forEach(example => {
        example.addEventListener('click', function() {
            const command = this.dataset.command;
            executeVoiceCommand(command);
        });
    });
    
    // 点击区域放大
    const touchTargetToggle = document.getElementById('touchTargetToggle');
    
    touchTargetToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('enhanced-touch-targets');
            speakText('点击区域放大已开启');
        } else {
            document.body.classList.remove('enhanced-touch-targets');
            speakText('点击区域放大已关闭');
        }
        
        // 保存设置
        saveSetting('enhancedTouchTargets', this.checked);
    });
    
    // 手势简化演示
    const simpleButtons = document.querySelectorAll('.simple-btn');
    simpleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('i').className;
            if (action.includes('chevron-left')) {
                speakText('上一项');
            } else if (action.includes('chevron-right')) {
                speakText('下一项');
            } else if (action.includes('search-plus')) {
                speakText('放大');
            } else if (action.includes('search-minus')) {
                speakText('缩小');
            }
        });
    });
}

// 认知辅助功能
function initCognitiveFeatures() {
    // 简化界面
    const simplifyToggle = document.getElementById('simplifyToggle');
    
    simplifyToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('simplified-interface');
            speakText('简化界面已开启');
        } else {
            document.body.classList.remove('simplified-interface');
            speakText('简化界面已关闭');
        }
        
        // 保存设置
        saveSetting('simplifiedInterface', this.checked);
    });
    
    // 阅读辅助
    const highlightTextBtn = document.getElementById('highlightText');
    const segmentTextBtn = document.getElementById('segmentText');
    const readAloudBtn = document.getElementById('readAloud');
    const demoText = document.getElementById('demoText');
    
    highlightTextBtn.addEventListener('click', function() {
        demoText.classList.toggle('highlighted');
        speakText(demoText.classList.contains('highlighted') ? 
                  '已高亮重点内容' : '已取消高亮');
    });
    
    segmentTextBtn.addEventListener('click', function() {
        demoText.classList.toggle('segmented');
        speakText(demoText.classList.contains('segmented') ? 
                  '已分段显示文本' : '已取消分段显示');
    });
    
    readAloudBtn.addEventListener('click', function() {
        speakText(demoText.textContent);
    });
    
    // 记忆辅助
    const demoInput = document.getElementById('demoInput');
    const saveStatus = document.getElementById('saveStatus');
    
    let saveTimer;
    demoInput.addEventListener('input', function() {
        clearTimeout(saveTimer);
        saveStatus.textContent = '正在保存...';
        
        saveTimer = setTimeout(() => {
            saveStatus.textContent = '已自动保存';
            setTimeout(() => {
                saveStatus.textContent = '';
            }, 2000);
        }, 1000);
    });
    
    // 导航提示演示
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;
    
    function updateSteps() {
        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    // 模拟步骤进展
    setInterval(() => {
        currentStep = (currentStep + 1) % steps.length;
        updateSteps();
    }, 3000);
}

// 测试工具
function initTestingTools() {
    // 障碍模拟
    const applySimulationBtn = document.getElementById('applySimulation');
    const resetSimulationBtn = document.getElementById('resetSimulation');
    
    applySimulationBtn.addEventListener('click', function() {
        applySimulation();
    });
    
    resetSimulationBtn.addEventListener('click', function() {
        resetSimulation();
    });
    
    // 无障碍检查
    const runAccessibilityCheckBtn = document.getElementById('runAccessibilityCheck');
    const checkResults = document.getElementById('checkResults');
    
    runAccessibilityCheckBtn.addEventListener('click', function() {
        runAccessibilityCheck();
    });
    
    // 对比度检查
    const textColorPicker = document.getElementById('textColorPicker');
    const bgColorPicker = document.getElementById('bgColorPicker');
    const contrastText = document.getElementById('contrastText');
    const contrastRatio = document.getElementById('contrastRatio');
    const contrastStatus = document.getElementById('contrastStatus');
    const checkContrastBtn = document.getElementById('checkContrast');
    
    textColorPicker.addEventListener('input', function() {
        contrastText.style.color = this.value;
    });
    
    bgColorPicker.addEventListener('input', function() {
        contrastText.parentElement.style.backgroundColor = this.value;
    });
    
    checkContrastBtn.addEventListener('click', function() {
        const textColor = textColorPicker.value;
        const bgColor = bgColorPicker.value;
        const ratio = calculateContrastRatio(textColor, bgColor);
        
        contrastRatio.textContent = `对比度: ${ratio.toFixed(2)}:1`;
        
        let status = '';
        let statusClass = '';
        
        if (ratio >= 7) {
            status = 'AAA级';
            statusClass = 'success';
        } else if (ratio >= 4.5) {
            status = 'AA级';
            statusClass = 'success';
        } else if (ratio >= 3) {
            status = 'A级';
            statusClass = 'warning';
        } else {
            status = '不合格';
            statusClass = 'error';
        }
        
        contrastStatus.textContent = status;
        contrastStatus.className = `contrast-status ${statusClass}`;
    });
    
    // 键盘导航测试
    const startKeyboardTestBtn = document.getElementById('startKeyboardTest');
    const currentFocus = document.getElementById('currentFocus');
    const tabOrder = document.getElementById('tabOrder');
    const testElements = document.querySelectorAll('.test-element');
    
    startKeyboardTestBtn.addEventListener('click', function() {
        startKeyboardTest();
    });
    
    testElements.forEach(element => {
        element.addEventListener('focus', function() {
            currentFocus.textContent = this.dataset.test;
        });
    });
}

// 屏幕阅读器功能
function initScreenReader() {
    const screenReaderStatus = document.getElementById('screenReaderStatus');
    const screenReaderOutput = document.getElementById('screenReaderOutput');
    
    window.enableScreenReader = function() {
        screenReaderStatus.setAttribute('aria-live', 'polite');
        screenReaderStatus.textContent = '屏幕阅读器已启用';
        document.body.classList.add('screen-reader-active');
    };
    
    window.disableScreenReader = function() {
        screenReaderStatus.setAttribute('aria-live', 'off');
        screenReaderStatus.textContent = '';
        document.body.classList.remove('screen-reader-active');
    };
    
    // 自动朗读页面标题
    speakText('无障碍设计模式页面已加载');
}

// 语音控制功能
function initVoiceControl() {
    const voiceControlInterface = document.getElementById('voiceControlInterface');
    const closeVoiceControlBtn = document.getElementById('closeVoiceControl');
    const voiceVisualizer = document.getElementById('voiceVisualizer');
    const voiceInstruction = document.getElementById('voiceInstruction');
    
    let recognition = null;
    let isListening = false;
    
    window.startVoiceControl = function() {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            showNotification('您的浏览器不支持语音识别功能', 'error');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'zh-CN';
        recognition.continuous = true;
        recognition.interimResults = false;
        
        recognition.onstart = function() {
            isListening = true;
            document.getElementById('voiceControlStatus').textContent = '停止语音控制';
            voiceControlInterface.setAttribute('aria-hidden', 'false');
            voiceInstruction.textContent = '请说出您的命令...';
            
            // 显示视觉反馈
            startVoiceVisualizer();
            
            speakText('语音控制已启动，请说出您的命令');
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[event.results.length - 1][0].transcript;
            voiceInstruction.textContent = `识别到: ${transcript}`;
            executeVoiceCommand(transcript);
        };
        
        recognition.onerror = function(event) {
            console.error('语音识别错误:', event.error);
            voiceInstruction.textContent = '识别错误，请重试';
        };
        
        recognition.onend = function() {
            isListening = false;
            document.getElementById('voiceControlStatus').textContent = '开始语音控制';
            voiceControlInterface.setAttribute('aria-hidden', 'true');
            stopVoiceVisualizer();
        };
        
        recognition.start();
    };
    
    window.stopVoiceControl = function() {
        if (recognition && isListening) {
            recognition.stop();
            speakText('语音控制已停止');
        }
    };
    
    closeVoiceControlBtn.addEventListener('click', stopVoiceControl);
    
    // 语音可视化
    function startVoiceVisualizer() {
        // 创建可视化效果
        voiceVisualizer.innerHTML = '';
        for (let i = 0; i < 20; i++) {
            const bar = document.createElement('div');
            bar.className = 'voice-bar';
            bar.style.cssText = `
                width: 4px;
                height: 20px;
                background: #2196F3;
                margin: 0 2px;
                animation: voicePulse 0.5s infinite alternate;
                animation-delay: ${i * 0.05}s;
            `;
            voiceVisualizer.appendChild(bar);
        }
    }
    
    function stopVoiceVisualizer() {
        voiceVisualizer.innerHTML = '';
    }
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes voicePulse {
            from { height: 20px; }
            to { height: 60px; }
        }
    `;
    document.head.appendChild(style);
}

// 语音合成初始化
function initSpeechSynthesis() {
    const voiceSelect = document.getElementById('voiceSelect');
    
    // 加载可用语音
    function loadVoices() {
        const voices = window.speechSynthesis.getVoices();
        voiceSelect.innerHTML = '';
        
        // 过滤中文语音
        const chineseVoices = voices.filter(voice => voice.lang.includes('zh'));
        
        chineseVoices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
        
        // 如果没有中文语音，添加默认选项
        if (chineseVoices.length === 0) {
            const option = document.createElement('option');
            option.value = 'default';
            option.textContent = '默认语音';
            voiceSelect.appendChild(option);
        }
    }
    
    // 语音加载可能异步，所以需要事件监听
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    loadVoices();
    
    // 语音选择
    voiceSelect.addEventListener('change', function() {
        saveSetting('selectedVoice', this.value);
    });
}

// 语音命令执行
function executeVoiceCommand(command) {
    command = command.toLowerCase();
    let response = '';
    
    if (command.includes('打开导航')) {
        document.getElementById('navMenuBtn').click();
        response = '已打开导航菜单';
    } else if (command.includes('朗读页面')) {
        readCurrentPage();
        response = '开始朗读页面';
    } else if (command.includes('增大字体')) {
        document.getElementById('increaseFont').click();
        response = '已增大字体';
    } else if (command.includes('减小字体')) {
        document.getElementById('decreaseFont').click();
        response = '已减小字体';
    } else if (command.includes('高对比度')) {
        document.getElementById('highContrastToggle').click();
        response = '已切换对比度模式';
    } else if (command.includes('帮助')) {
        response = '可用命令：打开导航，朗读页面，增大字体，减小字体，高对比度，关闭';
    } else if (command.includes('关闭')) {
        stopVoiceControl();
        response = '语音控制已关闭';
    } else {
        response = `命令"${command}"无法识别，请说"帮助"查看可用命令`;
    }
    
    speakText(response);
    showNotification(response, 'info');
}

// 朗读当前页面
function readCurrentPage() {
    const pageTitle = document.querySelector('h1').textContent;
    const sectionHeadings = Array.from(document.querySelectorAll('h2')).map(h2 => h2.textContent);
    
    let textToRead = `${pageTitle}。`;
    sectionHeadings.forEach((heading, index) => {
        textToRead += `第${index + 1}部分：${heading}。`;
    });
    
    speakText(textToRead);
}

// 播放声音
function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    let frequency = 440;
    let duration = 0.2;
    
    switch(type) {
        case 'success':
            frequency = 523.25; // C5
            break;
        case 'error':
            frequency = 349.23; // F4
            break;
        case 'click':
            frequency = 659.25; // E5
            duration = 0.1;
            break;
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// 计算对比度
function calculateContrastRatio(color1, color2) {
    const luminance1 = getLuminance(color1);
    const luminance2 = getLuminance(color2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

function getLuminance(color) {
    const rgb = hexToRgb(color);
    const [r, g, b] = rgb.map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [0, 0, 0];
}

// 应用模拟障碍
function applySimulation() {
    const simulations = {
        simBlur: '视力模糊',
        simTunnel: '管状视野',
        simColorBlind: '色盲',
        simTremor: '手部颤抖',
        simDyslexia: '阅读障碍'
    };
    
    let appliedSimulations = [];
    
    for (const [id, name] of Object.entries(simulations)) {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked) {
            document.body.classList.add(id);
            appliedSimulations.push(name);
        }
    }
    
    if (appliedSimulations.length > 0) {
        speakText(`已应用模拟：${appliedSimulations.join('，')}`);
        showNotification(`已应用${appliedSimulations.length}种障碍模拟`, 'success');
    } else {
        showNotification('请至少选择一种障碍类型进行模拟', 'warning');
    }
}

// 重置模拟
function resetSimulation() {
    const simulations = ['simBlur', 'simTunnel', 'simColorBlind', 'simTremor', 'simDyslexia'];
    simulations.forEach(sim => {
        document.body.classList.remove(sim);
        const checkbox = document.getElementById(sim);
        if (checkbox) checkbox.checked = false;
    });
    
    speakText('已重置所有障碍模拟');
    showNotification('已重置所有障碍模拟', 'success');
}

// 无障碍检查
function runAccessibilityCheck() {
    const checkResults = document.getElementById('checkResults');
    checkResults.innerHTML = '<p>正在检查无障碍问题...</p>';
    
    // 模拟检查过程
    setTimeout(() => {
        const issues = [
            { type: 'warning', message: '找到3个图片缺少alt属性' },
            { type: 'error', message: '找到1个表单元素缺少标签' },
            { type: 'success', message: '颜色对比度全部符合标准' },
            { type: 'warning', message: '建议为视频内容添加字幕' }
        ];
        
        let html = '<h4>检查结果：</h4><ul>';
        issues.forEach(issue => {
            html += `<li class="${issue.type}">${issue.message}</li>`;
        });
        html += '</ul>';
        
        checkResults.innerHTML = html;
        
        speakText(`无障碍检查完成，找到${issues.length}个问题`);
    }, 2000);
}

// 键盘导航测试
function startKeyboardTest() {
    const testElements = document.querySelectorAll('.test-element');
    const tabOrder = document.getElementById('tabOrder');
    let currentIndex = 0;
    
    // 聚焦第一个元素
    testElements[0].focus();
    tabOrder.textContent = '测试中...';
    
    // 监听键盘事件
    function handleKeyDown(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % testElements.length;
            testElements[currentIndex].focus();
        } else if (e.key === 'Escape') {
            endKeyboardTest();
        }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    
    // 保存测试状态
    window.currentKeyboardTest = {
        handleKeyDown: handleKeyDown,
        end: function() {
            document.removeEventListener('keydown', this.handleKeyDown);
            tabOrder.textContent = '测试完成';
            speakText('键盘导航测试完成');
        }
    };
    
    speakText('键盘导航测试开始，请使用Tab键导航，按ESC键结束测试');
}

function endKeyboardTest() {
    if (window.currentKeyboardTest) {
        window.currentKeyboardTest.end();
        window.currentKeyboardTest = null;
    }
}

// 设置管理
function saveSetting(key, value) {
    let settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
    settings[key] = value;
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
}

function loadSavedSettings() {
    const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
    
    // 字体大小
    if (settings.fontSize) {
        document.body.setAttribute('data-font-size', settings.fontSize);
        updateFontSizeOptions(settings.fontSize);
        document.getElementById('fontSizeDisplay').textContent = 
            {small: '小', normal: '中', large: '大', xlarge: '特大'}[settings.fontSize];
    }
    
    // 对比度
    if (settings.contrast) {
        document.body.setAttribute('data-contrast', settings.contrast);
        updateContrastOptions(settings.contrast);
    }
    
    // 其他设置...
}

function updateFontSizeOptions(size) {
    const fontSizeOptions = document.querySelectorAll('.font-size-option');
    fontSizeOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.size === size);
    });
}

function updateContrastOptions(contrast) {
    const contrastOptions = document.querySelectorAll('.contrast-option');
    contrastOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.contrast === contrast);
    });
}

function updateFocusStyle(focus) {
    // 更新焦点样式
    const styleId = 'focus-style';
    let style = document.getElementById(styleId);
    
    if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
    }
    
    let css = '';
    switch(focus) {
        case 'high':
            css = '*:focus { outline: 3px solid #FF0000 !important; outline-offset: 3px !important; }';
            break;
        case 'extra':
            css = '*:focus { outline: 5px solid #00FF00 !important; outline-offset: 5px !important; box-shadow: 0 0 0 10px rgba(0,255,0,0.3) !important; }';
            break;
        default:
            css = '*:focus { outline: 2px solid #2196F3 !important; outline-offset: 2px !important; }';
    }
    
    style.textContent = css;
}

function resetAllSettings() {
    localStorage.removeItem('accessibilitySettings');
    
    // 重置所有设置
    document.body.setAttribute('data-font-size', 'normal');
    document.body.setAttribute('data-contrast', 'normal');
    document.body.className = 'accessibility-mode';
    
    // 重置所有复选框和选择框
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
    
    // 重置范围输入
    document.querySelectorAll('input[type="range"]').forEach(range => {
        if (range.id === 'rateRange') range.value = 1;
        if (range.id === 'pitchRange') range.value = 1;
    });
    
    // 更新显示
    updateFontSizeOptions('normal');
    updateContrastOptions('normal');
    document.getElementById('fontSizeDisplay').textContent = '中';
    
    // 关闭屏幕阅读器
    disableScreenReader();
    
    // 移除键盘导航模式
    document.body.classList.remove('keyboard-navigation');
}

// 显示模拟面板
function showSimulationPanel() {
    const overlay = document.querySelector('.overlay') || document.createElement('div');
    overlay.className = 'overlay';
    
    const panel = document.createElement('div');
    panel.className = 'simulation-panel';
    panel.innerHTML = `
        <div class="panel-header">
            <h3>障碍模拟体验</h3>
            <button class="close-panel" aria-label="关闭">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="panel-body">
            <p>选择要模拟的障碍类型，然后点击"开始体验"。</p>
            <div class="simulation-options">
                <!-- 选项与主页面相同 -->
            </div>
        </div>
        <div class="panel-footer">
            <button id="applySimulationPanel" class="btn-primary">开始体验</button>
            <button id="closeSimulationPanel" class="btn-secondary">取消</button>
        </div>
    `;
    
    // 复制选项
    const originalOptions = document.querySelector('.simulation-options').cloneNode(true);
    panel.querySelector('.simulation-options').innerHTML = originalOptions.innerHTML;
    
    document.body.appendChild(overlay);
    document.body.appendChild(panel);
    
    // 显示面板和遮罩
    setTimeout(() => {
        overlay.classList.add('show');
        panel.style.display = 'block';
        panel.style.animation = 'slideIn 0.3s ease';
    }, 10);
    
    // 关闭事件
    function closePanel() {
        overlay.classList.remove('show');
        panel.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(overlay);
            document.body.removeChild(panel);
        }, 300);
    }
    
    panel.querySelector('.close-panel').addEventListener('click', closePanel);
    panel.querySelector('#closeSimulationPanel').addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);
    
    panel.querySelector('#applySimulationPanel').addEventListener('click', function() {
        // 获取面板中的选项
        const checkboxes = panel.querySelectorAll('.sim-checkbox');
        checkboxes.forEach(cb => {
            const mainCheckbox = document.getElementById(cb.id);
            if (mainCheckbox) {
                mainCheckbox.checked = cb.checked;
            }
        });
        
        applySimulation();
        closePanel();
    });
}

// 语音合成函数
function speakText(text) {
    if (!window.speechSynthesis) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    
    // 应用设置
    const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
    utterance.rate = parseFloat(settings.speechRate) || 1;
    utterance.pitch = parseFloat(settings.speechPitch) || 1;
    
    // 设置语音
    const selectedVoice = settings.selectedVoice;
    if (selectedVoice && selectedVoice !== 'default') {
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.name === selectedVoice);
        if (voice) utterance.voice = voice;
    }
    
    window.speechSynthesis.speak(utterance);
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `accessibility-notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#4CAF50' : 
                     type === 'error' ? '#F44336' : 
                     type === 'warning' ? '#FFC107' : '#2196F3'};
        color: white;
        border-radius: 8px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: notificationIn 0.3s ease, notificationOut 0.3s ease 2.7s;
        max-width: 300px;
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
    @keyframes notificationIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes notificationOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl+Alt+A 切换无障碍工具栏
    if (e.ctrlKey && e.altKey && e.key === 'a') {
        e.preventDefault();
        const toolbar = document.querySelector('.accessibility-toolbar');
        toolbar.style.display = toolbar.style.display === 'none' ? 'block' : 'none';
    }
    
    // ESC 键关闭所有弹窗
    if (e.key === 'Escape') {
        const overlay = document.querySelector('.overlay');
        const panels = document.querySelectorAll('.simulation-panel, .voice-control-interface');
        
        if (overlay) overlay.classList.remove('show');
        panels.forEach(panel => {
            panel.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (panel.parentNode) panel.parentNode.removeChild(panel);
            }, 300);
        });
        
        // 停止语音控制
        if (window.voiceControlActive) {
            stopVoiceControl();
        }
    }
});

// 初始化完成提示
setTimeout(() => {
    speakText('无障碍设计模式已准备就绪，您可以使用工具栏调整设置');
}, 1000);
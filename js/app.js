class TimerApp {
    constructor() {
        this.currentSession = 1;
        this.currentMode = 'idle'; // idle, lecture, break
        this.timeRemaining = 0;
        this.timerInterval = null;
        this.lectureTime = 50; // minutes
        this.break1Time = 10; // minutes
        this.break2Time = 60; // minutes
        this.selectedBreakType = 1; // 1 or 2
        this.volume = 0.5;
        this.isMuted = false;
        this.isOvertime = false;
        this.warningTime = 3; // minutes
        this.tickInterval = 60; // seconds
        this.customEndTime = null; // Custom end time override
        this.originalTimeRemaining = 0; // Store original time for reset
        
        this.sounds = {
            sound1: new Audio('audio/sound1-1.wav'), // 警告音
            sound2: new Audio('audio/sound2-1.wav'), // 終了音
            sound3: new Audio('audio/sound3-1.wav')  // 経過音
        };
        
        this.elements = this.initializeElements();
        this.initializeEventListeners();
        this.initializeSettings();
        this.updateDisplay();
        this.updateCurrentTime();
        this.updateHeaderTime();
        
        // Update current time every second
        setInterval(() => {
            this.updateCurrentTime();
            this.updateHeaderTime();
        }, 1000);
    }
    
    initializeElements() {
        return {
            // Display elements
            headerTitle: document.getElementById('header-title'),
            timer: document.getElementById('timer'),
            currentTimeHeader: document.getElementById('current-time-header'),
            endTime: document.getElementById('end-time'),
            endTimeContainer: document.getElementById('end-time-container'),
            timeAdjustControls: document.getElementById('time-adjust-controls'),
            endTimeMinus10: document.getElementById('end-time-minus-10'),
            endTimeMinus1: document.getElementById('end-time-minus-1'),
            endTimePlus1: document.getElementById('end-time-plus-1'),
            endTimePlus10: document.getElementById('end-time-plus-10'),
            progressFill: document.getElementById('progress-fill'),
            progressText: document.getElementById('progress-text'),
            
            // Control elements
            startLectureBtn: document.getElementById('start-lecture'),
            startLectureBreakBtn: document.getElementById('start-lecture-break'),
            startBreak1Btn: document.getElementById('start-break1'),
            startBreak2Btn: document.getElementById('start-break2'),
            stopTimerBtn: document.getElementById('stop-timer'),
            
            // Theme and settings
            muteToggle: document.getElementById('mute-toggle'),
            themeToggle: document.getElementById('theme-toggle'),
            fullscreenBtn: document.getElementById('fullscreen-btn'),
            settingsBtn: document.getElementById('settings-btn'),
            settingsModal: document.getElementById('settings-modal'),
            closeSettings: document.getElementById('close-settings'),
            
            // Settings inputs
            lectureTimeSettings: document.getElementById('lecture-time-settings'),
            break1TimeSettings: document.getElementById('break1-time-settings'),
            break2TimeSettings: document.getElementById('break2-time-settings'),
            warningTimeSettings: document.getElementById('warning-time-settings'),
            tickIntervalSettings: document.getElementById('tick-interval-settings'),
            
            // Settings controls
            volumeSlider: document.getElementById('volume-slider'),
            volumeValue: document.getElementById('volume-value'),
            sound1Select: document.getElementById('sound1-select'),
            sound2Select: document.getElementById('sound2-select'),
            sound3Select: document.getElementById('sound3-select')
        };
    }
    
    initializeEventListeners() {
        // Time adjustment buttons
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTimeAdjustment(e));
        });
        
        
        // Action buttons
        this.elements.startLectureBtn.addEventListener('click', () => this.startLecture());
        this.elements.startLectureBreakBtn.addEventListener('click', () => this.startLecture());
        this.elements.startBreak1Btn.addEventListener('click', () => this.startBreak(1));
        this.elements.startBreak2Btn.addEventListener('click', () => this.startBreak(2));
        this.elements.stopTimerBtn.addEventListener('click', () => this.stopTimer());
        
        // Mute toggle
        this.elements.muteToggle.addEventListener('click', () => this.toggleMute());
        
        // End time adjustment buttons
        this.elements.endTimeMinus10.addEventListener('click', () => this.adjustEndTime(-10));
        this.elements.endTimeMinus1.addEventListener('click', () => this.adjustEndTime(-1));
        this.elements.endTimePlus1.addEventListener('click', () => this.adjustEndTime(1));
        this.elements.endTimePlus10.addEventListener('click', () => this.adjustEndTime(10));
        
        // Theme toggle
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Fullscreen toggle
        this.elements.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Settings modal
        this.elements.settingsBtn.addEventListener('click', () => this.openSettings());
        this.elements.closeSettings.addEventListener('click', () => this.closeSettings());
        this.elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsModal) {
                this.closeSettings();
            }
        });
        
        // Volume control
        this.elements.volumeSlider.addEventListener('input', (e) => {
            this.volume = e.target.value / 100;
            this.elements.volumeValue.textContent = e.target.value + '%';
            this.updateSoundVolumes();
            this.saveSettings();
        });
        
        // Test sound buttons
        document.querySelectorAll('.test-sound').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const soundType = e.target.dataset.sound;
                this.playSound(soundType);
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Settings time adjustment buttons
        document.querySelectorAll('.time-btn').forEach(btn => {
            const action = btn.dataset.action;
            if (action && (action.includes('settings') || action.includes('warning-time') || action.includes('tick-interval'))) {
                btn.addEventListener('click', (e) => this.handleSettingsTimeAdjustment(e));
            }
        });
        
        // Settings input changes
        this.elements.lectureTimeSettings.addEventListener('input', (e) => {
            this.lectureTime = parseInt(e.target.value) || 1;
            this.elements.lectureTimeInput.value = this.lectureTime;
            this.updateDisplay();
            this.saveSettings();
        });
        
        this.elements.break1TimeSettings.addEventListener('input', (e) => {
            this.break1Time = parseInt(e.target.value) || 1;
            this.updateBreakTypeLabels();
            this.saveSettings();
        });
        
        this.elements.break2TimeSettings.addEventListener('input', (e) => {
            this.break2Time = parseInt(e.target.value) || 1;
            this.updateBreakTypeLabels();
            this.saveSettings();
        });
        
        this.elements.warningTimeSettings.addEventListener('input', (e) => {
            this.warningTime = parseInt(e.target.value) || 1;
            this.saveSettings();
        });
        
        this.elements.tickIntervalSettings.addEventListener('input', (e) => {
            this.tickInterval = parseInt(e.target.value) || 10;
            this.saveSettings();
        });
        
        // Sound selection changes
        this.elements.sound1Select.addEventListener('change', (e) => {
            this.sounds.sound1.src = e.target.value;
            this.saveSettings();
        });
        
        this.elements.sound2Select.addEventListener('change', (e) => {
            this.sounds.sound2.src = e.target.value;
            this.saveSettings();
        });
        
        this.elements.sound3Select.addEventListener('change', (e) => {
            this.sounds.sound3.src = e.target.value;
            this.saveSettings();
        });
    }
    
    initializeSettings() {
        // Load saved settings
        const savedSettings = localStorage.getItem('timerSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            this.volume = settings.volume || 0.5;
            this.lectureTime = settings.lectureTime || 50;
            this.break1Time = settings.break1Time || 10;
            this.break2Time = settings.break2Time || 60;
            this.selectedBreakType = settings.selectedBreakType || 1;
            this.warningTime = settings.warningTime || 3;
            this.tickInterval = settings.tickInterval || 60;
            this.isMuted = settings.isMuted || false;
            
            this.elements.volumeSlider.value = this.volume * 100;
            this.elements.volumeValue.textContent = Math.round(this.volume * 100) + '%';
            this.elements.lectureTimeSettings.value = this.lectureTime;
            this.elements.break1TimeSettings.value = this.break1Time;
            this.elements.break2TimeSettings.value = this.break2Time;
            this.elements.warningTimeSettings.value = this.warningTime;
            this.elements.tickIntervalSettings.value = this.tickInterval;
            
            // Load sound selections
            if (settings.sound1Src) {
                this.sounds.sound1.src = settings.sound1Src;
                this.elements.sound1Select.value = settings.sound1Src;
            }
            if (settings.sound2Src) {
                this.sounds.sound2.src = settings.sound2Src;
                this.elements.sound2Select.value = settings.sound2Src;
            }
            if (settings.sound3Src) {
                this.sounds.sound3.src = settings.sound3Src;
                this.elements.sound3Select.value = settings.sound3Src;
            }
            
            // Update break type labels
            this.updateBreakTypeLabels();
        }
        
        // Update mute button
        this.elements.muteToggle.textContent = this.isMuted ? '🔇' : '🔊';
        this.elements.muteToggle.classList.toggle('muted', this.isMuted);
        this.elements.muteToggle.title = this.isMuted ? 'Unmute' : 'Mute';
        
        // Set default sound selections if not already set
        if (!this.elements.sound1Select.value) {
            this.elements.sound1Select.value = 'audio/sound1-1.wav';
        }
        if (!this.elements.sound2Select.value) {
            this.elements.sound2Select.value = 'audio/sound2-1.wav';
        }
        if (!this.elements.sound3Select.value) {
            this.elements.sound3Select.value = 'audio/sound3-1.wav';
        }
        
        // Load saved theme
        const savedTheme = localStorage.getItem('timerTheme') || 'light';
        if (savedTheme === 'dark') {
            document.body.dataset.theme = 'dark';
            this.elements.themeToggle.textContent = '☀️';
        }
        
        this.updateSoundVolumes();
    }
    
    handleTimeAdjustment(e) {
        const action = e.target.dataset.action;
        
        switch (action) {
            case 'increase-lecture':
                this.lectureTime = Math.min(300, this.lectureTime + 1);
                this.elements.lectureTimeInput.value = this.lectureTime;
                break;
            case 'decrease-lecture':
                this.lectureTime = Math.max(1, this.lectureTime - 1);
                this.elements.lectureTimeInput.value = this.lectureTime;
                break;
        }
        
        this.updateDisplay();
        this.saveSettings();
    }
    
    
    handleSettingsTimeAdjustment(e) {
        const action = e.target.dataset.action;
        
        switch (action) {
            case 'increase-lecture-settings':
                this.lectureTime = Math.min(300, this.lectureTime + 1);
                this.elements.lectureTimeSettings.value = this.lectureTime;
                break;
            case 'decrease-lecture-settings':
                this.lectureTime = Math.max(1, this.lectureTime - 1);
                this.elements.lectureTimeSettings.value = this.lectureTime;
                break;
            case 'increase-break1-settings':
                this.break1Time = Math.min(120, this.break1Time + 1);
                this.elements.break1TimeSettings.value = this.break1Time;
                break;
            case 'decrease-break1-settings':
                this.break1Time = Math.max(1, this.break1Time - 1);
                this.elements.break1TimeSettings.value = this.break1Time;
                break;
            case 'increase-break2-settings':
                this.break2Time = Math.min(120, this.break2Time + 1);
                this.elements.break2TimeSettings.value = this.break2Time;
                break;
            case 'decrease-break2-settings':
                this.break2Time = Math.max(1, this.break2Time - 1);
                this.elements.break2TimeSettings.value = this.break2Time;
                break;
            case 'increase-warning-time':
                this.warningTime = Math.min(10, this.warningTime + 1);
                this.elements.warningTimeSettings.value = this.warningTime;
                break;
            case 'decrease-warning-time':
                this.warningTime = Math.max(1, this.warningTime - 1);
                this.elements.warningTimeSettings.value = this.warningTime;
                break;
            case 'increase-tick-interval':
                this.tickInterval = Math.min(300, this.tickInterval + 10);
                this.elements.tickIntervalSettings.value = this.tickInterval;
                break;
            case 'decrease-tick-interval':
                this.tickInterval = Math.max(10, this.tickInterval - 10);
                this.elements.tickIntervalSettings.value = this.tickInterval;
                break;
        }
        
        this.updateDisplay();
        this.updateBreakTypeLabels();
        this.saveSettings();
    }
    
    
    updateBreakTypeLabels() {
        if (this.elements.startBreak1Btn) {
            this.elements.startBreak1Btn.title = `休憩開始（${this.break1Time}分）`;
        }
        if (this.elements.startBreak2Btn) {
            this.elements.startBreak2Btn.title = `休憩開始（${this.break2Time}分）`;
        }
    }
    
    startLecture() {
        this.currentMode = 'lecture';
        this.timeRemaining = this.lectureTime * 60; // Convert to seconds
        this.isOvertime = false;
        
        // Remove overtime class and unmute
        this.elements.timer.classList.remove('overtime', 'break-mode');
        this.elements.endTimeContainer.classList.remove('break-mode');
        this.unmuteSounds();
        this.customEndTime = null;
        this.originalTimeRemaining = this.timeRemaining;
        this.showTimeAdjustControls();
        
        this.startTimer();
        this.updateButtonStates();
        this.elements.headerTitle.textContent = 'Lecture in Progress';
        this.elements.headerTitle.className = 'lecture';
    }
    
    startBreak(breakType) {
        this.currentMode = 'break';
        this.selectedBreakType = breakType;
        const breakTime = breakType === 1 ? this.break1Time : this.break2Time;
        this.timeRemaining = breakTime * 60; // Convert to seconds
        this.isOvertime = false;
        
        // Remove overtime class and unmute
        this.elements.timer.classList.remove('overtime');
        this.elements.timer.classList.add('break-mode');
        this.elements.endTimeContainer.classList.add('break-mode');
        this.unmuteSounds();
        this.customEndTime = null;
        this.originalTimeRemaining = this.timeRemaining;
        this.showTimeAdjustControls();
        
        this.startTimer();
        this.updateButtonStates();
        this.elements.headerTitle.textContent = 'Break in Progress';
        this.elements.headerTitle.className = 'break';
    }
    
    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        const startTime = Date.now();
        const originalTime = this.timeRemaining;
        
        this.timerInterval = setInterval(() => {
            if (this.customEndTime) {
                // Use custom end time - recalculate remaining time
                this.recalculateTimeRemaining();
            } else {
                // Use original countdown logic
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                this.timeRemaining = originalTime - elapsed;
            }
            
            // Handle overtime for lectures
            if (this.timeRemaining < 0 && this.currentMode === 'lecture') {
                if (!this.isOvertime) {
                    this.isOvertime = true;
                    this.playSound('sound2'); // Play end sound when time reaches 0
                    this.elements.timer.classList.add('overtime');
                    this.elements.headerTitle.className = 'lecture warning';
                }
                this.updateDisplay();
                this.updateEndTime();
                this.checkOvertimeSounds();
            } else if (this.timeRemaining <= 0 && this.currentMode === 'break') {
                this.timerComplete();
            } else {
                this.updateDisplay();
                this.checkSoundTriggers();
            }
        }, 1000);
        
        this.updateEndTime();
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.currentMode = 'idle';
        this.timeRemaining = 0;
        this.isOvertime = false;
        this.updateButtonStates();
        this.elements.headerTitle.textContent = 'Lecture Preparation';
        this.elements.headerTitle.className = '';
        this.elements.timer.classList.remove('overtime', 'break-mode');
        this.elements.endTimeContainer.classList.remove('break-mode');
        this.hideTimeAdjustControls();
        this.customEndTime = null;
        this.updateDisplay();
    }
    
    timerComplete() {
        const wasBreak = this.currentMode === 'break';
        this.stopTimer();
        this.playSound('sound2'); // 終了音
        
        if (this.currentMode === 'lecture') {
            this.currentSession++;
        }
        
        // Auto transition after break
        if (wasBreak) {
            // Start lecture automatically after break
            setTimeout(() => {
                this.startLecture();
            }, 1000); // 1秒後に自動的に講義開始
        } else {
            // After lecture, suggest break
            this.elements.headerTitle.textContent = 'Lecture Complete - Break Recommended';
            this.elements.headerTitle.className = '';
            this.elements.timer.classList.remove('overtime', 'break-mode');
            this.elements.endTimeContainer.classList.remove('break-mode');
            this.hideTimeAdjustControls();
        }
    }
    
    checkSoundTriggers() {
        if (this.currentMode === 'lecture') {
            // 警告音
            if (this.timeRemaining === this.warningTime * 60) {
                this.playSound('sound1');
                this.elements.headerTitle.className = 'lecture warning';
            }
            
            // 経過音はカウントアップ時のみ（ここでは鳴らさない）
        }
    }
    
    checkOvertimeSounds() {
        if (this.currentMode === 'lecture' && this.isOvertime) {
            const overtimeSeconds = Math.abs(this.timeRemaining);
            // Play sound at set intervals during overtime
            if (overtimeSeconds > 0 && overtimeSeconds % this.tickInterval === 0) {
                this.playSound('sound3');
            }
        }
    }
    
    playSound(soundType) {
        if (this.sounds[soundType] && this.volume > 0 && !this.isMuted) {
            this.sounds[soundType].currentTime = 0;
            this.sounds[soundType].play().catch(e => {
                console.log('Sound play failed:', e);
            });
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.elements.muteToggle.textContent = this.isMuted ? '🔇' : '🔊';
        this.elements.muteToggle.classList.toggle('muted', this.isMuted);
        this.elements.muteToggle.title = this.isMuted ? 'Unmute' : 'Mute';
        this.saveSettings();
    }
    
    unmuteSounds() {
        if (this.isMuted) {
            this.isMuted = false;
            this.elements.muteToggle.textContent = '🔊';
            this.elements.muteToggle.classList.remove('muted');
            this.elements.muteToggle.title = 'Mute';
            this.saveSettings();
        }
    }
    
    updateDisplay() {
        // Update timer display
        if (this.currentMode === 'idle') {
            this.elements.timer.textContent = this.formatTime(this.lectureTime * 60);
        } else {
            if (this.isOvertime) {
                this.elements.timer.textContent = '+' + this.formatTime(Math.abs(this.timeRemaining));
            } else {
                this.elements.timer.textContent = this.formatTime(this.timeRemaining);
            }
        }
        
        // Update progress bar
        if (this.currentMode !== 'idle') {
            let totalTime;
            if (this.currentMode === 'lecture') {
                totalTime = this.lectureTime * 60;
            } else {
                const breakTime = this.selectedBreakType === 1 ? this.break1Time : this.break2Time;
                totalTime = breakTime * 60;
            }
            
            let progress;
            if (this.isOvertime) {
                progress = 100;
            } else {
                progress = ((totalTime - this.timeRemaining) / totalTime) * 100;
            }
            
            this.elements.progressFill.style.width = progress + '%';
        } else {
            this.elements.progressFill.style.width = '0%';
        }
    }
    
    updateCurrentTime() {
        // This method is kept for compatibility but functionality moved to updateHeaderTime
    }
    
    updateHeaderTime() {
        const now = new Date();
        this.elements.currentTimeHeader.textContent = now.toLocaleTimeString('ja-JP');
    }
    
    updateEndTime() {
        if (this.currentMode !== 'idle') {
            let endTime;
            if (this.customEndTime) {
                endTime = this.customEndTime;
            } else if (this.timeRemaining > 0) {
                endTime = new Date(Date.now() + this.timeRemaining * 1000);
            } else {
                endTime = new Date();
            }
            this.elements.endTime.textContent = endTime.toLocaleTimeString('ja-JP');
        } else {
            this.elements.endTime.textContent = '--:--:--';
        }
    }
    
    adjustEndTime(minutes) {
        if (this.currentMode === 'idle') return;
        
        const currentEndTime = this.customEndTime || new Date(Date.now() + this.timeRemaining * 1000);
        const newEndTime = new Date(currentEndTime.getTime() + minutes * 60 * 1000);
        
        // Set seconds to 0
        newEndTime.setSeconds(0, 0);
        
        // Don't allow setting end time in the past
        if (newEndTime <= new Date()) return;
        
        this.customEndTime = newEndTime;
        this.recalculateTimeRemaining();
        this.updateEndTime();
    }
    
    recalculateTimeRemaining() {
        if (this.customEndTime) {
            const now = new Date();
            this.timeRemaining = Math.floor((this.customEndTime - now) / 1000);
            
            // For lectures, allow overtime (negative values)
            // For breaks, complete when time runs out
            if (this.timeRemaining <= 0 && this.currentMode === 'break') {
                this.timerComplete();
            }
        }
    }
    
    showTimeAdjustControls() {
        this.elements.timeAdjustControls.style.display = 'inline-flex';
    }
    
    hideTimeAdjustControls() {
        this.elements.timeAdjustControls.style.display = 'none';
    }
    
    updateButtonStates() {
        const isLectureRunning = this.currentMode === 'lecture';
        const isBreakRunning = this.currentMode === 'break';
        const isIdle = this.currentMode === 'idle';
        
        this.elements.startLectureBtn.style.display = isIdle ? 'inline-block' : 'none';
        this.elements.startLectureBreakBtn.style.display = isBreakRunning ? 'inline-block' : 'none';
        this.elements.startBreak1Btn.style.display = isBreakRunning ? 'none' : 'inline-block';
        this.elements.startBreak2Btn.style.display = isBreakRunning ? 'none' : 'inline-block';
        this.elements.stopTimerBtn.style.display = (isLectureRunning || isBreakRunning) ? 'inline-block' : 'none';
    }
    
    formatTime(seconds) {
        const absSeconds = Math.abs(seconds);
        const mins = Math.floor(absSeconds / 60);
        const secs = absSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    toggleTheme() {
        const currentTheme = document.body.dataset.theme || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.dataset.theme = newTheme === 'dark' ? 'dark' : '';
        this.elements.themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        
        localStorage.setItem('timerTheme', newTheme);
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
    
    openSettings() {
        this.elements.settingsModal.classList.add('show');
    }
    
    closeSettings() {
        this.elements.settingsModal.classList.remove('show');
    }
    
    updateSoundVolumes() {
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume;
        });
    }
    
    saveSettings() {
        const settings = {
            volume: this.volume,
            lectureTime: this.lectureTime,
            break1Time: this.break1Time,
            break2Time: this.break2Time,
            selectedBreakType: this.selectedBreakType,
            warningTime: this.warningTime,
            tickInterval: this.tickInterval,
            sound1Src: this.sounds.sound1.src,
            sound2Src: this.sounds.sound2.src,
            sound3Src: this.sounds.sound3.src,
            isMuted: this.isMuted
        };
        localStorage.setItem('timerSettings', JSON.stringify(settings));
    }
    
    handleKeyboard(e) {
        if (e.target.tagName === 'INPUT') return;
        
        switch (e.key) {
            case 'l':
            case 'L':
                if (this.currentMode === 'idle') this.startLecture();
                break;
            case 'b':
            case 'B':
                if (this.currentMode !== 'break') this.startBreak(1);
                break;
            case 'f':
            case 'F':
                this.toggleFullscreen();
                break;
            case 's':
            case 'S':
            case 'Escape':
                if (this.currentMode !== 'idle') this.stopTimer();
                break;
            case 't':
            case 'T':
                this.toggleTheme();
                break;
            case 'ArrowUp':
                e.preventDefault();
                // Arrow keys no longer used for time adjustment
                break;
            case 'ArrowDown':
                e.preventDefault();
                // Arrow keys no longer used for time adjustment
                break;
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.timerApp = new TimerApp();
});

// Handle visibility change to update time when tab becomes active
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.timerApp) {
        window.timerApp.updateCurrentTime();
        window.timerApp.updateHeaderTime();
        if (window.timerApp.currentMode !== 'idle') {
            window.timerApp.updateEndTime();
        }
    }
});
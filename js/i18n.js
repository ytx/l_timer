class I18nManager {
    constructor() {
        this.currentLanguage = 'ja';
        this.translations = {
            ja: {
                // Modal header
                'modal-settings-title': '設定',

                // Tab labels
                'tab-time': '時間',
                'tab-sound': '言語・サウンド',
                'tab-data': '設定管理',
                'tab-license': 'ライセンス',

                // Time settings
                'label-lecture-time': '講義時間 (分):',
                'label-break-time': '休憩時間 (分):',
                'label-lunch-time': '昼休憩時間 (分):',
                'label-warning-time': '警告タイミング (分前):',
                'label-tick-interval': '経過通知間隔 (秒):',

                // Sound settings
                'label-language': '言語:',
                'label-warning-sound': '警告音:',
                'label-end-sound': '終了音:',
                'label-tick-sound': '経過通知音:',
                'label-volume': '音量:',
                'btn-test': 'テスト',

                // Sound options
                'sound-warning-1': '予鈴音1',
                'sound-warning-2': '予鈴音2',
                'sound-warning-3': '予鈴音3',
                'sound-end-1': '終了音1',
                'sound-end-2': '終了音2',
                'sound-end-3': '終了音3',
                'sound-tick-1': '経過通知音1',
                'sound-tick-2': '経過通知音2',
                'sound-tick-3': '経過通知音3',

                // Data management
                'label-data-export-import': 'データのエクスポート / インポート:',
                'button-export': 'エクスポート',
                'button-import': 'インポート',
                'button-select-all': 'すべて選択',

                // License
                'heading-license': '使用しているライブラリ等のライセンス表示',

                // Tooltips
                'tooltip-settings': '設定',
                'tooltip-editor': 'エディタの表示/非表示',
                'tooltip-mute': 'ミュート/ミュート解除',
                'tooltip-theme': 'テーマ切り替え',
                'tooltip-fullscreen': '全画面表示',
                'tooltip-start-lecture-break': '講義開始',
                'tooltip-start-break1': '休憩開始（10分）',
                'tooltip-start-break2': '休憩開始（60分）',
                'tooltip-stop': '停止'
            },
            en: {
                // Modal header
                'modal-settings-title': 'Settings',

                // Tab labels
                'tab-time': 'Time',
                'tab-sound': 'Language & Sound',
                'tab-data': 'Data',
                'tab-license': 'License',

                // Time settings
                'label-lecture-time': 'Lecture Time (min):',
                'label-break-time': 'Break Time (min):',
                'label-lunch-time': 'Lunch Break (min):',
                'label-warning-time': 'Warning (min before):',
                'label-tick-interval': 'Overtime Interval (sec):',

                // Sound settings
                'label-language': 'Language:',
                'label-warning-sound': 'Warning Sound:',
                'label-end-sound': 'End Sound:',
                'label-tick-sound': 'Overtime Sound:',
                'label-volume': 'Volume:',
                'btn-test': 'Test',

                // Sound options
                'sound-warning-1': 'Warning 1',
                'sound-warning-2': 'Warning 2',
                'sound-warning-3': 'Warning 3',
                'sound-end-1': 'End 1',
                'sound-end-2': 'End 2',
                'sound-end-3': 'End 3',
                'sound-tick-1': 'Overtime 1',
                'sound-tick-2': 'Overtime 2',
                'sound-tick-3': 'Overtime 3',

                // Data management
                'label-data-export-import': 'Export / Import:',
                'button-export': 'Export',
                'button-import': 'Import',
                'button-select-all': 'Select All',

                // License
                'heading-license': 'Library Licenses',

                // Tooltips
                'tooltip-settings': 'Settings',
                'tooltip-editor': 'Toggle Editor',
                'tooltip-mute': 'Mute/Unmute',
                'tooltip-theme': 'Toggle Theme',
                'tooltip-fullscreen': 'Fullscreen',
                'tooltip-start-lecture-break': 'Start Lecture',
                'tooltip-start-break1': 'Start Break (10min)',
                'tooltip-start-break2': 'Start Break (60min)',
                'tooltip-stop': 'Stop'
            }
        };

        this.initialize();
    }

    initialize() {
        this.loadLanguage();
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }

    loadLanguage() {
        try {
            const saved = localStorage.getItem('appLanguage');
            if (saved && (saved === 'ja' || saved === 'en')) {
                this.currentLanguage = saved;
            }
        } catch (error) {
            console.error('Failed to load language preference:', error);
        }
    }

    saveLanguage() {
        try {
            localStorage.setItem('appLanguage', this.currentLanguage);
        } catch (error) {
            console.error('Failed to save language preference:', error);
        }
    }

    setLanguage(lang) {
        if (lang === 'ja' || lang === 'en') {
            this.currentLanguage = lang;
            this.saveLanguage();
            this.updateUI();
        }
    }

    updateUI() {
        // Update language selector
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
        }

        // Update all elements with data-i18n attributes
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translations[this.currentLanguage][key];

            if (translation) {
                // For buttons, labels, headings, and tabs, update textContent
                if (element.tagName === 'BUTTON' || element.tagName === 'LABEL' ||
                    element.tagName === 'H2' || element.tagName === 'H3' ||
                    element.classList.contains('tab-btn')) {
                    element.textContent = translation;
                }
                // For option elements, update textContent
                else if (element.tagName === 'OPTION') {
                    element.textContent = translation;
                }
            }
        });

        // Update tooltips (title attributes)
        const settingsBtn = document.getElementById('settings-btn');
        const editorToggle = document.getElementById('editor-toggle');
        const muteToggle = document.getElementById('mute-toggle');
        const themeToggle = document.getElementById('theme-toggle');
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        const startLectureBreak = document.getElementById('start-lecture-break');
        const startBreak1 = document.getElementById('start-break1');
        const startBreak2 = document.getElementById('start-break2');
        const stopTimer = document.getElementById('stop-timer');

        if (settingsBtn) settingsBtn.title = this.t('tooltip-settings');
        if (editorToggle) editorToggle.title = this.t('tooltip-editor');
        if (muteToggle) muteToggle.title = this.t('tooltip-mute');
        if (themeToggle) themeToggle.title = this.t('tooltip-theme');
        if (fullscreenBtn) fullscreenBtn.title = this.t('tooltip-fullscreen');
        if (startLectureBreak) startLectureBreak.title = this.t('tooltip-start-lecture-break');
        if (startBreak1) startBreak1.title = this.t('tooltip-start-break1');
        if (startBreak2) startBreak2.title = this.t('tooltip-start-break2');
        if (stopTimer) stopTimer.title = this.t('tooltip-stop');
    }

    t(key) {
        return this.translations[this.currentLanguage][key] || key;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.i18n = new I18nManager();
});

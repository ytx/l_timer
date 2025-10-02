class DataManager {
    constructor() {
        this.elements = {
            dataTextarea: document.getElementById('data-textarea'),
            exportBtn: document.getElementById('export-data-btn'),
            importBtn: document.getElementById('import-data-btn'),
            selectAllBtn: document.getElementById('select-all-btn'),
            clearStorageBtn: document.getElementById('clear-storage-btn'),
            tabBtns: document.querySelectorAll('.tab-btn')
        };

        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.setupTabSwitching();
    }

    setupEventListeners() {
        // Select All button
        this.elements.selectAllBtn.addEventListener('click', () => {
            this.selectAllText();
        });

        // Export button
        this.elements.exportBtn.addEventListener('click', () => {
            this.exportData();
        });

        // Import button
        this.elements.importBtn.addEventListener('click', () => {
            this.importData();
        });

        // Clear Storage button
        this.elements.clearStorageBtn.addEventListener('click', () => {
            this.clearStorage();
        });
    }

    selectAllText() {
        this.elements.dataTextarea.select();
        this.elements.dataTextarea.focus();
    }

    setupTabSwitching() {
        this.elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                this.switchTab(targetTab);
            });
        });
    }

    switchTab(tabId) {
        // Remove active class from all tabs and contents
        this.elements.tabBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Add active class to selected tab and content
        const selectedBtn = document.querySelector(`[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(tabId);

        if (selectedBtn && selectedContent) {
            selectedBtn.classList.add('active');
            selectedContent.classList.add('active');
        }
    }

    exportData() {
        try {
            // Collect all data
            const exportData = {
                version: "1.0",
                exportDate: new Date().toISOString(),
                settings: {
                    timerSettings: this.getLocalStorageItem('timerSettings'),
                    editorSettings: this.getLocalStorageItem('editorSettings'),
                    layoutLeftWidth: this.getLocalStorageItem('layoutLeftWidth'),
                    timerTheme: this.getLocalStorageItem('timerTheme')
                },
                documents: this.getLocalStorageItem('editorDocuments')
            };

            // Convert to pretty JSON
            const jsonString = JSON.stringify(exportData, null, 2);

            // Display in textarea
            this.elements.dataTextarea.value = jsonString;
        } catch (error) {
            console.error('Export failed:', error);
            this.showMessage('Export failed: ' + error.message, 'error');
        }
    }

    importData() {
        try {
            // Get JSON from textarea
            const jsonString = this.elements.dataTextarea.value.trim();

            if (!jsonString) {
                this.showMessage('Please paste JSON data to import.', 'error');
                return;
            }

            // Parse JSON
            const importData = JSON.parse(jsonString);

            // Validate structure
            if (!this.validateImportData(importData)) {
                throw new Error('Invalid data format');
            }

            // Confirm before importing
            if (!confirm('This will replace all current settings and documents. Continue?')) {
                return;
            }

            // Import data
            if (importData.settings) {
                if (importData.settings.timerSettings) {
                    localStorage.setItem('timerSettings', JSON.stringify(importData.settings.timerSettings));
                }
                if (importData.settings.editorSettings) {
                    localStorage.setItem('editorSettings', JSON.stringify(importData.settings.editorSettings));
                }
                if (importData.settings.layoutLeftWidth) {
                    localStorage.setItem('layoutLeftWidth', importData.settings.layoutLeftWidth);
                }
                if (importData.settings.timerTheme) {
                    localStorage.setItem('timerTheme', importData.settings.timerTheme);
                }
            }

            if (importData.documents) {
                localStorage.setItem('editorDocuments', JSON.stringify(importData.documents));
            }

            this.showMessage('Data imported successfully! Reloading page...', 'success');

            // Reload page after 2 seconds
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error('Import failed:', error);
            this.showMessage('Import failed: ' + error.message, 'error');
        }
    }

    validateImportData(data) {
        // Basic validation
        if (!data || typeof data !== 'object') {
            return false;
        }

        if (!data.version) {
            return false;
        }

        // Check if it has at least settings or documents
        if (!data.settings && !data.documents) {
            return false;
        }

        return true;
    }

    getLocalStorageItem(key) {
        try {
            const item = localStorage.getItem(key);
            if (item) {
                // Try to parse as JSON
                try {
                    return JSON.parse(item);
                } catch {
                    // Return as string if not JSON
                    return item;
                }
            }
            return null;
        } catch (error) {
            console.error(`Failed to get ${key}:`, error);
            return null;
        }
    }

    clearStorage() {
        const i18n = window.i18n;
        const confirmMessage = i18n ? i18n.t('confirm-clear-storage') : 'すべての設定とドキュメントが削除されます。本当に実行しますか？';
        const successMessage = i18n ? i18n.t('clear-storage-success') : 'すべてのデータを消去しました。ページをリロードします。';

        if (!confirm(confirmMessage)) {
            return;
        }

        try {
            // Clear all localStorage
            localStorage.clear();

            alert(successMessage);

            // Reload page after 1 second
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Failed to clear storage:', error);
            this.showMessage('Failed to clear storage: ' + error.message, 'error');
        }
    }

    showMessage(message, type = 'info') {
        // Simple alert for now
        // Could be enhanced with a toast notification
        if (type === 'error') {
            alert('Error: ' + message);
        } else {
            alert(message);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dataManager = new DataManager();
});

class EditorManager {
    constructor() {
        this.quill = null;
        this.documentManager = null;
        this.isVisible = false;
        this.zoomLevel = 100;
        this.zoomLevels = [50, 75, 100, 125, 150, 200];
        this.currentZoomIndex = 2; // 100%
        this.autoSaveTimer = null;
        this.isInitialized = false;

        this.elements = {
            editorToggle: document.getElementById('editor-toggle'),
            editorArea: document.getElementById('editor-area'),
            editorContainer: document.getElementById('editor'),
            appContainer: document.querySelector('.app-container'),
            zoomIn: document.getElementById('zoom-in'),
            zoomOut: document.getElementById('zoom-out'),
            zoomLevel: document.getElementById('zoom-level'),
            editorIconShow: document.getElementById('editor-icon-show'),
            editorIconHide: document.getElementById('editor-icon-hide')
        };

        this.initializeEventListeners();
        this.loadSettings();
    }

    initializeEventListeners() {
        // Toggle editor visibility
        this.elements.editorToggle.addEventListener('click', () => this.toggleVisibility());

        // Zoom controls
        this.elements.zoomIn.addEventListener('click', () => this.zoomIn());
        this.elements.zoomOut.addEventListener('click', () => this.zoomOut());
    }

    async initialize() {
        if (this.isInitialized || !window.Quill) {
            return;
        }

        try {
            // Initialize Quill editor
            this.quill = new Quill(this.elements.editorContainer, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'font': [] }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        ['bold', 'italic', 'underline'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['clean']
                    ]
                },
                placeholder: 'Enter your notes here...'
            });

            // Initialize DocumentManager
            if (window.DocumentManager) {
                this.documentManager = new window.DocumentManager(this.quill);
                // DocumentManager will load its own saved documents
                // and restore the current document
            } else {
                // Fallback to old content loading
                this.loadContent();

                // Setup auto-save
                this.quill.on('text-change', () => {
                    this.scheduleAutoSave();
                });
            }

            // Apply saved zoom level
            this.updateZoom();

            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize Quill editor:', error);
        }
    }

    async toggleVisibility() {
        this.isVisible = !this.isVisible;

        if (this.isVisible) {
            // Show editor
            this.elements.editorArea.style.display = 'block';
            this.elements.appContainer.classList.add('editor-visible');
            this.elements.editorIconShow.style.display = 'none';
            this.elements.editorIconHide.style.display = 'block';

            // Show resizer
            if (window.resizerManager) {
                window.resizerManager.show();
            }

            // Lazy load Quill on first show
            if (!this.isInitialized) {
                await this.initialize();
            }
        } else {
            // Hide editor
            this.elements.editorArea.style.display = 'none';
            this.elements.appContainer.classList.remove('editor-visible');
            this.elements.editorIconShow.style.display = 'block';
            this.elements.editorIconHide.style.display = 'none';

            // Hide resizer
            if (window.resizerManager) {
                window.resizerManager.hide();
            }
        }

        this.saveSettings();
    }

    zoomIn() {
        if (this.currentZoomIndex < this.zoomLevels.length - 1) {
            this.currentZoomIndex++;
            this.updateZoom();
        }
    }

    zoomOut() {
        if (this.currentZoomIndex > 0) {
            this.currentZoomIndex--;
            this.updateZoom();
        }
    }

    updateZoom() {
        this.zoomLevel = this.zoomLevels[this.currentZoomIndex];
        this.elements.zoomLevel.textContent = this.zoomLevel + '%';

        // Apply zoom to editor content only (not the whole container)
        const scale = this.zoomLevel / 100;
        const qlEditor = this.elements.editorContainer.querySelector('.ql-editor');
        if (qlEditor) {
            qlEditor.style.transform = `scale(${scale})`;
            // Adjust width to compensate for scaling so text wraps correctly
            qlEditor.style.width = `${100 / scale}%`;
        }

        this.saveSettings();
    }

    scheduleAutoSave() {
        // Only use auto-save if DocumentManager is not available
        if (this.documentManager) return;

        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
        }

        this.autoSaveTimer = setTimeout(() => {
            this.saveContent();
        }, 500); // 500ms debounce
    }

    saveContent() {
        if (!this.quill || this.documentManager) return;

        try {
            const delta = this.quill.getContents();
            const html = this.quill.root.innerHTML;

            const content = {
                delta: delta,
                html: html,
                lastModified: new Date().toISOString()
            };

            localStorage.setItem('editorContent', JSON.stringify(content));
        } catch (error) {
            console.error('Failed to save editor content:', error);
        }
    }

    loadContent() {
        if (!this.quill) return;

        try {
            const saved = localStorage.getItem('editorContent');
            if (saved) {
                const content = JSON.parse(saved);
                if (content.delta) {
                    this.quill.setContents(content.delta);
                }
            }
        } catch (error) {
            console.error('Failed to load editor content:', error);
        }
    }

    saveSettings() {
        try {
            const settings = {
                isVisible: this.isVisible,
                zoomLevel: this.zoomLevel,
                currentZoomIndex: this.currentZoomIndex
            };

            localStorage.setItem('editorSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Failed to save editor settings:', error);
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('editorSettings');
            if (saved) {
                const settings = JSON.parse(saved);

                // Restore zoom level
                if (settings.currentZoomIndex !== undefined) {
                    this.currentZoomIndex = settings.currentZoomIndex;
                    this.zoomLevel = this.zoomLevels[this.currentZoomIndex];
                    this.elements.zoomLevel.textContent = this.zoomLevel + '%';
                }

                // Restore visibility (but don't initialize Quill yet)
                if (settings.isVisible) {
                    this.isVisible = true;
                    this.elements.editorArea.style.display = 'block';
                    this.elements.appContainer.classList.add('editor-visible');
                    this.elements.editorIconShow.style.display = 'none';
                    this.elements.editorIconHide.style.display = 'block';

                    // Show resizer
                    if (window.resizerManager) {
                        window.resizerManager.show();
                    }

                    // Initialize Quill after a short delay to improve load time
                    setTimeout(() => this.initialize(), 100);
                }
            }
        } catch (error) {
            console.error('Failed to load editor settings:', error);
        }
    }
}

// Initialize editor manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.editorManager = new EditorManager();
});

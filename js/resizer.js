class ResizerManager {
    constructor() {
        this.isResizing = false;
        this.startX = 0;
        this.startLeftWidth = 50; // %
        this.minWidth = 30;  // 最小30%
        this.maxWidth = 70;  // 最大70%

        this.elements = {
            resizer: document.getElementById('resizer'),
            appContainer: document.querySelector('.app-container')
        };

        this.initializeResizer();
        this.loadLayout();
    }

    initializeResizer() {
        // Mouse events for resizing
        this.elements.resizer.addEventListener('mousedown', (e) => {
            this.startResize(e);
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isResizing) {
                this.resize(e);
            }
        });

        document.addEventListener('mouseup', () => {
            this.stopResize();
        });

        // Double-click to reset to 50-50
        this.elements.resizer.addEventListener('dblclick', () => {
            this.resetToDefault();
        });

        // Prevent text selection during resize
        this.elements.resizer.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });
    }

    startResize(e) {
        e.preventDefault();
        this.isResizing = true;
        this.startX = e.clientX;

        // Get current left width
        const currentLeftWidth = this.elements.appContainer.style.getPropertyValue('--left-width');
        if (currentLeftWidth) {
            this.startLeftWidth = parseFloat(currentLeftWidth);
        }

        // Visual feedback
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        this.elements.resizer.classList.add('resizing');
    }

    resize(e) {
        if (!this.isResizing) return;

        const containerWidth = this.elements.appContainer.offsetWidth;
        const resizerWidth = 8; // リサイザーの幅
        const availableWidth = containerWidth - resizerWidth;

        // Calculate new left width based on mouse position
        const mouseX = e.clientX;
        const containerRect = this.elements.appContainer.getBoundingClientRect();
        const relativeX = mouseX - containerRect.left;

        // Convert to percentage
        let newLeftWidth = (relativeX / containerWidth) * 100;

        // Apply constraints
        newLeftWidth = Math.max(this.minWidth, Math.min(this.maxWidth, newLeftWidth));

        // Update CSS variable
        this.elements.appContainer.style.setProperty('--left-width', `${newLeftWidth}%`);
        this.startLeftWidth = newLeftWidth;
    }

    stopResize() {
        if (!this.isResizing) return;

        this.isResizing = false;

        // Reset cursor and selection
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        this.elements.resizer.classList.remove('resizing');

        // Save layout
        this.saveLayout();
    }

    resetToDefault() {
        this.startLeftWidth = 50;
        this.elements.appContainer.style.setProperty('--left-width', '50%');
        this.saveLayout();
    }

    saveLayout() {
        try {
            localStorage.setItem('layoutLeftWidth', this.startLeftWidth.toString());
        } catch (error) {
            console.error('Failed to save layout:', error);
        }
    }

    loadLayout() {
        try {
            const saved = localStorage.getItem('layoutLeftWidth');
            if (saved) {
                this.startLeftWidth = parseFloat(saved);
                this.elements.appContainer.style.setProperty('--left-width', `${this.startLeftWidth}%`);
            }
        } catch (error) {
            console.error('Failed to load layout:', error);
        }
    }

    // Called when editor is toggled
    show() {
        this.elements.resizer.style.display = 'flex';
    }

    hide() {
        this.elements.resizer.style.display = 'none';
    }
}

// Initialize resizer manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.resizerManager = new ResizerManager();
});

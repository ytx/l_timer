class DocumentManager {
    constructor(quillInstance) {
        this.quill = quillInstance;
        this.documents = [];
        this.currentDocumentId = null;
        this.hasUnsavedChanges = false;

        this.elements = {
            documentSelect: document.getElementById('document-select'),
            saveBtn: document.getElementById('save-document'),
            deleteBtn: document.getElementById('delete-document')
        };

        this.initialize();
    }

    initialize() {
        this.loadDocuments();
        this.updateDropdown();
        this.restoreCurrentDocument(); // Restore the current document content
        this.setupEventListeners();
        this.updateUI();
        this.trackChanges();
    }

    setupEventListeners() {
        // Save button
        this.elements.saveBtn.addEventListener('click', () => {
            this.saveDocument();
        });

        // Delete button
        this.elements.deleteBtn.addEventListener('click', () => {
            if (this.currentDocumentId) {
                this.deleteDocument(this.currentDocumentId);
            }
        });

        // Document select
        this.elements.documentSelect.addEventListener('change', (e) => {
            const documentId = e.target.value;
            if (documentId) {
                this.loadDocument(documentId);
            } else {
                // New document
                this.createNewDocument();
            }
        });
    }

    loadDocuments() {
        try {
            const saved = localStorage.getItem('editorDocuments');
            if (saved) {
                const data = JSON.parse(saved);
                this.documents = data.documents || [];
                this.currentDocumentId = data.currentDocumentId || null;
            }
        } catch (error) {
            console.error('Failed to load documents:', error);
            this.documents = [];
        }
    }

    saveToLocalStorage() {
        try {
            const data = {
                documents: this.documents,
                currentDocumentId: this.currentDocumentId
            };
            localStorage.setItem('editorDocuments', JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save documents:', error);
            alert('Failed to save document. Storage may be full.');
        }
    }

    saveDocument(title = null) {
        if (!title) {
            title = this.promptForTitle();
            if (title === null) return; // User cancelled
        }

        const content = {
            delta: this.quill.getContents(),
            html: this.quill.root.innerHTML
        };

        const now = new Date().toISOString();

        if (this.currentDocumentId) {
            // Update existing document
            const doc = this.documents.find(d => d.id === this.currentDocumentId);
            if (doc) {
                doc.title = title;
                doc.content = content;
                doc.updatedAt = now;
            }
        } else {
            // Create new document
            const newDoc = {
                id: `doc_${Date.now()}`,
                title: title,
                content: content,
                createdAt: now,
                updatedAt: now
            };
            this.documents.push(newDoc);
            this.currentDocumentId = newDoc.id;
        }

        this.saveToLocalStorage();
        this.updateDropdown();
        this.updateUI();
        this.hasUnsavedChanges = false;

        // Visual feedback
        this.showSaveConfirmation();
    }

    promptForTitle() {
        const currentTitle = this.getCurrentTitle();
        let title = prompt('Document Title:', currentTitle);

        if (title === null) return null; // User cancelled

        if (!title || title.trim() === '') {
            title = this.extractTitleFromContent();
        }

        return title.trim();
    }

    getCurrentTitle() {
        if (this.currentDocumentId) {
            const doc = this.documents.find(d => d.id === this.currentDocumentId);
            return doc ? doc.title : '';
        }
        return '';
    }

    extractTitleFromContent() {
        const text = this.quill.getText();
        const lines = text.split('\n');

        for (let line of lines) {
            const trimmed = line.trim();
            if (trimmed.length > 0) {
                return trimmed.substring(0, 50);
            }
        }

        // No non-empty lines found
        const now = new Date();
        return `Untitled - ${now.toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    }

    loadDocument(documentId) {
        if (this.hasUnsavedChanges) {
            if (!confirm('Unsaved changes will be lost. Continue?')) {
                // Revert dropdown selection
                this.elements.documentSelect.value = this.currentDocumentId || '';
                return;
            }
        }

        const doc = this.documents.find(d => d.id === documentId);
        if (doc) {
            this.quill.setContents(doc.content.delta);
            this.currentDocumentId = documentId;
            this.hasUnsavedChanges = false;
            this.updateUI();
        }
    }

    createNewDocument() {
        if (this.hasUnsavedChanges) {
            if (!confirm('Unsaved changes will be lost. Continue?')) {
                // Revert dropdown selection
                this.elements.documentSelect.value = this.currentDocumentId || '';
                return;
            }
        }

        this.quill.setText('');
        this.currentDocumentId = null;
        this.hasUnsavedChanges = false;
        this.updateUI();
    }

    deleteDocument(documentId) {
        const doc = this.documents.find(d => d.id === documentId);
        if (!doc) return;

        if (!confirm(`Delete '${doc.title}'? This cannot be undone.`)) {
            return;
        }

        this.documents = this.documents.filter(d => d.id !== documentId);

        if (this.currentDocumentId === documentId) {
            this.currentDocumentId = null;
            this.quill.setText('');
            this.hasUnsavedChanges = false; // Reset flag after clearing
        }

        this.saveToLocalStorage();
        this.updateDropdown();
        this.updateUI();
    }

    updateDropdown() {
        const select = this.elements.documentSelect;
        const currentValue = select.value;

        // Clear and rebuild
        select.innerHTML = '<option value="">-- New Document --</option>';

        // Sort by most recently updated
        const sortedDocs = [...this.documents].sort((a, b) => {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        });

        sortedDocs.forEach(doc => {
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = doc.title;
            select.appendChild(option);
        });

        // Restore selection
        select.value = this.currentDocumentId || '';
    }

    updateUI() {
        // Update dropdown selection
        this.elements.documentSelect.value = this.currentDocumentId || '';

        // Update delete button state
        this.elements.deleteBtn.disabled = !this.currentDocumentId;
    }

    trackChanges() {
        this.quill.on('text-change', () => {
            this.hasUnsavedChanges = true;
        });
    }

    showSaveConfirmation() {
        const btn = this.elements.saveBtn;
        const originalHTML = btn.innerHTML;

        // Show checkmark
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        `;
        btn.style.backgroundColor = 'var(--success-color)';
        btn.style.borderColor = 'var(--success-color)';
        btn.style.color = 'white';

        // Reset after 2 seconds
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.backgroundColor = '';
            btn.style.borderColor = '';
            btn.style.color = '';
        }, 2000);
    }

    // Called when editor is initialized
    restoreCurrentDocument() {
        if (this.currentDocumentId) {
            const doc = this.documents.find(d => d.id === this.currentDocumentId);
            if (doc && this.quill) {
                this.quill.setContents(doc.content.delta);
                this.hasUnsavedChanges = false; // Mark as saved since we just loaded it
            }
        }
        this.updateDropdown();
        this.updateUI();
    }
}

// Will be initialized by EditorManager
window.DocumentManager = DocumentManager;

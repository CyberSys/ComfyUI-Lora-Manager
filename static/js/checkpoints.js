import { appCore } from './core.js';
import { confirmDelete, closeDeleteModal, confirmExclude, closeExcludeModal } from './utils/modalUtils.js';
import { createPageControls } from './components/controls/index.js';
import { loadMoreCheckpoints } from './api/checkpointApi.js';
import { CheckpointDownloadManager } from './managers/CheckpointDownloadManager.js';
import { CheckpointContextMenu } from './components/ContextMenu/index.js';
import { ModelDuplicatesManager } from './components/ModelDuplicatesManager.js';

// Initialize the Checkpoints page
class CheckpointsPageManager {
    constructor() {
        // Initialize page controls
        this.pageControls = createPageControls('checkpoints');
        
        // Initialize checkpoint download manager
        window.checkpointDownloadManager = new CheckpointDownloadManager();
        
        // Initialize the ModelDuplicatesManager
        this.duplicatesManager = new ModelDuplicatesManager(this, 'checkpoints');
        
        // Expose only necessary functions to global scope
        this._exposeRequiredGlobalFunctions();
    }
    
    _exposeRequiredGlobalFunctions() {
        // Minimal set of functions that need to remain global
        window.confirmDelete = confirmDelete;
        window.closeDeleteModal = closeDeleteModal;
        window.confirmExclude = confirmExclude;
        window.closeExcludeModal = closeExcludeModal;
        
        // Add loadCheckpoints function to window for FilterManager compatibility
        window.checkpointManager = {
            loadCheckpoints: (reset) => loadMoreCheckpoints(reset)
        };
        
        // Expose duplicates manager
        window.modelDuplicatesManager = this.duplicatesManager;
    }
    
    async initialize() {
        // Initialize page-specific components
        this.pageControls.restoreFolderFilter();
        this.pageControls.initFolderTagsVisibility();
        
        // Initialize context menu
        new CheckpointContextMenu();
        
        // Initialize common page features
        appCore.initializePageFeatures();
        
        console.log('Checkpoints Manager initialized');
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize core application
    await appCore.initialize();
    
    // Initialize checkpoints page
    const checkpointsPage = new CheckpointsPageManager();
    await checkpointsPage.initialize();
});

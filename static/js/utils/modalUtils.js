import { modalManager } from '../managers/ModalManager.js';
import { excludeLora, deleteModel as deleteLora } from '../api/loraApi.js';
import { excludeCheckpoint, deleteCheckpoint } from '../api/checkpointApi.js';

let pendingDeletePath = null;
let pendingModelType = null;
let pendingExcludePath = null;
let pendingExcludeModelType = null;

export function showDeleteModal(filePath, modelType = 'lora') {
    pendingDeletePath = filePath;
    pendingModelType = modelType;
    
    const card = document.querySelector(`.lora-card[data-filepath="${filePath}"]`);
    const modelName = card ? card.dataset.name : filePath.split('/').pop();
    const modal = modalManager.getModal('deleteModal').element;
    const modelInfo = modal.querySelector('.delete-model-info');
    
    modelInfo.innerHTML = `
        <strong>Model:</strong> ${modelName}
        <br>
        <strong>File:</strong> ${filePath}
    `;
    
    modalManager.showModal('deleteModal');
}

export async function confirmDelete() {
    if (!pendingDeletePath) return;
    
    try {
        // Use appropriate delete function based on model type
        if (pendingModelType === 'checkpoint') {
            await deleteCheckpoint(pendingDeletePath);
        } else {
            await deleteLora(pendingDeletePath);
        }
        
        closeDeleteModal();

        if (window.modelDuplicatesManager) {
            window.modelDuplicatesManager.updateDuplicatesBadgeAfterRefresh();
        }
    } catch (error) {
        console.error('Error deleting model:', error);
        alert(`Error deleting model: ${error}`);
    }
}

export function closeDeleteModal() {
    modalManager.closeModal('deleteModal');
    pendingDeletePath = null;
    pendingModelType = null;
}

// Functions for the exclude modal
export function showExcludeModal(filePath, modelType = 'lora') {
    pendingExcludePath = filePath;
    pendingExcludeModelType = modelType;
    
    const card = document.querySelector(`.lora-card[data-filepath="${filePath}"]`);
    const modelName = card ? card.dataset.name : filePath.split('/').pop();
    const modal = modalManager.getModal('excludeModal').element;
    const modelInfo = modal.querySelector('.exclude-model-info');
    
    modelInfo.innerHTML = `
        <strong>Model:</strong> ${modelName}
        <br>
        <strong>File:</strong> ${filePath}
    `;
    
    modalManager.showModal('excludeModal');
}

export function closeExcludeModal() {
    modalManager.closeModal('excludeModal');
    pendingExcludePath = null;
    pendingExcludeModelType = null;
}

export async function confirmExclude() {
    if (!pendingExcludePath) return;
    
    try {
        // Use appropriate exclude function based on model type
        if (pendingExcludeModelType === 'checkpoint') {
            await excludeCheckpoint(pendingExcludePath);
        } else {
            await excludeLora(pendingExcludePath);
        }
        
        closeExcludeModal();

        if (window.modelDuplicatesManager) {
            window.modelDuplicatesManager.updateDuplicatesBadgeAfterRefresh();
        }
    } catch (error) {
        console.error('Error excluding model:', error);
    }
}
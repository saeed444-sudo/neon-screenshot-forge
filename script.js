// Image state management
let imageState = {
    file: null,
    url: '',
    cornerRadius: 20,
    shadowIntensity: 50,
    backgroundBlur: 10,
    backgroundColor: '#1a1a2e',
    backgroundType: 'gradient'
};

// DOM elements
const preloader = document.getElementById('preloader');
const uploadSection = document.getElementById('upload-section');
const previewSection = document.getElementById('preview-section');
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const previewImage = document.getElementById('preview-image');
const previewWrapper = document.getElementById('preview-wrapper');
const cornerRadiusSlider = document.getElementById('corner-radius');
const cornerRadiusValue = document.getElementById('corner-radius-value');
const shadowIntensitySlider = document.getElementById('shadow-intensity');
const shadowIntensityValue = document.getElementById('shadow-intensity-value');
const backgroundBlurSlider = document.getElementById('background-blur');
const backgroundBlurValue = document.getElementById('background-blur-value');
const presetButtons = document.querySelectorAll('.preset-btn');
const resetBtn = document.getElementById('reset-btn');
const exportBtn = document.getElementById('export-btn');
const exportCanvas = document.getElementById('export-canvas');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Hide preloader after a short delay
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1000);

    // Set up event listeners
    setupEventListeners();
    
    // Initialize slider values
    updateSliderValues();
});

// Event listeners setup
function setupEventListeners() {
    // File input events
    fileInput.addEventListener('change', handleFileInput);
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // Slider events
    cornerRadiusSlider.addEventListener('input', updateCornerRadius);
    shadowIntensitySlider.addEventListener('input', updateShadowIntensity);
    backgroundBlurSlider.addEventListener('input', updateBackgroundBlur);
    
    // Preset buttons
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => setBackgroundPreset(btn.dataset.preset));
    });
    
    // Reset and export buttons
    resetBtn.addEventListener('click', resetSettings);
    exportBtn.addEventListener('click', exportImage);
}

// File handling
function handleFileInput(event) {
    const file = event.target.files[0];
    if (file) {
        handleFileSelect(file);
    }
}

function handleFileSelect(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select a valid image file', 'error');
        return;
    }

    // Update state
    imageState.file = file;
    imageState.url = URL.createObjectURL(file);
    
    // Update UI
    previewImage.src = imageState.url;
    previewImage.onload = () => {
        uploadSection.classList.add('hidden');
        previewSection.classList.remove('hidden');
        updatePreviewStyles();
    };
    
    showNotification('Image loaded successfully!', 'success');
}

// Drag and drop handlers
function handleDragOver(event) {
    event.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const file = event.dataTransfer.files[0];
    if (file) {
        handleFileSelect(file);
    }
}

// Style updates
function updateCornerRadius() {
    imageState.cornerRadius = parseInt(cornerRadiusSlider.value);
    cornerRadiusValue.textContent = imageState.cornerRadius;
    updatePreviewStyles();
}

function updateShadowIntensity() {
    imageState.shadowIntensity = parseInt(shadowIntensitySlider.value);
    shadowIntensityValue.textContent = imageState.shadowIntensity;
    updatePreviewStyles();
}

function updateBackgroundBlur() {
    imageState.backgroundBlur = parseInt(backgroundBlurSlider.value);
    backgroundBlurValue.textContent = imageState.backgroundBlur;
    updatePreviewStyles();
}

function updateSliderValues() {
    cornerRadiusValue.textContent = imageState.cornerRadius;
    shadowIntensityValue.textContent = imageState.shadowIntensity;
    backgroundBlurValue.textContent = imageState.backgroundBlur;
}

function setBackgroundPreset(preset) {
    imageState.backgroundType = preset;
    
    // Update active preset button
    presetButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.preset === preset);
    });
    
    updatePreviewStyles();
}

function updatePreviewStyles() {
    if (!previewImage.src) return;
    
    // Update image styles
    previewImage.style.borderRadius = `${imageState.cornerRadius}px`;
    
    // Update shadow based on intensity
    const shadowOpacity = imageState.shadowIntensity / 100;
    const shadowSize = Math.floor(imageState.shadowIntensity / 2);
    previewImage.style.boxShadow = `0 ${shadowSize}px ${shadowSize * 2}px rgba(0, 0, 0, ${shadowOpacity})`;
    
    // Update background based on type
    const container = previewWrapper.parentElement;
    container.style.filter = `blur(${imageState.backgroundBlur}px)`;
    
    switch (imageState.backgroundType) {
        case 'gradient':
            container.className = 'preview-container bg-gradient';
            break;
        case 'glass':
            container.className = 'preview-container bg-glass';
            break;
        case 'solid':
            container.className = 'preview-container bg-solid';
            break;
    }
    
    // Reset blur on the wrapper itself
    previewWrapper.style.filter = 'blur(0px)';
}

// Reset settings
function resetSettings() {
    imageState = {
        ...imageState,
        cornerRadius: 20,
        shadowIntensity: 50,
        backgroundBlur: 10,
        backgroundType: 'gradient'
    };
    
    // Reset sliders
    cornerRadiusSlider.value = imageState.cornerRadius;
    shadowIntensitySlider.value = imageState.shadowIntensity;
    backgroundBlurSlider.value = imageState.backgroundBlur;
    
    // Reset preset buttons
    presetButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.preset === 'gradient');
    });
    
    updateSliderValues();
    updatePreviewStyles();
    showNotification('Settings reset to default', 'info');
}

// Export functionality
async function exportImage() {
    if (!imageState.file) return;
    
    try {
        const canvas = exportCanvas;
        const ctx = canvas.getContext('2d');
        
        // Create image element
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            // Set canvas size with padding
            const padding = 100;
            canvas.width = img.width + padding * 2;
            canvas.height = img.height + padding * 2;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw background
            drawBackground(ctx, canvas.width, canvas.height);
            
            // Save context for image drawing
            ctx.save();
            
            // Apply corner radius to image
            const x = padding;
            const y = padding;
            const radius = imageState.cornerRadius;
            
            ctx.beginPath();
            ctx.roundRect(x, y, img.width, img.height, radius);
            ctx.clip();
            
            // Draw image
            ctx.drawImage(img, x, y);
            
            ctx.restore();
            
            // Apply shadow effect
            if (imageState.shadowIntensity > 0) {
                applyShadowEffect(ctx, x, y, img.width, img.height);
            }
            
            // Download the image
            const link = document.createElement('a');
            link.download = `beautified-${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
            
            showNotification('Image exported successfully!', 'success');
        };
        
        img.src = imageState.url;
    } catch (error) {
        console.error('Export failed:', error);
        showNotification('Export failed. Please try again.', 'error');
    }
}

function drawBackground(ctx, width, height) {
    switch (imageState.backgroundType) {
        case 'gradient':
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#6366f1');
            gradient.addColorStop(1, '#3b82f6');
            ctx.fillStyle = gradient;
            break;
        case 'glass':
            ctx.fillStyle = 'rgba(30, 30, 46, 0.8)';
            break;
        case 'solid':
            ctx.fillStyle = '#1a1a2e';
            break;
    }
    
    ctx.fillRect(0, 0, width, height);
    
    // Apply blur effect if needed
    if (imageState.backgroundBlur > 0) {
        ctx.filter = `blur(${imageState.backgroundBlur}px)`;
        ctx.fillRect(0, 0, width, height);
        ctx.filter = 'none';
    }
}

function applyShadowEffect(ctx, x, y, width, height) {
    const shadowOpacity = imageState.shadowIntensity / 100;
    const shadowSize = Math.floor(imageState.shadowIntensity / 2);
    
    ctx.shadowColor = `rgba(0, 0, 0, ${shadowOpacity})`;
    ctx.shadowBlur = shadowSize;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = shadowSize / 2;
    
    // Draw shadow rectangle
    ctx.fillStyle = 'transparent';
    ctx.fillRect(x, y, width, height);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        fontSize: '14px',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease-out'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            break;
        case 'info':
        default:
            notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
            break;
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add roundRect polyfill for older browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + width, y, x + width, y + height, radius);
        this.arcTo(x + width, y + height, x, y + height, radius);
        this.arcTo(x, y + height, x, y, radius);
        this.arcTo(x, y, x + width, y, radius);
        this.closePath();
    };
}
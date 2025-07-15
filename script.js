// Image state management
let imageState = {
    file: null,
    url: '',
    cornerRadius: 20,
    shadowIntensity: 50,
    backgroundBlur: 10,
    backgroundColor: '#1a1a2e',
    backgroundType: 'aurora',
    
    // Custom colors
    customColor1: '#6366f1',
    customColor2: '#3b82f6',
    gradientAngle: 135,
    
    // Image effects
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    
    // Transform
    rotation: 0,
    scale: 100,
    opacity: 100,
    
    // Advanced shadow
    shadowX: 0,
    shadowY: 25,
    shadowSpread: 50,
    shadowColor: '#000000',
    
    // Frame & border
    borderWidth: 0,
    borderColor: '#ffffff',
    frameStyle: 'none',
    
    // Export settings
    exportFormat: 'png',
    exportQuality: 0.9,
    exportScale: 2
};

// DOM elements
const preloader = document.getElementById('preloader');
const uploadSection = document.getElementById('upload-section');
const previewSection = document.getElementById('preview-section');
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const previewImage = document.getElementById('preview-image');
const previewWrapper = document.getElementById('preview-wrapper');

// Basic controls
const cornerRadiusSlider = document.getElementById('corner-radius');
const cornerRadiusValue = document.getElementById('corner-radius-value');
const shadowIntensitySlider = document.getElementById('shadow-intensity');
const shadowIntensityValue = document.getElementById('shadow-intensity-value');
const backgroundBlurSlider = document.getElementById('background-blur');
const backgroundBlurValue = document.getElementById('background-blur-value');
const presetButtons = document.querySelectorAll('.preset-btn');
const resetBtn = document.getElementById('reset-btn');

// Custom colors
const customColorsSection = document.getElementById('custom-colors');
const bgColor1 = document.getElementById('bg-color1');
const bgColor2 = document.getElementById('bg-color2');
const gradientAngle = document.getElementById('gradient-angle');
const gradientAngleValue = document.getElementById('gradient-angle-value');

// Image effects
const brightnessSlider = document.getElementById('brightness');
const brightnessValue = document.getElementById('brightness-value');
const contrastSlider = document.getElementById('contrast');
const contrastValue = document.getElementById('contrast-value');
const saturationSlider = document.getElementById('saturation');
const saturationValue = document.getElementById('saturation-value');
const blurSlider = document.getElementById('blur');
const blurValue = document.getElementById('blur-value');

// Transform controls
const rotationSlider = document.getElementById('rotation');
const rotationValue = document.getElementById('rotation-value');
const scaleSlider = document.getElementById('scale');
const scaleValue = document.getElementById('scale-value');
const opacitySlider = document.getElementById('opacity');
const opacityValue = document.getElementById('opacity-value');

// Advanced shadow
const shadowXSlider = document.getElementById('shadow-x');
const shadowXValue = document.getElementById('shadow-x-value');
const shadowYSlider = document.getElementById('shadow-y');
const shadowYValue = document.getElementById('shadow-y-value');
const shadowSpreadSlider = document.getElementById('shadow-spread');
const shadowSpreadValue = document.getElementById('shadow-spread-value');
const shadowColorInput = document.getElementById('shadow-color');

// Frame & border
const borderWidthSlider = document.getElementById('border-width');
const borderWidthValue = document.getElementById('border-width-value');
const borderColorInput = document.getElementById('border-color');
const framePresetButtons = document.querySelectorAll('.frame-preset-btn');

// Export controls
const exportFormatSelect = document.getElementById('export-format');
const exportQualitySlider = document.getElementById('export-quality');
const exportQualityValue = document.getElementById('export-quality-value');
const exportScaleSelect = document.getElementById('export-scale');
const exportBtn = document.getElementById('export-btn');
const copyBtn = document.getElementById('copy-btn');
const exportCanvas = document.getElementById('export-canvas');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Hide preloader after a short delay
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1000);

    // Set up event listeners
    setupEventListeners();
    
    // Initialize all values
    updateAllValues();
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
    
    // Basic controls
    cornerRadiusSlider.addEventListener('input', updateCornerRadius);
    shadowIntensitySlider.addEventListener('input', updateShadowIntensity);
    backgroundBlurSlider.addEventListener('input', updateBackgroundBlur);
    
    // Custom colors
    bgColor1.addEventListener('input', updateCustomColors);
    bgColor2.addEventListener('input', updateCustomColors);
    gradientAngle.addEventListener('input', updateGradientAngle);
    
    // Image effects
    brightnessSlider.addEventListener('input', updateBrightness);
    contrastSlider.addEventListener('input', updateContrast);
    saturationSlider.addEventListener('input', updateSaturation);
    blurSlider.addEventListener('input', updateBlur);
    
    // Transform controls
    rotationSlider.addEventListener('input', updateRotation);
    scaleSlider.addEventListener('input', updateScale);
    opacitySlider.addEventListener('input', updateOpacity);
    
    // Advanced shadow
    shadowXSlider.addEventListener('input', updateShadowX);
    shadowYSlider.addEventListener('input', updateShadowY);
    shadowSpreadSlider.addEventListener('input', updateShadowSpread);
    shadowColorInput.addEventListener('input', updateShadowColor);
    
    // Frame & border
    borderWidthSlider.addEventListener('input', updateBorderWidth);
    borderColorInput.addEventListener('input', updateBorderColor);
    framePresetButtons.forEach(btn => {
        btn.addEventListener('click', () => setFramePreset(btn.dataset.frame));
    });
    
    // Export controls
    exportFormatSelect.addEventListener('change', updateExportFormat);
    exportQualitySlider.addEventListener('input', updateExportQuality);
    exportScaleSelect.addEventListener('change', updateExportScale);
    
    // Preset buttons
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => setBackgroundPreset(btn.dataset.preset));
    });
    
    // Action buttons
    resetBtn.addEventListener('click', resetSettings);
    exportBtn.addEventListener('click', exportImage);
    copyBtn.addEventListener('click', copyToClipboard);
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

// Custom colors
function updateCustomColors() {
    imageState.customColor1 = bgColor1.value;
    imageState.customColor2 = bgColor2.value;
    updatePreviewStyles();
}

function updateGradientAngle() {
    imageState.gradientAngle = parseInt(gradientAngle.value);
    gradientAngleValue.textContent = imageState.gradientAngle + '°';
    updatePreviewStyles();
}

// Image effects
function updateBrightness() {
    imageState.brightness = parseInt(brightnessSlider.value);
    brightnessValue.textContent = imageState.brightness + '%';
    updatePreviewStyles();
}

function updateContrast() {
    imageState.contrast = parseInt(contrastSlider.value);
    contrastValue.textContent = imageState.contrast + '%';
    updatePreviewStyles();
}

function updateSaturation() {
    imageState.saturation = parseInt(saturationSlider.value);
    saturationValue.textContent = imageState.saturation + '%';
    updatePreviewStyles();
}

function updateBlur() {
    imageState.blur = parseInt(blurSlider.value);
    blurValue.textContent = imageState.blur + 'px';
    updatePreviewStyles();
}

// Transform controls
function updateRotation() {
    imageState.rotation = parseInt(rotationSlider.value);
    rotationValue.textContent = imageState.rotation + '°';
    updatePreviewStyles();
}

function updateScale() {
    imageState.scale = parseInt(scaleSlider.value);
    scaleValue.textContent = imageState.scale + '%';
    updatePreviewStyles();
}

function updateOpacity() {
    imageState.opacity = parseInt(opacitySlider.value);
    opacityValue.textContent = imageState.opacity + '%';
    updatePreviewStyles();
}

// Advanced shadow
function updateShadowX() {
    imageState.shadowX = parseInt(shadowXSlider.value);
    shadowXValue.textContent = imageState.shadowX + 'px';
    updatePreviewStyles();
}

function updateShadowY() {
    imageState.shadowY = parseInt(shadowYSlider.value);
    shadowYValue.textContent = imageState.shadowY + 'px';
    updatePreviewStyles();
}

function updateShadowSpread() {
    imageState.shadowSpread = parseInt(shadowSpreadSlider.value);
    shadowSpreadValue.textContent = imageState.shadowSpread + 'px';
    updatePreviewStyles();
}

function updateShadowColor() {
    imageState.shadowColor = shadowColorInput.value;
    updatePreviewStyles();
}

// Frame & border
function updateBorderWidth() {
    imageState.borderWidth = parseInt(borderWidthSlider.value);
    borderWidthValue.textContent = imageState.borderWidth + 'px';
    updatePreviewStyles();
}

function updateBorderColor() {
    imageState.borderColor = borderColorInput.value;
    updatePreviewStyles();
}

function setFramePreset(frame) {
    imageState.frameStyle = frame;
    
    // Update active frame button
    framePresetButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.frame === frame);
    });
    
    // Apply frame presets
    switch(frame) {
        case 'modern':
            imageState.borderWidth = 2;
            imageState.borderColor = '#ffffff';
            break;
        case 'classic':
            imageState.borderWidth = 8;
            imageState.borderColor = '#f0f0f0';
            break;
        case 'neon':
            imageState.borderWidth = 3;
            imageState.borderColor = '#00ffff';
            break;
        case 'none':
        default:
            imageState.borderWidth = 0;
            break;
    }
    
    // Update UI
    borderWidthSlider.value = imageState.borderWidth;
    borderColorInput.value = imageState.borderColor;
    updateAllValues();
    updatePreviewStyles();
}

// Export controls
function updateExportFormat() {
    imageState.exportFormat = exportFormatSelect.value;
}

function updateExportQuality() {
    imageState.exportQuality = parseFloat(exportQualitySlider.value);
    exportQualityValue.textContent = Math.round(imageState.exportQuality * 100) + '%';
}

function updateExportScale() {
    imageState.exportScale = parseInt(exportScaleSelect.value);
}

function updateAllValues() {
    cornerRadiusValue.textContent = imageState.cornerRadius;
    shadowIntensityValue.textContent = imageState.shadowIntensity;
    backgroundBlurValue.textContent = imageState.backgroundBlur;
    gradientAngleValue.textContent = imageState.gradientAngle + '°';
    brightnessValue.textContent = imageState.brightness + '%';
    contrastValue.textContent = imageState.contrast + '%';
    saturationValue.textContent = imageState.saturation + '%';
    blurValue.textContent = imageState.blur + 'px';
    rotationValue.textContent = imageState.rotation + '°';
    scaleValue.textContent = imageState.scale + '%';
    opacityValue.textContent = imageState.opacity + '%';
    shadowXValue.textContent = imageState.shadowX + 'px';
    shadowYValue.textContent = imageState.shadowY + 'px';
    shadowSpreadValue.textContent = imageState.shadowSpread + 'px';
    borderWidthValue.textContent = imageState.borderWidth + 'px';
    exportQualityValue.textContent = Math.round(imageState.exportQuality * 100) + '%';
}

function setBackgroundPreset(preset) {
    imageState.backgroundType = preset;
    
    // Update active preset button
    presetButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.preset === preset);
    });
    
    // Show/hide custom colors section
    if (preset === 'custom') {
        customColorsSection.style.display = 'block';
    } else {
        customColorsSection.style.display = 'none';
    }
    
    updatePreviewStyles();
}

function updatePreviewStyles() {
    if (!previewImage.src) return;
    
    // Update image styles
    previewImage.style.borderRadius = `${imageState.cornerRadius}px`;
    
    // Update shadow (legacy and advanced)
    const shadowOpacity = imageState.shadowIntensity / 100;
    const shadowSize = Math.floor(imageState.shadowIntensity / 2);
    const advancedShadow = `${imageState.shadowX}px ${imageState.shadowY}px ${imageState.shadowSpread}px ${imageState.shadowColor}`;
    previewImage.style.boxShadow = imageState.shadowIntensity > 0 ? 
        `0 ${shadowSize}px ${shadowSize * 2}px rgba(0, 0, 0, ${shadowOpacity}), ${advancedShadow}` : 
        advancedShadow;
    
    // Update image effects
    const filters = [
        `brightness(${imageState.brightness}%)`,
        `contrast(${imageState.contrast}%)`,
        `saturate(${imageState.saturation}%)`,
        `blur(${imageState.blur}px)`
    ];
    previewImage.style.filter = filters.join(' ');
    
    // Update transform
    const transforms = [
        `rotate(${imageState.rotation}deg)`,
        `scale(${imageState.scale / 100})`
    ];
    previewImage.style.transform = transforms.join(' ');
    previewImage.style.opacity = imageState.opacity / 100;
    
    // Update border
    if (imageState.borderWidth > 0) {
        previewImage.style.border = `${imageState.borderWidth}px solid ${imageState.borderColor}`;
    } else {
        previewImage.style.border = 'none';
    }
    
    // Update background based on type
    const container = previewWrapper.parentElement;
    container.style.filter = `blur(${imageState.backgroundBlur}px)`;
    
    let backgroundClass = 'preview-container';
    switch (imageState.backgroundType) {
        case 'aurora':
            backgroundClass += ' bg-aurora';
            break;
        case 'sunset':
            backgroundClass += ' bg-sunset';
            break;
        case 'ocean':
            backgroundClass += ' bg-ocean';
            break;
        case 'forest':
            backgroundClass += ' bg-forest';
            break;
        case 'neon':
            backgroundClass += ' bg-neon';
            break;
        case 'glass':
            backgroundClass += ' bg-glass';
            break;
        case 'solid':
            backgroundClass += ' bg-solid';
            break;
        case 'custom':
            backgroundClass += ' bg-custom';
            container.style.background = `linear-gradient(${imageState.gradientAngle}deg, ${imageState.customColor1}, ${imageState.customColor2})`;
            break;
        case 'gradient':
        default:
            backgroundClass += ' bg-gradient';
            break;
    }
    
    container.className = backgroundClass;
    
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
        backgroundType: 'aurora',
        customColor1: '#6366f1',
        customColor2: '#3b82f6',
        gradientAngle: 135,
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        rotation: 0,
        scale: 100,
        opacity: 100,
        shadowX: 0,
        shadowY: 25,
        shadowSpread: 50,
        shadowColor: '#000000',
        borderWidth: 0,
        borderColor: '#ffffff',
        frameStyle: 'none'
    };
    
    // Reset all sliders
    cornerRadiusSlider.value = imageState.cornerRadius;
    shadowIntensitySlider.value = imageState.shadowIntensity;
    backgroundBlurSlider.value = imageState.backgroundBlur;
    bgColor1.value = imageState.customColor1;
    bgColor2.value = imageState.customColor2;
    gradientAngle.value = imageState.gradientAngle;
    brightnessSlider.value = imageState.brightness;
    contrastSlider.value = imageState.contrast;
    saturationSlider.value = imageState.saturation;
    blurSlider.value = imageState.blur;
    rotationSlider.value = imageState.rotation;
    scaleSlider.value = imageState.scale;
    opacitySlider.value = imageState.opacity;
    shadowXSlider.value = imageState.shadowX;
    shadowYSlider.value = imageState.shadowY;
    shadowSpreadSlider.value = imageState.shadowSpread;
    shadowColorInput.value = imageState.shadowColor;
    borderWidthSlider.value = imageState.borderWidth;
    borderColorInput.value = imageState.borderColor;
    
    // Reset preset buttons
    presetButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.preset === 'aurora');
    });
    
    framePresetButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.frame === 'none');
    });
    
    // Hide custom colors section
    customColorsSection.style.display = 'none';
    
    updateAllValues();
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
            // Set canvas size with padding and scale
            const scale = imageState.exportScale;
            const padding = 100 * scale;
            canvas.width = (img.width + padding * 2) * scale;
            canvas.height = (img.height + padding * 2) * scale;
            
            // Scale context for higher resolution
            ctx.scale(scale, scale);
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw background
            drawBackground(ctx, canvas.width / scale, canvas.height / scale);
            
            // Save context for image drawing
            ctx.save();
            
            // Apply corner radius to image
            const x = padding / scale;
            const y = padding / scale;
            const radius = imageState.cornerRadius;
            
            ctx.beginPath();
            ctx.roundRect(x, y, img.width, img.height, radius);
            ctx.clip();
            
            // Apply image effects
            const filters = [
                `brightness(${imageState.brightness}%)`,
                `contrast(${imageState.contrast}%)`,
                `saturate(${imageState.saturation}%)`,
                `blur(${imageState.blur}px)`
            ];
            ctx.filter = filters.join(' ');
            
            // Apply transform
            ctx.globalAlpha = imageState.opacity / 100;
            ctx.translate(x + img.width / 2, y + img.height / 2);
            ctx.rotate(imageState.rotation * Math.PI / 180);
            ctx.scale(imageState.scale / 100, imageState.scale / 100);
            
            // Draw image
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
            
            ctx.restore();
            
            // Apply border
            if (imageState.borderWidth > 0) {
                ctx.strokeStyle = imageState.borderColor;
                ctx.lineWidth = imageState.borderWidth;
                ctx.beginPath();
                ctx.roundRect(x, y, img.width, img.height, radius);
                ctx.stroke();
            }
            
            // Apply shadow effects
            if (imageState.shadowIntensity > 0 || imageState.shadowX !== 0 || imageState.shadowY !== 0 || imageState.shadowSpread !== 0) {
                applyShadowEffect(ctx, x, y, img.width, img.height);
            }
            
            // Download the image
            const link = document.createElement('a');
            const timestamp = Date.now();
            const extension = imageState.exportFormat;
            link.download = `beautified-${timestamp}.${extension}`;
            
            if (extension === 'png') {
                link.href = canvas.toDataURL('image/png');
            } else if (extension === 'jpg') {
                link.href = canvas.toDataURL('image/jpeg', imageState.exportQuality);
            } else if (extension === 'webp') {
                link.href = canvas.toDataURL('image/webp', imageState.exportQuality);
            }
            
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
    const angle = imageState.gradientAngle * Math.PI / 180;
    const x1 = width / 2 + Math.cos(angle) * width / 2;
    const y1 = height / 2 + Math.sin(angle) * height / 2;
    const x2 = width / 2 - Math.cos(angle) * width / 2;
    const y2 = height / 2 - Math.sin(angle) * height / 2;
    
    switch (imageState.backgroundType) {
        case 'aurora':
            const aurora = ctx.createLinearGradient(x1, y1, x2, y2);
            aurora.addColorStop(0, '#667eea');
            aurora.addColorStop(1, '#764ba2');
            ctx.fillStyle = aurora;
            break;
        case 'sunset':
            const sunset = ctx.createLinearGradient(x1, y1, x2, y2);
            sunset.addColorStop(0, '#ff6b6b');
            sunset.addColorStop(1, '#ffa500');
            ctx.fillStyle = sunset;
            break;
        case 'ocean':
            const ocean = ctx.createLinearGradient(x1, y1, x2, y2);
            ocean.addColorStop(0, '#00c9ff');
            ocean.addColorStop(1, '#92fe9d');
            ctx.fillStyle = ocean;
            break;
        case 'forest':
            const forest = ctx.createLinearGradient(x1, y1, x2, y2);
            forest.addColorStop(0, '#2d5016');
            forest.addColorStop(1, '#3a6b1c');
            ctx.fillStyle = forest;
            break;
        case 'neon':
            const neon = ctx.createLinearGradient(x1, y1, x2, y2);
            neon.addColorStop(0, '#ff00ff');
            neon.addColorStop(1, '#00ffff');
            ctx.fillStyle = neon;
            break;
        case 'custom':
            const custom = ctx.createLinearGradient(x1, y1, x2, y2);
            custom.addColorStop(0, imageState.customColor1);
            custom.addColorStop(1, imageState.customColor2);
            ctx.fillStyle = custom;
            break;
        case 'glass':
            ctx.fillStyle = 'rgba(30, 30, 46, 0.8)';
            break;
        case 'solid':
            ctx.fillStyle = '#1a1a2e';
            break;
        case 'gradient':
        default:
            const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0, '#6366f1');
            gradient.addColorStop(1, '#3b82f6');
            ctx.fillStyle = gradient;
            break;
    }
    
    ctx.fillRect(0, 0, width, height);
}

function applyShadowEffect(ctx, x, y, width, height) {
    // Legacy shadow from intensity
    const shadowOpacity = imageState.shadowIntensity / 100;
    const shadowSize = Math.floor(imageState.shadowIntensity / 2);
    
    if (shadowOpacity > 0) {
        ctx.shadowColor = `rgba(0, 0, 0, ${shadowOpacity})`;
        ctx.shadowBlur = shadowSize;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = shadowSize / 2;
    }
    
    // Advanced shadow
    if (imageState.shadowX !== 0 || imageState.shadowY !== 0 || imageState.shadowSpread !== 0) {
        ctx.shadowColor = imageState.shadowColor;
        ctx.shadowBlur = imageState.shadowSpread;
        ctx.shadowOffsetX = imageState.shadowX;
        ctx.shadowOffsetY = imageState.shadowY;
    }
    
    // Draw shadow rectangle
    ctx.fillStyle = 'transparent';
    ctx.fillRect(x, y, width, height);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}

// Copy to clipboard functionality
async function copyToClipboard() {
    if (!imageState.file) return;
    
    try {
        const canvas = exportCanvas;
        const ctx = canvas.getContext('2d');
        
        // Create image element
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = async () => {
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
            
            // Apply image effects
            const filters = [
                `brightness(${imageState.brightness}%)`,
                `contrast(${imageState.contrast}%)`,
                `saturate(${imageState.saturation}%)`,
                `blur(${imageState.blur}px)`
            ];
            ctx.filter = filters.join(' ');
            
            // Apply transform
            ctx.globalAlpha = imageState.opacity / 100;
            ctx.translate(x + img.width / 2, y + img.height / 2);
            ctx.rotate(imageState.rotation * Math.PI / 180);
            ctx.scale(imageState.scale / 100, imageState.scale / 100);
            
            // Draw image
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
            
            ctx.restore();
            
            // Apply border
            if (imageState.borderWidth > 0) {
                ctx.strokeStyle = imageState.borderColor;
                ctx.lineWidth = imageState.borderWidth;
                ctx.beginPath();
                ctx.roundRect(x, y, img.width, img.height, radius);
                ctx.stroke();
            }
            
            // Apply shadow effects
            if (imageState.shadowIntensity > 0 || imageState.shadowX !== 0 || imageState.shadowY !== 0 || imageState.shadowSpread !== 0) {
                applyShadowEffect(ctx, x, y, img.width, img.height);
            }
            
            // Convert to blob and copy to clipboard
            canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            'image/png': blob
                        })
                    ]);
                    showNotification('Image copied to clipboard!', 'success');
                } catch (err) {
                    console.error('Failed to copy to clipboard:', err);
                    showNotification('Failed to copy to clipboard', 'error');
                }
            }, 'image/png');
        };
        
        img.src = imageState.url;
    } catch (error) {
        console.error('Copy failed:', error);
        showNotification('Copy failed. Please try again.', 'error');
    }
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
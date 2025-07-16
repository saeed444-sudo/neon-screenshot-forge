import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Palette, Sliders, Move, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ImageState {
  file: File | null;
  url: string;
  cornerRadius: number;
  shadowIntensity: number;
  backgroundBlur: number;
  backgroundColor: string;
  backgroundType: 'solid' | 'gradient' | 'glass';
  customBackground: string;
}

const gradientPresets = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
];

const Preloader = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-primary/20 border-t-primary animate-rotate-glow"></div>
        <h2 className="text-2xl font-futuristic text-gradient-primary mb-2">Screenshot Beautifier</h2>
        <p className="text-muted-foreground">Initializing futuristic editor...</p>
      </div>
    </div>
  );
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageState, setImageState] = useState<ImageState>({
    file: null,
    url: '',
    cornerRadius: 12,
    shadowIntensity: 20,
    backgroundBlur: 10,
    backgroundColor: '#1a1a2e',
    backgroundType: 'gradient',
    customBackground: gradientPresets[0],
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Initialize app with loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 3D Tilt Effect
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePosition({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePosition({ x: 0, y: 0 });
  }, []);

  // File handling
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    const url = URL.createObjectURL(file);
    setImageState(prev => ({ ...prev, file, url }));
    
    toast({
      title: "Image uploaded!",
      description: "Your screenshot is ready for beautification.",
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Export functionality
  const handleExport = async () => {
    if (!imageState.file || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Create a new image element and load the file directly
      const img = new Image();
      
      // Create a promise to handle image loading
      const imageLoadPromise = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        
        // Load image from file directly instead of object URL
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            img.src = e.target.result as string;
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(imageState.file!);
      });

      await imageLoadPromise;

      // Set canvas to full screen dimensions (1920x1080 for HD)
      canvas.width = 1920;
      canvas.height = 1080;
      
      // Calculate image scaling to fit nicely within full screen
      const maxImageWidth = canvas.width * 0.8; // Use 80% of screen width
      const maxImageHeight = canvas.height * 0.8; // Use 80% of screen height
      
      const scaleX = maxImageWidth / img.width;
      const scaleY = maxImageHeight / img.height;
      const scale = Math.min(scaleX, scaleY);
      
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      
      // Center the image on the canvas
      const x = (canvas.width - scaledWidth) / 2;
      const y = (canvas.height - scaledHeight) / 2;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply background
      if (imageState.backgroundType === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        // Parse the gradient from customBackground
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = imageState.backgroundColor;
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = imageState.shadowIntensity;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = imageState.shadowIntensity / 2;

      // Draw rounded rectangle for image
      const imageX = x;
      const imageY = y;
      const radius = imageState.cornerRadius;
      
      ctx.beginPath();
      ctx.moveTo(imageX + radius, imageY);
      ctx.lineTo(imageX + scaledWidth - radius, imageY);
      ctx.quadraticCurveTo(imageX + scaledWidth, imageY, imageX + scaledWidth, imageY + radius);
      ctx.lineTo(imageX + scaledWidth, imageY + scaledHeight - radius);
      ctx.quadraticCurveTo(imageX + scaledWidth, imageY + scaledHeight, imageX + scaledWidth - radius, imageY + scaledHeight);
      ctx.lineTo(imageX + radius, imageY + scaledHeight);
      ctx.quadraticCurveTo(imageX, imageY + scaledHeight, imageX, imageY + scaledHeight - radius);
      ctx.lineTo(imageX, imageY + radius);
      ctx.quadraticCurveTo(imageX, imageY, imageX + radius, imageY);
      ctx.closePath();
      ctx.clip();

      // Draw image
      ctx.drawImage(img, imageX, imageY, scaledWidth, scaledHeight);

      // Download
      const link = document.createElement('a');
      link.download = 'beautified-screenshot.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
      toast({
        title: "Screenshot exported!",
        description: "Your beautified image has been downloaded in full HD.",
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export failed",
        description: "Failed to load image for export. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Preloader isLoading={isLoading} />
      
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-floating"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-secondary/10 rounded-full blur-xl animate-floating" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-floating" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header */}
        <header className="relative z-10 p-6 border-b border-border/50 glass-panel">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-futuristic text-gradient-primary">Screenshot Beautifier</h1>
              <p className="text-muted-foreground mt-1">Transform your screenshots into stunning visuals</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="glass-panel border-primary/50 hover:shadow-neon-sm">
                <Palette className="w-4 h-4 mr-2" />
                Themes
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div
              className={`glass-panel rounded-2xl p-8 border-2 transition-all duration-300 hover-3d ${
                isDragging ? 'border-primary glow-primary-lg' : 'border-border/50 hover:border-primary/50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`
              }}
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-6 animate-pulse-glow">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-futuristic text-gradient-secondary mb-2">Upload Screenshot</h3>
                <p className="text-muted-foreground mb-6">Drag & drop or click to select</p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-primary hover:opacity-90 text-white font-medium px-8 py-3 rounded-full"
                >
                  Choose File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>

            {/* Background Presets */}
            <Card className="glass-panel mt-6 p-6">
              <h4 className="font-futuristic text-sm text-gradient-primary mb-4">Background Presets</h4>
              <div className="grid grid-cols-3 gap-2">
                {gradientPresets.map((gradient, index) => (
                  <button
                    key={index}
                    className="w-full h-12 rounded-lg border-2 border-border/50 hover:border-primary/50 transition-colors"
                    style={{ background: gradient }}
                    onClick={() => setImageState(prev => ({ ...prev, customBackground: gradient }))}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <Card className="glass-panel p-6 h-full">
              <h3 className="font-futuristic text-lg text-gradient-secondary mb-4">Live Preview</h3>
              <div className="relative min-h-64 rounded-xl overflow-hidden border border-border/50">
                {imageState.url ? (
                  <div 
                    className="w-full h-full p-8 flex items-center justify-center"
                    style={{
                      background: imageState.backgroundType === 'gradient' 
                        ? imageState.customBackground 
                        : imageState.backgroundColor,
                      backdropFilter: `blur(${imageState.backgroundBlur}px)`
                    }}
                  >
                    <img
                      src={imageState.url}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain transition-all duration-300"
                      style={{
                        borderRadius: `${imageState.cornerRadius}px`,
                        boxShadow: `0 ${imageState.shadowIntensity}px ${imageState.shadowIntensity * 2}px rgba(0,0,0,0.3)`
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Move className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Upload an image to see preview</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Tools Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass-panel p-6">
              <h3 className="font-futuristic text-lg text-gradient-accent mb-4 flex items-center">
                <Sliders className="w-5 h-5 mr-2" />
                Styling Tools
              </h3>
              
              <div className="space-y-6">
                {/* Corner Radius */}
                <div>
                  <label className="block text-sm font-medium mb-2">Corner Radius</label>
                  <Slider
                    value={[imageState.cornerRadius]}
                    onValueChange={([value]) => setImageState(prev => ({ ...prev, cornerRadius: value }))}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground">{imageState.cornerRadius}px</span>
                </div>

                {/* Shadow Intensity */}
                <div>
                  <label className="block text-sm font-medium mb-2">Drop Shadow</label>
                  <Slider
                    value={[imageState.shadowIntensity]}
                    onValueChange={([value]) => setImageState(prev => ({ ...prev, shadowIntensity: value }))}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground">{imageState.shadowIntensity}px</span>
                </div>

                {/* Background Blur */}
                <div>
                  <label className="block text-sm font-medium mb-2">Background Blur</label>
                  <Slider
                    value={[imageState.backgroundBlur]}
                    onValueChange={([value]) => setImageState(prev => ({ ...prev, backgroundBlur: value }))}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-xs text-muted-foreground">{imageState.backgroundBlur}px</span>
                </div>

                {/* Background Type Toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Gradient Background</label>
                  <Switch
                    checked={imageState.backgroundType === 'gradient'}
                    onCheckedChange={(checked) => 
                      setImageState(prev => ({ 
                        ...prev, 
                        backgroundType: checked ? 'gradient' : 'solid' 
                      }))
                    }
                  />
                </div>
              </div>
            </Card>

            {/* Export Section */}
            <Card className="glass-panel p-6">
              <h3 className="font-futuristic text-lg text-gradient-primary mb-4 flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Export
              </h3>
              
              <div className="space-y-4">
                <Button
                  onClick={handleExport}
                  disabled={!imageState.url}
                  className="w-full bg-gradient-secondary hover:opacity-90 text-white font-medium py-3 rounded-full glow-primary transition-all duration-300"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Download PNG
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full glass-panel border-accent/50 hover:shadow-neon-sm"
                  onClick={() => setImageState({
                    file: null,
                    url: '',
                    cornerRadius: 12,
                    shadowIntensity: 20,
                    backgroundBlur: 10,
                    backgroundColor: '#1a1a2e',
                    backgroundType: 'gradient',
                    customBackground: gradientPresets[0],
                  })}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Hidden Canvas for Export */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </>
  );
};

export default Index;

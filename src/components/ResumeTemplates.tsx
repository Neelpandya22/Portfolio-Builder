import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Check, Sparkles, Eye, Download } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface ResumeTemplateProps {
  id: string;
  name: string;
  description: string;
  image: string;
  isPremium: boolean;
  colors: string[];
}

const templates: ResumeTemplateProps[] = [
  {
    id: 'classic',
    name: 'Classic Resume',
    description: 'Traditional layout perfect for most industries',
    image: '/lovable-uploads/12e34a3c-b6c0-4503-9e57-ea585d40f8c4.png',
    isPremium: false,
    colors: ['#799f49', '#c46d35', '#3399ff', '#a94056', '#17779e', '#129a82']
  },
  {
    id: 'modern',
    name: 'Modern Resume',
    description: 'Clean design with a touch of color',
    image: '/lovable-uploads/12e34a3c-b6c0-4503-9e57-ea585d40f8c4.png',
    isPremium: false,
    colors: ['#6E44A1', '#D3BEA1', '#D17537', '#479AE7', '#0F641C', '#B33122']
  },
  {
    id: 'minimal',
    name: 'Minimal Resume',
    description: 'Simple layout that highlights your experience',
    image: '/lovable-uploads/12e34a3c-b6c0-4503-9e57-ea585d40f8c4.png',
    isPremium: false,
    colors: ['#629E44', '#B98061', '#3894E8', '#D6CAB0', '#A1354B', '#283967']
  },
  {
    id: 'executive',
    name: 'Executive Resume',
    description: 'Sophisticated design for senior positions',
    image: '/lovable-uploads/12e34a3c-b6c0-4503-9e57-ea585d40f8c4.png',
    isPremium: true,
    colors: ['#EA8132', '#D3C29E', '#814EB1', '#D76C45', '#D3A648', '#E88481']
  },
  {
    id: 'creative',
    name: 'Creative Resume',
    description: 'Stand out with a unique creative layout',
    image: '/lovable-uploads/12e34a3c-b6c0-4503-9e57-ea585d40f8c4.png',
    isPremium: true,
    colors: ['#E74189', '#2D7E5D', '#6C2E50', '#1A74BD', '#90A535', '#3E97C9']
  },
  {
    id: 'technical',
    name: 'Technical Resume',
    description: 'Perfect for developers and IT professionals',
    image: '/lovable-uploads/12e34a3c-b6c0-4503-9e57-ea585d40f8c4.png',
    isPremium: true,
    colors: ['#629E44', '#B98061', '#3894E8', '#D6CAB0', '#A1354B', '#283967']
  }
];

interface ResumeTemplatesProps {
  onSelect: (template: ResumeTemplateProps) => void;
  selectedTemplateId?: string;
  onColorSelect?: (color: string) => void;
}

const ResumeTemplates: React.FC<ResumeTemplatesProps> = ({ onSelect, selectedTemplateId, onColorSelect }) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handlePreview = (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    setPreviewTemplate(previewTemplate === templateId ? null : templateId);
  };

  const handleColorSelect = (e: React.MouseEvent, color: string) => {
    e.stopPropagation();
    setSelectedColor(color);
    if (onColorSelect) {
      onColorSelect(color);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Choose a Resume Template</h3>
        </div>
        <Button variant="outline" size="sm" className="shadow-sm hover:shadow transition-all">
          View All Templates
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={cn(
              "relative overflow-hidden cursor-pointer transition-all duration-300",
              template.id === selectedTemplateId 
                ? "border-2 border-primary ring-2 ring-primary/20" 
                : "border border-gray-200 hover:border-primary/50",
              "hover:shadow-lg transform hover:-translate-y-1"
            )}
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
            onClick={() => onSelect(template)}
          >
            <div className="aspect-[3/4] relative">
              <img 
                src={template.image} 
                alt={template.name} 
                className={cn(
                  "w-full h-full object-cover transition-transform duration-500",
                  hoveredTemplate === template.id ? "scale-105" : "scale-100"
                )}
              />
              
              {/* Preview overlay for templates */}
              <div 
                className={cn(
                  "absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 transition-all duration-300",
                  (hoveredTemplate === template.id || template.id === selectedTemplateId) 
                    ? "opacity-100" 
                    : "opacity-0 pointer-events-none"
                )}
              >
                <h4 className="text-white font-bold text-lg mb-1">{template.name}</h4>
                <p className="text-white/80 text-center text-sm mb-4">{template.description}</p>
                
                <div className="flex gap-2 mb-4">
                  <Button 
                    size="sm" 
                    className="bg-primary/90 hover:bg-primary transition-colors"
                    onClick={() => onSelect(template)}
                  >
                    {template.id === selectedTemplateId ? (
                      <>
                        <Check className="h-4 w-4 mr-1" /> Selected
                      </>
                    ) : (
                      "Use This Template"
                    )}
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                    onClick={(e) => handlePreview(e, template.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                </div>
                
                {/* Color selection */}
                <div className="flex items-center justify-center gap-2">
                  {template.colors.map((color, index) => (
                    <button
                      key={index}
                      className={cn(
                        "w-6 h-6 rounded-full transition-all duration-200",
                        selectedColor === color && template.id === selectedTemplateId
                          ? "ring-2 ring-white scale-110"
                          : "hover:scale-110"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={(e) => handleColorSelect(e, color)}
                      aria-label={`Select color ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Premium badge */}
              {template.isPremium && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold py-1 px-3 rounded-full flex items-center shadow-md">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Premium
                </div>
              )}
              
              {/* Selected indicator */}
              {template.id === selectedTemplateId && (
                <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold py-1 px-2 rounded-full shadow-md">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            
            <CardContent className="p-3 bg-white">
              <div className="flex justify-between items-center">
                <span className="font-medium">{template.name}</span>
                {template.isPremium ? (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Premium</span>
                ) : (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Free</span>
                )}
              </div>
              
              {/* Color selection bar below the template */}
              <div className="flex items-center justify-center gap-1 mt-2">
                {template.colors.slice(0, 6).map((color, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-4 h-4 rounded-full transition-all duration-200 hover:scale-110",
                      selectedColor === color && template.id === selectedTemplateId && "ring-1 ring-gray-400"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={(e) => handleColorSelect(e, color)}
                    aria-label={`Select color ${index + 1}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Full screen preview modal */}
      {previewTemplate && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setPreviewTemplate(null)}
        >
          <div 
            className="bg-white rounded-lg overflow-hidden w-full max-w-2xl max-h-[80vh] shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium">{templates.find(t => t.id === previewTemplate)?.name} Template Preview</h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setPreviewTemplate(null)}
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="overflow-auto p-4 max-h-[calc(80vh-60px)]">
              <img 
                src={templates.find(t => t.id === previewTemplate)?.image} 
                alt={templates.find(t => t.id === previewTemplate)?.name} 
                className="w-full h-auto rounded"
              />
            </div>
            <div className="p-4 border-t">
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {templates.find(t => t.id === previewTemplate)?.colors.map((color, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all duration-200 hover:scale-110",
                      selectedColor === color ? "ring-2 ring-gray-400 scale-110" : ""
                    )}
                    style={{ backgroundColor: color }}
                    onClick={(e) => handleColorSelect(e, color)}
                    aria-label={`Select color ${index + 1}`}
                  />
                ))}
              </div>
              <Button 
                className="w-full"
                onClick={() => {
                  const template = templates.find(t => t.id === previewTemplate);
                  if (template) {
                    onSelect(template);
                    setPreviewTemplate(null);
                  }
                }}
              >
                Use This Template
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeTemplates;
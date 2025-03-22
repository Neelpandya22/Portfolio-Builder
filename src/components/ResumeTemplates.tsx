import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Check, Sparkles, Eye } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface ResumeTemplateProps {
  id: string;
  name: string;
  description: string;
  image: string;
  isPremium: boolean;
}

const templates: ResumeTemplateProps[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional layout perfect for most industries',
    image: '/lovable-uploads/7af0f9e4-7270-48af-9b49-d7862a3700b6.png',
    isPremium: false
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean design with a touch of color',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1024&auto=format&fit=crop',
    isPremium: false
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple layout that highlights your experience',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1024&auto=format&fit=crop',
    isPremium: false
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated design for senior positions',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1024&auto=format&fit=crop',
    isPremium: true
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Stand out with a unique creative layout',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1024&auto=format&fit=crop',
    isPremium: true
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Perfect for developers and IT professionals',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1024&auto=format&fit=crop',
    isPremium: true
  }
];

interface ResumeTemplatesProps {
  onSelect: (template: ResumeTemplateProps) => void;
  selectedTemplateId?: string;
}

const ResumeTemplates: React.FC<ResumeTemplatesProps> = ({ onSelect, selectedTemplateId }) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const handlePreview = (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    setPreviewTemplate(previewTemplate === templateId ? null : templateId);
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
                
                <div className="flex gap-2">
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
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setPreviewTemplate(null)}
              >
                Close
              </Button>
            </div>
            <div className="overflow-auto p-4 max-h-[calc(80vh-60px)]">
              <img 
                src={templates.find(t => t.id === previewTemplate)?.image} 
                alt={templates.find(t => t.id === previewTemplate)?.name} 
                className="w-full h-auto rounded"
              />
            </div>
            <div className="p-4 border-t">
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
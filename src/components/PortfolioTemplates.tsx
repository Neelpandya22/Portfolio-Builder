import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Check, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface TemplateProps {
  id: string;
  name: string;
  description: string;
  image: string;
  isPremium: boolean;
}

const templates: TemplateProps[] = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean and modern with focus on your projects',
    image: 'https://images.unsplash.com/photo-1551739440-5dd934d3a94a?q=80&w=1024&auto=format&fit=crop',
    isPremium: false
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'Perfect for showcasing coding projects and skills',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1024&auto=format&fit=crop',
    isPremium: false
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant design for showcasing visual work',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1024&auto=format&fit=crop',
    isPremium: false
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Elegant and corporate-friendly design',
    image: 'https://images.unsplash.com/photo-1593429736389-d3bbe239b27c?q=80&w=1024&auto=format&fit=crop',
    isPremium: true
  },
  {
    id: 'photographer',
    name: 'Photographer',
    description: 'Full-screen images for visual impact',
    image: 'https://images.unsplash.com/photo-1593584785033-9c7604d0863f?q=80&w=1024&auto=format&fit=crop',
    isPremium: true
  },
  {
    id: 'multimedia',
    name: 'Multimedia',
    description: 'Perfect for showcasing videos and interactive media',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1024&auto=format&fit=crop',
    isPremium: true
  }
];

interface PortfolioTemplatesProps {
  onSelect: (template: TemplateProps) => void;
  selectedTemplateId?: string;
}

const PortfolioTemplates: React.FC<PortfolioTemplatesProps> = ({ onSelect, selectedTemplateId }) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Choose a Template</h3>
        </div>
        <Button variant="outline" size="sm">View All Templates</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={cn(
              "relative overflow-hidden cursor-pointer border-2 transition-all duration-300",
              template.id === selectedTemplateId ? "border-primary" : "border-transparent",
              "hover:shadow-md"
            )}
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
            onClick={() => onSelect(template)}
          >
            <div className="aspect-[4/3] relative">
              <img 
                src={template.image} 
                alt={template.name} 
                className="w-full h-full object-cover"
              />
              <div className={cn(
                "absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4 transition-opacity duration-300",
                hoveredTemplate === template.id || template.id === selectedTemplateId ? "opacity-100" : "opacity-0"
              )}>
                <h4 className="text-white font-bold text-lg mb-1">{template.name}</h4>
                <p className="text-white/80 text-center text-sm mb-3">{template.description}</p>
                <Button size="sm">
                  {template.id === selectedTemplateId ? (
                    <>
                      <Check className="h-4 w-4 mr-1" /> Selected
                    </>
                  ) : (
                    "Select Template"
                  )}
                </Button>
              </div>
              
              {template.isPremium && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold py-1 px-2 rounded-full flex items-center">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Premium
                </div>
              )}
              
              {template.id === selectedTemplateId && (
                <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold py-1 px-2 rounded-full">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            <CardContent className="p-3">
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
    </div>
  );
};

export default PortfolioTemplates;

import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { ExternalLink } from 'lucide-react';

export interface ProjectProps {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  url: string;
  index: number;
}

const ProjectCard: React.FC<ProjectProps> = ({
  title,
  description,
  image,
  category,
  url,
  index
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  // This effect handles the animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, index * 100); // Staggered animation delay based on index
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative rounded-2xl overflow-hidden transition-all duration-500 ease-out",
        "opacity-0 translate-y-12",
        isVisible && "opacity-100 translate-y-0"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className={cn(
            "w-full h-full object-cover transition-all duration-700 ease-out",
            isHovered ? "scale-110 filter brightness-90" : "scale-100"
          )}
        />
      </div>

      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent",
          "flex flex-col justify-end p-6 text-white",
          "transition-opacity duration-500",
          isHovered ? "opacity-100" : "opacity-90"
        )}
      >
        <span className="text-xs uppercase tracking-wider font-medium mb-2 opacity-80">
          {category}
        </span>
        
        <h3 className="text-xl font-display font-bold mb-2">{title}</h3>
        
        <p className={cn(
          "text-sm text-white/80 mb-4 line-clamp-2 transition-all duration-500",
          isHovered ? "opacity-100" : "opacity-0 translate-y-4"
        )}>
          {description}
        </p>
        
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 text-sm font-medium",
            "py-2 px-4 rounded-full bg-white/20 backdrop-blur-xs",
            "transition-all duration-300 w-fit",
            "hover:bg-white/30"
          )}
        >
          View Project
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;

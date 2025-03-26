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

  // This effect handles the animation on scroll with improved timing
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, index * 50); // Faster staggered animation delay
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
        "group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md", 
        "opacity-0 translate-y-4 transition-all duration-300 ease-out", 
        isVisible && "opacity-100 translate-y-0"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transitionDelay: `${50 + index * 40}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={title}
          className={cn(
            "w-full h-full object-cover transition-all duration-500", 
            isHovered ? "scale-105 filter brightness-98" : "scale-100", 
            "transition-transform"
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </div>

      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent",
          "flex flex-col justify-end p-6 text-white",
          "transition-all duration-300", 
          isHovered ? "opacity-100" : "opacity-90"
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <span className="text-xs uppercase tracking-wider font-medium mb-2 opacity-80">
          {category}
        </span>
        
        <h3 className="text-xl font-display font-bold mb-2">{title}</h3>
        
        <p className={cn(
          "text-sm text-white/80 mb-4 line-clamp-2 transition-all duration-300", 
          isHovered ? "opacity-100 transform-none" : "opacity-0 translate-y-2"
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {description}
        </p>
        
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 text-sm font-medium",
            "py-2 px-4 rounded-full bg-white/20 backdrop-blur-sm",
            "transition-all duration-200", 
            "hover:bg-white/30 hover:translate-y-[-2px]"
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          View Project
          <ExternalLink size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;

import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { Code, Compass, Palette } from 'lucide-react';

interface FeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}

const Feature: React.FC<FeatureProps> = ({ icon: Icon, title, description, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const featureRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (featureRef.current) {
      observer.observe(featureRef.current);
    }

    return () => {
      if (featureRef.current) {
        observer.unobserve(featureRef.current);
      }
    };
  }, [delay]);

  return (
    <div 
      ref={featureRef}
      className={cn(
        "bg-white rounded-2xl p-8 border border-gray-100 shadow-soft transition-all duration-700",
        "opacity-0 translate-y-8",
        isVisible && "opacity-100 translate-y-0"
      )}
    >
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-display font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const AboutSection: React.FC = () => {
  const [headingVisible, setHeadingVisible] = useState(false);
  const headingRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHeadingVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (headingRef.current) {
      observer.observe(headingRef.current);
    }

    return () => {
      if (headingRef.current) {
        observer.unobserve(headingRef.current);
      }
    };
  }, []);

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="portfolio-container">
        <div 
          ref={headingRef}
          className={cn(
            "text-center mb-16 transition-all duration-700",
            "opacity-0 translate-y-8",
            headingVisible && "opacity-100 translate-y-0"
          )}
        >
          <h2 className="section-title">Why Choose Our Platform</h2>
          <p className="section-subtitle mx-auto">
            Our portfolio builder combines powerful features with an intuitive interface, 
            allowing you to create stunning portfolios without any coding knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature 
            icon={Palette} 
            title="Beautiful Templates" 
            description="Choose from a variety of professionally designed templates that are fully customizable to match your personal style."
            delay={0}
          />
          <Feature 
            icon={Compass} 
            title="Intuitive Interface" 
            description="Our drag-and-drop builder makes it easy to create and edit your portfolio, with real-time previews of your changes."
            delay={200}
          />
          <Feature 
            icon={Code} 
            title="Custom Domain" 
            description="Connect your own domain name for a professional online presence that represents your personal brand."
            delay={400}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

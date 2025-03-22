
import React from 'react';
import { cn } from "@/lib/utils";
import { ArrowUp, Github, Linkedin, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="portfolio-container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <a href="#" className="text-lg font-display font-bold">
              Portfolio Builder
            </a>
            <p className="text-sm text-muted-foreground mt-2">
              Create beautiful portfolios with ease.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <nav className="flex gap-6">
              <a href="#home" className="text-sm text-foreground/80 hover:text-foreground transition-colors duration-200">
                Home
              </a>
              <a href="#projects" className="text-sm text-foreground/80 hover:text-foreground transition-colors duration-200">
                Projects
              </a>
              <a href="#about" className="text-sm text-foreground/80 hover:text-foreground transition-colors duration-200">
                About
              </a>
              <a href="#contact" className="text-sm text-foreground/80 hover:text-foreground transition-colors duration-200">
                Contact
              </a>
            </nav>
            
            <div className="flex gap-4">
              <a 
                href="#" 
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center",
                  "bg-gray-100 text-gray-600 transition-all duration-300",
                  "hover:bg-primary hover:text-white"
                )}
              >
                <Twitter size={16} />
              </a>
              <a 
                href="https://github.com/Neelpandya22/" 
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center",
                  "bg-gray-100 text-gray-600 transition-all duration-300",
                  "hover:bg-primary hover:text-white"
                )}
              >
                <Github size={16} />
              </a>
              <a 
                href="https://www.linkedin.com/in/neepandya22/" 
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center",
                  "bg-gray-100 text-gray-600 transition-all duration-300",
                  "hover:bg-primary hover:text-white"
                )}
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center items-center mt-12 pt-6 border-t border-gray-100 text-sm text-muted-foreground text-center">
        <p>&copy; {new Date().getFullYear()} Portfolio Builder. All rights reserved.</p>
        <p>Developed By: <b>Neel Pandya</b></p>
        
          <button 
            onClick={scrollToTop}
            className={cn(
              "flex items-center gap-2 mb-4 md:mb-0",
              "text-foreground/70 hover:text-foreground",
              "transition-colors duration-200"
            )}
          >
            Back to Top
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

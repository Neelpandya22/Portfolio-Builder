import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { ChevronDown, ArrowRight, User, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroProps {
  isLoggedIn?: boolean;
}

const Hero: React.FC<HeroProps> = ({ isLoggedIn = false }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgPatternRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !bgPatternRef.current) return;
      const scrollPosition = window.scrollY;
      const translateY = scrollPosition * 0.5;
      heroRef.current.style.transform = `translateY(${translateY}px)`;
      
      // Parallax effect for the background pattern
      bgPatternRef.current.style.transform = `translateY(${scrollPosition * 0.2}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Interactive cursor effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 20;
      const yPos = (clientY / window.innerHeight - 0.5) * 20;
      
      heroRef.current.style.backgroundPosition = `calc(50% + ${xPos}px) calc(50% + ${yPos}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation for hero elements on load
  useEffect(() => {
    const heroElements = document.querySelectorAll('.hero-animate');
    
    heroElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible');
      }, 300 + (index * 200));
    });
  }, []);

  return (
    <section 
      id="home" 
      className="relative h-screen flex items-center overflow-hidden"
    >
      {/* Animated background pattern */}
      <div 
        ref={bgPatternRef}
        className="absolute inset-0 -z-20 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(74, 222, 222, 0.2) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(66, 77, 255, 0.2) 0%, transparent 50%)',
          backgroundSize: '100% 100%',
        }}
      />
      
      {/* Main background */}
      <div 
        ref={heroRef}
        className="absolute inset-0 -z-10 transition-transform duration-300 ease-out"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 1), rgba(240, 240, 255, 0.8))',
        }}
      />
      
      {/* Floating elements */}
      <div className="absolute inset-0 -z-5 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/5 animate-float" style={{ animationDuration: '15s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-purple-500/5 animate-float" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 rounded-full bg-pink-500/5 animate-float" style={{ animationDuration: '20s', animationDelay: '1s' }}></div>
      </div>
      
      <div className="portfolio-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block py-1 px-3 mb-6 text-xs font-medium uppercase tracking-wider bg-primary/10 rounded-full hero-animate opacity-0" style={{ transitionDelay: '0.1s' }}>
            Portfolio Builder
          </span>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 hero-animate opacity-0" style={{ transitionDelay: '0.3s' }}>
            Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Professional Portfolio</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto hero-animate opacity-0" style={{ transitionDelay: '0.5s' }}>
            Showcase your work with elegant designs and smooth interactions. Build a portfolio that truly represents your skills and creativity.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 hero-animate opacity-0" style={{ transitionDelay: '0.7s' }}>
            {isLoggedIn ? (
              <>
                <Link 
                  to="/portfolio-setup"
                  className={cn(
                    "px-6 py-3 font-medium rounded-full flex items-center justify-center",
                    "bg-primary text-white transition-all duration-300",
                    "hover:shadow-md hover:shadow-primary/20 hover:-translate-y-1",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                  )}
                >
                  <ArrowRight size={18} className="mr-2" />
                  Build Portfolio
                </Link>
                <Link
                  to="/resume"
                  className={cn(
                    "px-6 py-3 font-medium rounded-full flex items-center justify-center",
                    "bg-white border border-gray-200 transition-all duration-300",
                    "hover:shadow-md hover:shadow-gray-100 hover:-translate-y-1",
                    "focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                  )}
                >
                  Create Resume
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className={cn(
                    "px-6 py-3 font-medium rounded-full flex items-center justify-center",
                    "bg-primary text-white transition-all duration-300",
                    "hover:shadow-md hover:shadow-primary/20 hover:-translate-y-1 group",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                  )}
                >
                  <LogIn size={18} className="mr-2" />
                  Login to Build
                </Link>
                <Link
                  to="/register"
                  className={cn(
                    "px-6 py-3 font-medium rounded-full flex items-center justify-center",
                    "bg-white border border-gray-200 transition-all duration-300",
                    "hover:shadow-md hover:shadow-gray-100 hover:-translate-y-1 group",
                    "focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                  )}
                >
                  Register Now
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      <a
        href="#projects"
        className={cn(
          "absolute bottom-10 left-1/2 -translate-x-1/2",
          "w-10 h-10 rounded-full flex items-center justify-center",
          "bg-white/80 backdrop-blur-sm border border-gray-100",
          "shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1",
          "focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2",
          "animate-float"
        )}
        style={{ animationDuration: '3s' }}
      >
        <ChevronDown size={20} className="animate-bounce" style={{ animationDuration: '2s' }} />
      </a>
    </section>
  );
};

export default Hero;
import React, { useEffect, useRef, useContext } from 'react';
import { cn } from "@/lib/utils";
import { ChevronDown, ArrowRight, User, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/App';

interface HeroProps {
  isLoggedIn?: boolean;
}

const Hero: React.FC<HeroProps> = ({ isLoggedIn: propsIsLoggedIn }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgPatternRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useContext(AuthContext);
  const userName = user?.name || '';

  useEffect(() => {
    // Check auth status on component mount
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated();
      setIsLoggedIn(isAuthenticated);
    };

    checkAuth();
  }, [propsIsLoggedIn]);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !bgPatternRef.current) return;
      const scrollPosition = window.scrollY;
      
      // Smoother parallax effect with cubic-bezier easing
      const translateY = scrollPosition * 0.3;
      heroRef.current.style.transform = `translateY(${translateY}px)`;
      
      // Improved parallax effect for the background pattern
      bgPatternRef.current.style.transform = `translateY(${scrollPosition * 0.15}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Improved interactive cursor effect with subtle easing
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 15; // Reduced movement for subtlety
      const yPos = (clientY / window.innerHeight - 0.5) * 15;
      
      heroRef.current.style.transition = "background-position 0.15s cubic-bezier(0.25, 0.1, 0.25, 1)";
      heroRef.current.style.backgroundPosition = `calc(50% + ${xPos}px) calc(50% + ${yPos}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Faster staggered animation for hero elements on load
  useEffect(() => {
    const heroElements = document.querySelectorAll('.hero-animate');
    
    heroElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible');
      }, 100 + (index * 120)); // Faster animation timing
    });
  }, []);

  return (
    <section 
      id="home" 
      className="relative h-screen flex items-center overflow-hidden"
    >
      {/* Animated background pattern with improved gradient */}
      <div 
        ref={bgPatternRef}
        className="absolute inset-0 -z-20 opacity-30 transition-transform duration-300 ease-out"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(74, 222, 222, 0.25) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(66, 77, 255, 0.25) 0%, transparent 50%)',
          backgroundSize: '100% 100%',
        }}
      />
      
      {/* Main background with smoother transition */}
      <div 
        ref={heroRef}
        className="absolute inset-0 -z-10 transition-all duration-200 ease-out"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 1), rgba(240, 240, 255, 0.9))',
        }}
      />
      
      {/* Floating elements with improved animation timing */}
      <div className="absolute inset-0 -z-5 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/5 animate-float" style={{ animationDuration: '9s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-purple-500/5 animate-float" style={{ animationDuration: '7s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 rounded-full bg-pink-500/5 animate-float" style={{ animationDuration: '11s', animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="portfolio-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block py-1 px-3 mb-6 text-xs font-medium uppercase tracking-wider bg-primary/10 rounded-full hero-animate opacity-0" style={{ transitionDelay: '0.05s' }}>
            Portfolio Builder
          </span>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 hero-animate opacity-0" style={{ transitionDelay: '0.15s' }}>
            {isAuthenticated 
              ? `Welcome ${userName}, to Your` 
              : "Create Your"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Professional Portfolio</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto hero-animate opacity-0" style={{ transitionDelay: '0.25s' }}>
            Showcase your work with elegant designs and smooth interactions. Build a portfolio that truly represents your skills and creativity.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 hero-animate opacity-0" style={{ transitionDelay: '0.35s' }}>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/portfolio-setup"
                  className={cn(
                    "px-6 py-3 font-medium rounded-full flex items-center justify-center",
                    "bg-black text-white transition-all duration-200",
                    "hover:shadow-md hover:shadow-black/20 hover:-translate-y-1",
                    "focus:outline-none focus:ring-2 focus:ring-black/50 focus:ring-offset-2"
                  )}
                >
                  <ArrowRight size={18} className="mr-2" />
                  Build Portfolio
                </Link>
                <Link
                  to="/resume"
                  className={cn(
                    "px-6 py-3 font-medium rounded-full flex items-center justify-center",
                    "bg-white border border-gray-200 transition-all duration-200",
                    "hover:shadow-md hover:shadow-gray-100 hover:-translate-y-1",
                    "focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                  )}
                >
                  Create Resume
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className={cn(
                    "px-6 py-3 font-medium rounded-full flex items-center justify-center",
                    "bg-black text-white transition-all duration-200",
                    "hover:shadow-md hover:shadow-black/20 hover:-translate-y-1 group",
                    "focus:outline-none focus:ring-2 focus:ring-black/50 focus:ring-offset-2"
                  )}
                >
                  <LogIn size={18} className="mr-2" />
                  Login to Build
                </Link>
                <Link
                  to="/register"
                  className={cn(
                    "px-6 py-3 font-medium rounded-full flex items-center justify-center",
                    "bg-white border border-gray-200 transition-all duration-200",
                    "hover:shadow-md hover:shadow-gray-100 hover:-translate-y-1 group",
                    "focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
                  )}
                >
                  Register Now
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
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
          "shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1",
          "focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2",
          "animate-float"
        )}
        style={{ animationDuration: '2s' }}
      >
        <ChevronDown size={20} className="animate-bounce" style={{ animationDuration: '1.5s' }} />
      </a>
    </section>
  );
};

export default Hero;
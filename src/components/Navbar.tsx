import React, { useState, useEffect, useContext } from 'react';
import { cn } from "@/lib/utils";
import { Menu, X, User, Briefcase, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '@/App';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useContext(AuthContext);
  const userName = user?.name || '';
  const userInitials = userName.split(' ').map(part => part[0]).join('').toUpperCase();
  const [avatarUrl, setAvatarUrl] = useState("");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Get avatar URL from localStorage if available
  useEffect(() => {
    const storedAvatarUrl = localStorage.getItem('avatarUrl');
    if (storedAvatarUrl) {
      setAvatarUrl(storedAvatarUrl);
    }
  }, []);

  // Modified navLinks to always include Portfolio Setup
  const getNavLinks = () => {
    const baseLinks = [
      { name: 'Home', path: '/', hash: '' },
      { name: 'Projects', path: '/', hash: '#projects' },
      { name: 'About', path: '/', hash: '#about' },
      { name: 'Contact', path: '/', hash: '#contact' },
      { name: 'Resume Builder', path: '/resume', hash: '' },
      { name: 'Portfolio Setup', path: '/portfolio-setup', hash: '' },
    ];
    
    return baseLinks;
  };

  // Handle smooth scrolling for hash links
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    // Only process hash links on the homepage
    if (location.pathname === '/' && hash) {
      e.preventDefault();
      
      // Close mobile menu
      setIsMobileMenuOpen(false);
      
      // Find the element to scroll to
      const element = document.querySelector(hash);
      if (element) {
        // Smooth scroll to the element
        element.scrollIntoView({ behavior: 'smooth' });
        
        // Update URL without causing a page reload
        window.history.pushState(null, '', hash);
      }
    }
  };

  const navLinks = getNavLinks();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm" 
          : "bg-transparent",
        "animate-fade-in"
      )}
    >
      <div className="portfolio-container flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold font-display text-primary hover:text-primary/80 transition-colors duration-300">
          Portfolio Builder
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path && (!link.hash || location.hash === link.hash);
            const href = `${link.path}${link.hash}`;
            
            return (
              <a
                key={link.name}
                href={href}
                onClick={(e) => handleNavLinkClick(e, link.hash)}
                className={cn(
                  "text-sm font-medium link-underline transition-all duration-300",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                {link.name}
              </a>
            );
          })}
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border border-primary/10">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-muted-foreground">{userName}</span>
              </div>
              <Link
                to="/dashboard"
                className="flex items-center text-sm font-medium text-white bg-primary px-4 py-2 rounded-md hover:bg-primary/90 transition-all duration-300 transform hover:-translate-y-1"
              >
                <User size={16} className="mr-2" />
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-all duration-300 transform hover:-translate-y-1"
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 transition-transform duration-300 hover:scale-110"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden py-4 bg-white/95 backdrop-blur-sm border-t animate-slide-up">
          <div className="portfolio-container flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path && (!link.hash || location.hash === link.hash);
              const href = `${link.path}${link.hash}`;
              
              return (
                <a
                  key={link.name}
                  href={href}
                  onClick={(e) => handleNavLinkClick(e, link.hash)}
                  className={cn(
                    "py-2 px-4 rounded-md transition-all duration-300",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-gray-100"
                  )}
                >
                  {link.name}
                </a>
              );
            })}
            
            {isAuthenticated ? (
              <div className="space-y-2 pt-3 border-t border-gray-100">
                <div className="px-4 py-2 flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-primary/10">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {userName}
                  </span>
                </div>
                <Link
                  to="/dashboard"
                  className="py-2 px-4 flex items-center rounded-md bg-primary text-white hover:bg-primary/90 transition-all duration-300"
                >
                  <User size={16} className="mr-2" />
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-2 pt-3 border-t border-gray-100">
                <Link
                  to="/login"
                  className="py-2 px-4 rounded-md text-primary hover:bg-primary/5 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="py-2 px-4 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
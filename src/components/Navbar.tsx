import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Menu, X, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const location = useLocation();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!token);

    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserName(user?.name || '');
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem('user'); // Remove corrupted data
        setUserName('');
      }
    }
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Navigation links
  const getNavLinks = () => {
    const baseLinks = [
      { name: 'Home', path: '/', hash: '' },
      { name: 'Projects', path: '/', hash: '#projects' },
      { name: 'About', path: '/', hash: '#about' },
      { name: 'Contact', path: '/', hash: '#contact' },
      { name: 'Resume Builder', path: '/resume', hash: '' },
    ];

    if (!isLoggedIn) {
      baseLinks.push({ name: 'Portfolio Setup', path: '/portfolio-setup', hash: '' });
    }

    return baseLinks;
  };

  // Handle smooth scrolling for hash links
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (location.pathname === '/' && hash) {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', hash);
      }
    }
  };

  const navLinks = getNavLinks();

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent",
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
          
          {isLoggedIn ? (
            <div className="flex items-center space-x-4 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              <span className="text-sm font-medium text-muted-foreground">Welcome, {userName}</span>
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
              <Link to="/login" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-300">
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
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-gray-100"
                  )}
                >
                  {link.name}
                </a>
              );
            })}
            
            {isLoggedIn ? (
              <div className="space-y-2 pt-3 border-t border-gray-100">
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  Welcome, {userName}
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
                <Link to="/login" className="py-2 px-4 rounded-md text-primary hover:bg-primary/5 transition-colors duration-300">
                  Login
                </Link>
                <Link to="/register" className="py-2 px-4 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors duration-300">
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

import React, { useEffect, useContext } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProjectGallery from '@/components/ProjectGallery';
import AboutSection from '@/components/AboutSection';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { AuthContext } from '@/App';

const Index = () => {
  const { isAuthenticated } = useContext(AuthContext);
  
  // Add intersection observer for animation on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Add a small delay for child elements to create a cascade effect
          const children = entry.target.querySelectorAll('.animate-child');
          children.forEach((child, index) => {
            setTimeout(() => {
              (child as HTMLElement).classList.add('visible');
            }, index * 150);
          });
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = document.querySelectorAll('.animate-on-scroll');

    elements.forEach((element) => {
      observer.observe(element);
    });

    // Extra animation effect on load
    const heroElements = document.querySelectorAll('.hero-animate');
    heroElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('visible');
      }, 300 + (index * 200));
    });

    return () => {
      elements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero isLoggedIn={isAuthenticated} />
      <ProjectGallery />
      <AboutSection />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
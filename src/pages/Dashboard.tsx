import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, ArrowRight, Palette, MoveHorizontal, Globe, FileText } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [portfolioProgress, setPortfolioProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animationReady, setAnimationReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login', { replace: true });
      return;
    }
    
    // Faster loading with optimized timing
    const timer = setTimeout(() => {
      setUser(JSON.parse(userData));
      
      // Calculate portfolio progress
      const steps = localStorage.getItem('portfolio-setup-steps');
      if (steps) {
        const setupSteps = JSON.parse(steps);
        const completed = setupSteps.filter((step: any) => step.completed).length;
        setPortfolioProgress(Math.round((completed / setupSteps.length) * 100));
      }
      
      setLoading(false);
      
      // Faster animation trigger
      setTimeout(() => {
        setAnimationReady(true);
      }, 50);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success("Successfully logged out");
    navigate('/login', { replace: true });
  };
  
  const handleNavigate = (path: string) => {
    navigate(path, { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="py-16 portfolio-container animate-fade-in">
          <div className="text-center mb-10">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="py-16 portfolio-container animate-fade-in">
        <div className={cn(
          "text-center mb-10 transition-all duration-200 ease-out",
          animationReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <h1 className="section-title">Welcome, {user.name}!</h1>
          <p className="section-subtitle mx-auto">
            Manage your portfolio and resume from your personal dashboard.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card 
            className={cn(
              "shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden",
              "transform hover:-translate-y-1",
              animationReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: "50ms", transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <div className="aspect-video relative bg-gradient-to-r from-primary/20 to-primary/5">
              <div className="absolute inset-0 flex flex-col justify-center p-8">
                <h2 className="text-2xl font-bold mb-2">Your Portfolio</h2>
                <p className="text-muted-foreground mb-6">
                  {portfolioProgress === 100 
                    ? "Your portfolio is complete and ready to share!" 
                    : `Your portfolio is ${portfolioProgress}% complete. Continue setting it up.`}
                </p>
                <Button 
                  className="px-6 py-2 rounded-full text-white bg-black hover:bg-black/80 w-fit transform transition-all duration-200 hover:-translate-y-1"
                  onClick={() => handleNavigate('/portfolio-setup')}
                >
                  {portfolioProgress === 100 ? "View Portfolio" : "Continue Setup"}
                  <ArrowRight size={18} className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </Card>

          <Card 
            className={cn(
              "shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden",
              "transform hover:-translate-y-1",
              animationReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: "100ms", transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <div className="aspect-video relative bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="absolute inset-0 flex flex-col justify-center p-8">
                <h2 className="text-2xl font-bold mb-2">Your Resume</h2>
                <p className="text-muted-foreground mb-6">
                  Create and customize professional resumes for your job applications.
                </p>
                <Button 
                  className="px-6 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 w-fit transform transition-all duration-200 hover:-translate-y-1"
                  variant="outline"
                  onClick={() => handleNavigate('/resume')}
                >
                  Build Your Resume
                  <ArrowRight size={18} className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Beautiful Templates",
              icon: Palette,
              description: "Choose from a variety of professionally designed templates that are fully customizable to match your personal style.",
              action: "Browse Templates",
              path: "/portfolio-setup",
              delay: "150ms"
            },
            {
              title: "Intuitive Interface",
              icon: MoveHorizontal,
              description: "Our drag-and-drop builder makes it easy to create and edit your portfolio, with real-time previews of your changes.",
              action: "Try Builder",
              path: "/portfolio-setup",
              delay: "200ms"
            },
            {
              title: "Custom Domain",
              icon: Globe,
              description: "Connect your own domain name for a professional online presence that represents your personal brand.",
              action: "Setup Domain",
              path: "/portfolio-setup?tab=setup",
              delay: "250ms"
            }
          ].map((item, index) => (
            <Card 
              key={index}
              className={cn(
                "shadow-sm hover:shadow-lg transition-all duration-200",
                "transform hover:-translate-y-1",
                animationReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ 
                transitionDelay: item.delay,
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <item.icon className="h-5 w-5 text-primary" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="px-6 py-2 rounded-full text-white bg-black hover:bg-black/80 w-full transform transition-all duration-200 hover:-translate-y-0.5"
                  onClick={() => handleNavigate(item.path)}
                >
                  {item.action}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div 
          className={cn(
            "mt-12 text-center transition-all duration-200",
            animationReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{ 
            transitionDelay: "300ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          <Button 
            className="px-6 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 transform transition-all duration-200 hover:-translate-y-0.5"
            variant="outline" 
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
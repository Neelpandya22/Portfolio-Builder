import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, ArrowRight, Palette, MoveHorizontal, Globe, FileText } from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [portfolioProgress, setPortfolioProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    
    // Calculate portfolio progress
    const steps = localStorage.getItem('portfolio-setup-steps');
    if (steps) {
      const setupSteps = JSON.parse(steps);
      const completed = setupSteps.filter((step: any) => step.completed).length;
      setPortfolioProgress(Math.round((completed / setupSteps.length) * 100));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="py-16 portfolio-container">
        <div className="text-center mb-10">
          <h1 className="section-title">Welcome Back, {user.name}!</h1>
          <p className="section-subtitle mx-auto">
            Manage your portfolio and resume from your personal dashboard.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="aspect-video relative bg-gradient-to-r from-primary/20 to-primary/5">
              <div className="absolute inset-0 flex flex-col justify-center p-8">
                <h2 className="text-2xl font-bold mb-2">Your Portfolio</h2>
                <p className="text-muted-foreground mb-6">
                  {portfolioProgress === 100 
                    ? "Your portfolio is complete and ready to share!" 
                    : `Your portfolio is ${portfolioProgress}% complete. Continue setting it up.`}
                </p>
                <Button 
                  className="w-fit" 
                  onClick={() => navigate('/portfolio-setup')}
                >
                  {portfolioProgress === 100 ? "View Portfolio" : "Continue Setup"}
                </Button>
              </div>
            </div>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="aspect-video relative bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="absolute inset-0 flex flex-col justify-center p-8">
                <h2 className="text-2xl font-bold mb-2">Your Resume</h2>
                <p className="text-muted-foreground mb-6">
                  Create and customize professional resumes for your job applications.
                </p>
                <Button 
                  className="w-fit" 
                  variant="outline"
                  onClick={() => navigate('/resume')}
                >
                  Build Your Resume
                </Button>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Beautiful Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Choose from a variety of professionally designed templates that are fully customizable to match your personal style.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/portfolio-setup')}>Browse Templates</Button>
            </CardFooter>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MoveHorizontal className="h-5 w-5 text-primary" />
                Intuitive Interface
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our drag-and-drop builder makes it easy to create and edit your portfolio, with real-time previews of your changes.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/portfolio-setup')}>Try Builder</Button>
            </CardFooter>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Custom Domain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connect your own domain name for a professional online presence that represents your personal brand.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/portfolio-setup?tab=setup')}>Setup Domain</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" onClick={handleLogout}>Sign Out</Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
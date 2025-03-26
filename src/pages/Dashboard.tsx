import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Settings, 
  Briefcase, 
  FileText, 
  ImageIcon, 
  Layers, 
  PenTool, 
  PlusCircle, 
  Calendar, 
  ArrowRight,
  Globe,
  BarChart,
  Link2,
  Eye,
  Share2,
  User,
  Camera,
  Upload
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AuthContext } from '@/App';
import ProfileSettings from '@/components/ProfileSettings';

const Dashboard = () => {
  const [progress, setProgress] = useState(65);
  const { user } = useContext(AuthContext);
  const userName = user?.name || 'User';
  const userInitials = userName.split(' ').map(part => part[0]).join('').toUpperCase();
  const [avatarUrl, setAvatarUrl] = useState("");

  // This would be replaced with actual logic to fetch the user's profile image
  useEffect(() => {
    // In a real app, you would fetch the user's profile image from your backend/storage
    // For now, we'll just use a placeholder or empty string
    const storedAvatarUrl = localStorage.getItem('avatarUrl');
    if (storedAvatarUrl) {
      setAvatarUrl(storedAvatarUrl);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove authentication token
    localStorage.removeItem("user"); // Remove stored user data
    window.location.href = "/login"; // Redirect to login page
  };
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="portfolio-container py-24">
        <div className="flex flex-col space-y-8">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-2 border-primary/10">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome, {userName}</h1>
                <p className="text-muted-foreground">Manage your portfolio and track your progress</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Preview Portfolio
              </Button>
            </div>
          </div>
          <Button
                className="px-6 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 transform transition-all duration-200 hover:-translate-y-0.5"
                variant="outline"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
          {/* Portfolio Completion */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Portfolio Completion</CardTitle>
              <CardDescription>Complete these steps to finish your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="flex items-start space-x-4 rounded-lg border p-4">
                    <Briefcase className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Add Projects</p>
                      <p className="text-sm text-muted-foreground">Showcase your best work</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 rounded-lg border p-4 bg-primary/5">
                    <FileText className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Update Resume</p>
                      <p className="text-sm text-muted-foreground">Add your experience & skills</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 rounded-lg border p-4">
                    <ImageIcon className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Upload Photos</p>
                      <p className="text-sm text-muted-foreground">Add profile & project images</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                Continue Setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          {/* Dashboard Tabs */}
          <Tabs defaultValue="projects" className="mt-6">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="resume">Resume</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Your Projects</h2>
                <Link to="/projects">
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </Link>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="overflow-hidden">
                  <div className="h-40 bg-muted/30 animate-pulse"></div>
                  <CardHeader>
                    <CardTitle>Add Your First Project</CardTitle>
                    <CardDescription>Showcase your work with detailed project information</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link to="/projects">
                      <Button variant="outline">Get Started</Button>
                    </Link>
                  </CardFooter>
                </Card>
                
                <Card className="border-dashed border-2 flex flex-col items-center justify-center py-8 px-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <PlusCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Add New Project</h3>
                  <p className="text-sm text-center text-muted-foreground mb-4">
                    Create a new project to showcase your skills
                  </p>
                  <Link to="/projects">
                    <Button variant="outline" size="sm">Add Project</Button>
                  </Link>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="resume" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Your Resume</h2>
                <Link to="/resume">
                  <Button size="sm">
                    <PenTool className="mr-2 h-4 w-4" />
                    Edit Resume
                  </Button>
                </Link>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resume Builder</CardTitle>
                  <CardDescription>Create and update your professional resume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Work Experience</h3>
                        <p className="text-sm text-muted-foreground">Add your work history</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">Add</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Layers className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Skills</h3>
                        <p className="text-sm text-muted-foreground">Highlight your key skills</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">Add</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Education</h3>
                        <p className="text-sm text-muted-foreground">Add your educational background</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">Add</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/resume" className="ml-auto">
                    <Button>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Portfolio Analytics</h2>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Portfolio
                </Button>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">+0% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                    <p className="text-xs text-muted-foreground">+0% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Time on Page</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0m 0s</div>
                    <p className="text-xs text-muted-foreground">+0% from last month</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Overview</CardTitle>
                  <CardDescription>View your portfolio's performance over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <BarChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No Analytics Data Yet</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Analytics will appear here once your portfolio is published and begins receiving visitors.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Portfolio Settings</h2>
              </div>
              
              <ProfileSettings userName={userName} userInitials={userInitials} avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />
              
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Manage your portfolio settings and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Custom Domain</h3>
                        <p className="text-sm text-muted-foreground">Connect a custom domain to your portfolio</p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">Connect</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Link2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Social Links</h3>
                        <p className="text-sm text-muted-foreground">Add links to your social profiles</p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">Manage</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Account Settings</h3>
                        <p className="text-sm text-muted-foreground">Update your account information</p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
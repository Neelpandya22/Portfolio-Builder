import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "@/App";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BarChart3, FilePen, ArrowUp, Settings, Folder, Users, MousePointerClick, Calendar, ArrowUpRight, BarChart, LineChart, Eye, Edit, Plus, LogOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import AnalyticsCard from "@/components/AnalyticsCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [portfolioData, setPortfolioData] = useState<any>(null);

  // Analytics demo data
  const [analyticsData, setAnalyticsData] = useState({
    views: {
      total: 0,
      weeklyData: [] as any[],
      change: '+0%'
    },
    clicks: {
      total: 0,
      weeklyData: [] as any[],
      change: '+0%'
    },
    visitors: {
      total: 0,
      monthlyData: [] as any[],
      change: '+0%'
    },
    conversions: {
      total: 0,
      weeklyData: [] as any[],
      change: '+0%'
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadDashboardData = async () => {
      try {
        // Load projects
        const savedProjects = localStorage.getItem('userProjects');
        if (savedProjects) {
          setProjects(JSON.parse(savedProjects));
        }

        // Load portfolio data
        const savedPortfolio = localStorage.getItem('portfolioData');
        if (savedPortfolio) {
          setPortfolioData(JSON.parse(savedPortfolio));
        }

        // Generate random analytics data for demo purposes
        generateAnalyticsData();
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, navigate]);

  const generateAnalyticsData = () => {
    // Generate random data for demonstration purposes
    const viewsData = Array(7).fill(0).map((_, i) => ({
      name: `Day ${i + 1}`,
      value: Math.floor(Math.random() * 100) + 20
    }));
    
    const clicksData = Array(7).fill(0).map((_, i) => ({
      name: `Day ${i + 1}`,
      value: Math.floor(Math.random() * 50) + 10
    }));
    
    const visitorsData = Array(5).fill(0).map((_, i) => ({
      name: `Month ${i + 1}`,
      value: Math.floor(Math.random() * 200) + 50
    }));
    
    const conversionData = Array(7).fill(0).map((_, i) => ({
      name: `Day ${i + 1}`,
      value: Math.floor(Math.random() * 10) + 1
    }));

    // Calculate totals
    const viewsTotal = viewsData.reduce((sum, item) => sum + item.value, 0);
    const clicksTotal = clicksData.reduce((sum, item) => sum + item.value, 0);
    const visitorsTotal = visitorsData.reduce((sum, item) => sum + item.value, 0);
    const conversionsTotal = conversionData.reduce((sum, item) => sum + item.value, 0);

    setAnalyticsData({
      views: {
        total: viewsTotal,
        weeklyData: viewsData,
        change: '+12%'
      },
      clicks: {
        total: clicksTotal,
        weeklyData: clicksData,
        change: '+8%'
      },
      visitors: {
        total: visitorsTotal,
        monthlyData: visitorsData,
        change: '+15%'
      },
      conversions: {
        total: conversionsTotal,
        weeklyData: conversionData,
        change: '+5%'
      }
    });
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleAddProject = () => {
    navigate('/projects');
  };

  const handleEditProject = (projectId: string) => {
    navigate(`/projects?edit=${projectId}`);
  };

  const handlePreviewPortfolio = () => {
    // In a real app, this would navigate to the user's portfolio
    toast({
      title: "Portfolio Preview",
      description: "Your portfolio preview is now available",
    });
    
    // Open a new tab with the index page as a demonstration
    window.open('/', '_blank');
  };

  const handleSignOut = () => {
    // Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update auth context
    setIsAuthenticated(false);
    setUser(null);
    
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    
    // Redirect to home page
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="portfolio-container py-16">
          <div className="flex flex-col gap-4 max-w-5xl mx-auto">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
              <Skeleton className="h-32 rounded-lg" />
            </div>
            <Skeleton className="h-64 rounded-lg mt-6" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="portfolio-container py-16">
        <div className="flex flex-col gap-8 max-w-5xl mx-auto">
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-primary/10">
                <AvatarImage src={localStorage.getItem('avatarUrl') || ''} />
                <AvatarFallback className="bg-primary/10">
                  {getInitials(user?.name || 'User')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome, {user?.name || 'User'}
                </h1>
                <p className="text-muted-foreground">
                  Manage your portfolio, projects, and analytics
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handlePreviewPortfolio} className="gap-2">
                <Eye size={16} />
                Preview Portfolio
              </Button>
              <Button onClick={() => navigate('/portfolio-setup')} className="gap-2">
                <Settings size={16} />
                Portfolio Settings
              </Button>
              <Button variant="destructive" onClick={handleSignOut} className="gap-2">
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>
          </header>
          
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AnalyticsCard
              title="Total Views"
              value={analyticsData.views.total}
              description={`${analyticsData.views.change} from last week`}
              type="line"
              data={analyticsData.views.weeklyData}
              icon={<Eye className="h-4 w-4 text-muted-foreground" />}
            />
            
            <AnalyticsCard
              title="Click-throughs"
              value={analyticsData.clicks.total}
              description={`${analyticsData.clicks.change} from last week`}
              type="bar"
              data={analyticsData.clicks.weeklyData}
              icon={<MousePointerClick className="h-4 w-4 text-muted-foreground" />}
            />
            
            <AnalyticsCard
              title="Unique Visitors"
              value={analyticsData.visitors.total}
              description={`${analyticsData.visitors.change} from last month`}
              type="bar"
              data={analyticsData.visitors.monthlyData}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            
            <AnalyticsCard
              title="Conversions"
              value={analyticsData.conversions.total}
              description={`${analyticsData.conversions.change} from last week`}
              type="line"
              data={analyticsData.conversions.weeklyData}
              icon={<ArrowUpRight className="h-4 w-4 text-muted-foreground" />}
            />
          </section>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Portfolio Status
                    </CardTitle>
                    <CardDescription>
                      Your portfolio setup progress and statistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {portfolioData ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span>Completion Status</span>
                          <span className="font-medium">
                            {portfolioData.isPublished ? 'Published' : 'In Progress'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span>Projects Added</span>
                          <span className="font-medium">{projects.length}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span>Template Selected</span>
                          <span className="font-medium capitalize">
                            {portfolioData.template || 'None'}
                          </span>
                        </div>
                        
                        <div className="mt-4 flex gap-3">
                          <Button 
                            onClick={() => navigate('/portfolio-setup')}
                            variant="outline" 
                            className="flex-1"
                          >
                            Edit Portfolio
                          </Button>
                          <Button 
                            onClick={handlePreviewPortfolio}
                            className="flex-1"
                          >
                            Preview Portfolio
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground mb-4">
                          You haven't started setting up your portfolio yet
                        </p>
                        <Button onClick={() => navigate('/portfolio-setup')}>
                          Create Portfolio
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Folder className="h-5 w-5" />
                      Project Summary
                    </CardTitle>
                    <CardDescription>
                      Your projects at a glance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {projects.length > 0 ? (
                      <div className="space-y-4">
                        <div className="text-2xl font-bold">{projects.length}</div>
                        <p className="text-sm text-muted-foreground">
                          Total projects in your portfolio
                        </p>
                        
                        <div className="pt-4 flex gap-3">
                          <Button onClick={handleAddProject} variant="default" className="w-full flex items-center gap-2">
                            <Plus size={16} />
                            Add Project
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-muted-foreground mb-4">
                          You haven't added any projects yet
                        </p>
                        <Button onClick={handleAddProject} className="flex items-center gap-2">
                          <Plus size={16} />
                          Add Projects
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your recent portfolio activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.length > 0 ? (
                      <div className="space-y-4">
                        {projects.slice(0, 3).map((project, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                                <FilePen className="h-5 w-5 text-gray-500" />
                              </div>
                              <div>
                                <p className="font-medium">{project.title}</p>
                                <p className="text-xs text-muted-foreground">Project added</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditProject(project.id)}
                                className="flex items-center gap-1"
                              >
                                <Edit size={14} />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(project.url || '/', '_blank')}
                                className="flex items-center gap-1"
                              >
                                <Eye size={14} />
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">
                          No recent activity to display
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Your Projects</CardTitle>
                    <Button onClick={handleAddProject} size="sm" className="flex items-center gap-2">
                      <Plus size={16} />
                      Add Project
                    </Button>
                  </div>
                  <CardDescription>
                    View and manage all your portfolio projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.map((project, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="aspect-video bg-gray-100 relative">
                            {project.image ? (
                              <img 
                                src={project.image} 
                                alt={project.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Folder className="h-8 w-8 text-gray-300" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button 
                                variant="secondary" 
                                size="icon" 
                                className="h-8 w-8 bg-white/80 hover:bg-white"
                                onClick={() => handleEditProject(project.id)}
                              >
                                <Edit size={14} />
                              </Button>
                              <Button 
                                variant="secondary" 
                                size="icon" 
                                className="h-8 w-8 bg-white/80 hover:bg-white"
                                onClick={() => window.open(project.url || '/', '_blank')}
                              >
                                <Eye size={14} />
                              </Button>
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="font-medium truncate">{project.title}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Folder className="h-16 w-16 mx-auto text-gray-200 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Add projects to showcase in your portfolio
                      </p>
                      <Button onClick={handleAddProject} className="flex items-center gap-2">
                        <Plus size={16} />
                        Add Your First Project
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card className="space-y-4">
                <CardHeader>
                  <CardTitle>Portfolio Analytics</CardTitle>
                  <CardDescription>
                    View detailed statistics about your portfolio performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <LineChart className="h-5 w-5" />
                          Views Over Time
                        </h3>
                        <div className="h-64 bg-gray-50 rounded-md border flex items-center justify-center p-4">
                          {analyticsData.views.weeklyData.length > 0 ? (
                            <AnalyticsCard
                              title=""
                              value=""
                              type="line"
                              data={analyticsData.views.weeklyData}
                              className="w-full h-full border-none shadow-none"
                            />
                          ) : (
                            <p className="text-muted-foreground">No data available</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Visitor Demographics
                        </h3>
                        <div className="h-64 bg-gray-50 rounded-md border flex items-center justify-center">
                          {analyticsData.visitors.monthlyData.length > 0 ? (
                            <AnalyticsCard
                              title=""
                              value=""
                              type="bar"
                              data={analyticsData.visitors.monthlyData}
                              className="w-full h-full border-none shadow-none"
                            />
                          ) : (
                            <p className="text-muted-foreground">No data available</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <BarChart className="h-5 w-5" />
                          Engagement by Project
                        </h3>
                        <div className="h-64 bg-gray-50 rounded-md border flex items-center justify-center">
                          {projects.length > 0 ? (
                            <div className="w-full h-full p-4">
                              <AnalyticsCard
                                title=""
                                value=""
                                type="bar"
                                data={projects.map(p => ({
                                  name: p.title,
                                  value: Math.floor(Math.random() * 100) + 10
                                }))}
                                className="w-full h-full border-none shadow-none"
                              />
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No projects to analyze</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <ArrowUp className="h-5 w-5" />
                          Conversion Rate
                        </h3>
                        <div className="h-64 bg-gray-50 rounded-md border flex items-center justify-center">
                          {analyticsData.conversions.weeklyData.length > 0 ? (
                            <AnalyticsCard
                              title=""
                              value=""
                              type="line"
                              data={analyticsData.conversions.weeklyData}
                              className="w-full h-full border-none shadow-none"
                            />
                          ) : (
                            <p className="text-muted-foreground">No data available</p>
                          )}
                        </div>
                      </div>
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
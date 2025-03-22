import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, Circle, Globe, PenLine, Search, Settings, 
  Plus, ArrowRight, Check, X, Move, Eye, EyeOff, 
  Palette, Image, Presentation, Save, Trash2
} from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from "@/components/ui/use-toast";
import { useDropzone } from 'react-dropzone';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocation, useNavigate } from 'react-router-dom';
import PortfolioTemplates, { TemplateProps } from '@/components/PortfolioTemplates';
import { checkDomainAvailability, generateDomainSuggestions, checkSuggestionsAvailability } from '@/lib/domainService';
import { cn } from "@/lib/utils";

const PortfolioSetup = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get tab from URL if any
  const urlParams = new URLSearchParams(location.search);
  const urlTab = urlParams.get('tab');
  
  const [domain, setDomain] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null);
  const [domainSuggestions, setDomainSuggestions] = useState<string[]>([]);
  const [suggestionAvailability, setSuggestionAvailability] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState(urlTab || 'setup');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [portfolioName, setPortfolioName] = useState('');
  const [portfolioDescription, setPortfolioDescription] = useState('');
  const [siteType, setSiteType] = useState('developer');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateProps | null>(null);
  
  // Get user from localStorage if available
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  
  // Project management
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('portfolio-projects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image: '',
    category: 'Web Design',
    url: '',
    imageFile: null as File | null,
    imagePreview: null as string | null
  });

  // Design customization state
  const [designSettings, setDesignSettings] = useState({
    primaryColor: '#0f172a',
    secondaryColor: '#4f46e5',
    font: 'Inter',
    showHero: true,
    showProjects: true,
    showAbout: true,
    showContact: true
  });
  
  // Steps array to track setup progress - reset steps when user is new or when they logout and login again
  const [steps, setSteps] = useState(() => {
    // Initialize steps every time the user visits the page to avoid issues with saved state
    const defaultSteps = [
      { id: 'template', title: 'Choose a template', completed: false, inProgress: true },
      { id: 'siteType', title: 'Update your site info', completed: false, inProgress: false },
      { id: 'domain', title: 'Connect a custom domain', completed: false, inProgress: false },
      { id: 'project', title: 'Add a project to your portfolio', completed: false, inProgress: false },
      { id: 'design', title: 'Design your website', completed: false, inProgress: false },
      { id: 'seo', title: 'Get found on Google', completed: false, inProgress: false }
    ];
    
    // Set initial steps based on the user's ID to ensure different users have different setups
    if (user && user.id) {
      const userSpecificKey = `portfolio-setup-steps-${user.id}`;
      const savedSteps = localStorage.getItem(userSpecificKey);
      return savedSteps ? JSON.parse(savedSteps) : defaultSteps;
    }
    
    return defaultSteps;
  });

  // Calculate completion percentage
  const completedSteps = steps.filter(step => step.completed).length;
  const completionPercentage = (completedSteps / steps.length) * 100;

  // Check if user just logged in
  useEffect(() => {
    // If there's a URL param indicating fresh login, reset steps
    if (urlParams.get('freshLogin') === 'true') {
      const defaultSteps = [
        { id: 'template', title: 'Choose a template', completed: false, inProgress: true },
        { id: 'siteType', title: 'Update your site info', completed: false, inProgress: false },
        { id: 'domain', title: 'Connect a custom domain', completed: false, inProgress: false },
        { id: 'project', title: 'Add a project to your portfolio', completed: false, inProgress: false },
        { id: 'design', title: 'Design your website', completed: false, inProgress: false },
        { id: 'seo', title: 'Get found on Google', completed: false, inProgress: false }
      ];
      setSteps(defaultSteps);
      
      // Remove the parameter from URL
      const newParams = new URLSearchParams(location.search);
      newParams.delete('freshLogin');
      navigate({
        pathname: location.pathname,
        search: newParams.toString()
      }, { replace: true });
    }
  }, [location, navigate, urlParams]);

  // Save steps to localStorage whenever they change
  useEffect(() => {
    if (user && user.id) {
      // Save to user-specific localStorage key
      const userSpecificKey = `portfolio-setup-steps-${user.id}`;
      localStorage.setItem(userSpecificKey, JSON.stringify(steps));
    }
  }, [steps, user]);

  // Save projects to localStorage
  useEffect(() => {
    if (user && user.id) {
      const userProjectsKey = `portfolio-projects-${user.id}`;
      localStorage.setItem(userProjectsKey, JSON.stringify(projects));
    } else {
      localStorage.setItem('portfolio-projects', JSON.stringify(projects));
    }
  }, [projects, user]);

  // Load projects when user changes
  useEffect(() => {
    if (user && user.id) {
      const userProjectsKey = `portfolio-projects-${user.id}`;
      const savedProjects = localStorage.getItem(userProjectsKey);
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      } else {
        setProjects([]);
      }
    }
  }, [user]);

  // Handle file drops for logo
  const logoDropzone = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
      
      toast({
        title: "Logo uploaded",
        description: "Your logo has been uploaded successfully",
      });
    }
  });

  // Handle file drops for project image
  const projectImageDropzone = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      setNewProject({
        ...newProject,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  });

  // Handle domain search
  const handleDomainSearch = async () => {
    if (!domain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain to search",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Check domain availability
      const isAvailable = await checkDomainAvailability(domain);
      setDomainAvailable(isAvailable);
      
      // Generate domain suggestions
      const suggestions = generateDomainSuggestions(domain);
      setDomainSuggestions(suggestions);
      
      // Check availability of suggestions
      const availabilityResults = await checkSuggestionsAvailability(suggestions);
      setSuggestionAvailability(availabilityResults);
      
      if (isAvailable) {
        toast({
          title: "Domain available!",
          description: `${domain} is available for registration.`,
        });
        
        // Mark domain step as completed
        updateStepStatus('domain', true, false);
      } else {
        toast({
          title: "Domain unavailable",
          description: `${domain} is already registered. See our suggestions below.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem checking domain availability",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Update step status
  const updateStepStatus = (stepId: string, completed: boolean, inProgress: boolean) => {
    setSteps(prevSteps => 
      prevSteps.map(step => {
        if (step.id === stepId) {
          return { ...step, completed, inProgress };
        }
        
        // If we're marking a step as in progress, make sure others aren't
        if (inProgress && step.inProgress && step.id !== stepId) {
          return { ...step, inProgress: false };
        }
        
        return step;
      })
    );
  };

  // Handle step action
  const handleStepAction = (stepId: string) => {
    // Mark the selected step as in progress
    setSteps(prevSteps => 
      prevSteps.map(step => ({
        ...step,
        inProgress: step.id === stepId
      }))
    );
    
    // Navigate to appropriate section or take action based on step
    switch (stepId) {
      case 'template':
        setActiveTab('setup');
        break;
      case 'siteType':
        setActiveTab('setup');
        break;
      case 'domain':
        setActiveTab('setup');
        break;
      case 'project':
        setActiveTab('projects');
        break;
      case 'design':
        setActiveTab('design');
        break;
      case 'seo':
        setActiveTab('seo');
        break;
      default:
        break;
    }
  };

  // Add new project
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProject.title || !newProject.description || !newProject.imageFile) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and add an image",
        variant: "destructive"
      });
      return;
    }
    
    // Create new project
    const projectId = Date.now();
    const project = {
      id: projectId,
      title: newProject.title,
      description: newProject.description,
      image: newProject.imagePreview, // Using preview URL for demo
      category: newProject.category,
      url: newProject.url || '#',
    };
    
    // Add to projects list
    setProjects(prev => [...prev, project]);
    
    // Reset form
    setNewProject({
      title: '',
      description: '',
      image: '',
      category: 'Web Design',
      url: '',
      imageFile: null,
      imagePreview: null
    });
    
    // Mark project step as completed if this is the first project
    if (projects.length === 0) {
      updateStepStatus('project', true, false);
    }
    
    toast({
      title: "Project added",
      description: "Your project has been added to your portfolio",
    });
  };

  // Delete a project
  const handleDeleteProject = (id: number) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    
    // If no projects left, mark step as incomplete
    if (projects.length <= 1) {
      updateStepStatus('project', false, true);
    }
    
    toast({
      title: "Project deleted",
      description: "Project has been removed from your portfolio",
    });
  };

  // Save design settings
  const handleSaveDesign = () => {
    if (user && user.id) {
      localStorage.setItem(`portfolio-design-${user.id}`, JSON.stringify(designSettings));
    } else {
      localStorage.setItem('portfolio-design', JSON.stringify(designSettings));
    }
    
    updateStepStatus('design', true, false);
    
    toast({
      title: "Design saved",
      description: "Your design settings have been saved",
    });
  };

  // Save SEO settings
  const handleSaveSeo = () => {
    updateStepStatus('seo', true, false);
    
    toast({
      title: "SEO settings saved",
      description: "Your SEO settings have been applied to your portfolio",
    });
  };

  // Generate preview URL
  const getPreviewUrl = () => {
    // In a real app, this would point to an actual preview
    return '/';
  };

  // Handle site type selection
  const handleSiteTypeSelect = (type: string) => {
    setSiteType(type);
    
    // If we also have a name and description, mark as completed
    if (portfolioName && portfolioDescription) {
      updateStepStatus('siteType', true, false);
    }
  };

  // Handle portfolio info update
  const handleInfoUpdate = () => {
    if (portfolioName && portfolioDescription) {
      updateStepStatus('siteType', true, false);
      
      toast({
        title: "Information updated",
        description: "Your portfolio information has been updated",
      });
    }
  };
  
  // Handle template selection
  const handleTemplateSelect = (template: TemplateProps) => {
    setSelectedTemplate(template);
    updateStepStatus('template', true, false);
    
    toast({
      title: "Template selected",
      description: `You've selected the ${template.name} template`,
    });
  };
  
  // Select a suggested domain
  const handleSelectSuggestion = (suggestion: string) => {
    setDomain(suggestion);
    setDomainAvailable(suggestionAvailability[suggestion] || false);
    
    if (suggestionAvailability[suggestion]) {
      updateStepStatus('domain', true, false);
      
      toast({
        title: "Domain selected",
        description: `${suggestion} has been selected`,
      });
    }
  };

  // Toggle preview mode
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="py-12 portfolio-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {user ? `Welcome back, ${user.name}` : 'Portfolio Setup'}
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete these steps to set up your professional portfolio
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant={showPreview ? "default" : "outline"}
              className="flex items-center gap-2"
              onClick={togglePreview}
            >
              {showPreview ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Preview Site
                </>
              )}
            </Button>
            <Button className="flex items-center gap-2">
              <PenLine className="h-4 w-4" />
              Publish Site
            </Button>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-6 justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium">Free plan</span>
                <Button variant="link" className="text-primary p-0 h-auto ml-1">Compare Plans</Button>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm font-medium">
                  {domainAvailable === true ? domain : 'No domain'}
                </span>
                <Button 
                  variant="link" 
                  className="text-primary p-0 h-auto ml-1"
                  onClick={() => handleStepAction('domain')}
                >
                  {domainAvailable === true ? 'Change' : 'Connect'}
                </Button>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm font-medium">
                  {selectedTemplate ? selectedTemplate.name : 'No template'}
                </span>
                <Button 
                  variant="link" 
                  className="text-primary p-0 h-auto ml-1"
                  onClick={() => handleStepAction('template')}
                >
                  {selectedTemplate ? 'Change' : 'Select'}
                </Button>
              </div>
              
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-1 p-1"
                  onClick={() => handleStepAction('siteType')}
                >
                  <Settings className="h-4 w-4" />
                  Edit Business Info
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className={cn(
          "grid gap-8",
          showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 md:grid-cols-12"
        )}>
          {/* Left sidebar - setup steps (only show when preview is hidden) */}
          {!showPreview && (
            <div className="md:col-span-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Setup Progress</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{completedSteps}/{steps.length} completed</span>
                      <Progress value={completionPercentage} className="w-32 h-2" />
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-8">
                    {steps.map((step) => (
                      <div key={step.id} className={`border rounded-lg p-6 ${step.inProgress ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {step.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className={`font-medium ${step.completed ? 'line-through text-gray-500' : ''}`}>{step.title}</h3>
                              {!step.completed && (
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  className="ml-auto"
                                  onClick={() => handleStepAction(step.id)}
                                >
                                  {step.id === 'template' && 'Choose'}
                                  {step.id === 'project' && 'Add Project'}
                                  {step.id === 'design' && 'Design Site'}
                                  {step.id === 'seo' && 'Optimize'}
                                  {step.id === 'domain' && 'Connect'}
                                  {step.id === 'siteType' && 'Update'}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Main content area */}
          <div className={showPreview ? "" : "md:col-span-8"}>
            <Tabs defaultValue="setup" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="setup">Setup</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>
              
              {/* Setup Tab */}
              <TabsContent value="setup">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-primary" />
                      Choose a Template
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PortfolioTemplates 
                      onSelect={handleTemplateSelect}
                      selectedTemplateId={selectedTemplate?.id}
                    />
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="portfolioName">Portfolio Name</Label>
                        <Input 
                          id="portfolioName" 
                          placeholder="e.g. John's Web Development" 
                          value={portfolioName}
                          onChange={(e) => setPortfolioName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="portfolioDescription">Description</Label>
                        <Textarea 
                          id="portfolioDescription" 
                          placeholder="Write a brief description of your portfolio..." 
                          value={portfolioDescription}
                          onChange={(e) => setPortfolioDescription(e.target.value)}
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <Label className="block mb-2">Portfolio Type</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Button 
                            variant={siteType === 'developer' ? 'default' : 'outline'} 
                            className="justify-start" 
                            onClick={() => handleSiteTypeSelect('developer')}
                          >
                            Developer
                          </Button>
                          <Button 
                            variant={siteType === 'designer' ? 'default' : 'outline'} 
                            className="justify-start" 
                            onClick={() => handleSiteTypeSelect('designer')}
                          >
                            Designer
                          </Button>
                          <Button 
                            variant={siteType === 'photographer' ? 'default' : 'outline'} 
                            className="justify-start" 
                            onClick={() => handleSiteTypeSelect('photographer')}
                          >
                            Photographer
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Upload Logo (optional)</Label>
                        <div 
                          {...logoDropzone.getRootProps()} 
                          className="border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <input {...logoDropzone.getInputProps()} />
                          {logoPreview ? (
                            <div className="flex flex-col items-center">
                              <img src={logoPreview} alt="Logo preview" className="w-40 h-40 object-contain mb-2" />
                              <span className="text-sm text-muted-foreground">Click or drag to replace</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center text-center">
                              <Plus className="h-10 w-10 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Drag & drop your logo here, or click to browse
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button onClick={handleInfoUpdate}>Save Information</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Domain Setup
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Secure a professional domain name for your portfolio. A custom domain helps establish credibility and makes your site easier to find.
                    </p>
                    
                    <div className="mt-4">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <Input 
                            placeholder="yourportfolio.com" 
                            className="pl-9"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            disabled={isSearching}
                          />
                        </div>
                        <Button onClick={handleDomainSearch} disabled={isSearching}>
                          {isSearching ? "Searching..." : "Check Availability"}
                        </Button>
                      </div>
                      
                      {domainAvailable === true && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <p className="text-green-700">
                            <span className="font-medium">{domain}</span> is available! Click to register.
                          </p>
                          <Button size="sm" className="ml-auto">Register Domain</Button>
                        </div>
                      )}
                      
                      {domainAvailable === false && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                          <X className="h-5 w-5 text-red-500" />
                          <p className="text-red-700">
                            <span className="font-medium">{domain}</span> is not available. Try a different domain.
                          </p>
                        </div>
                      )}
                      
                      {/* Domain suggestions */}
                      {domainAvailable === false && domainSuggestions.length > 0 && (
                        <div className="mt-6">
                          <h3 className="text-md font-medium mb-3">Available alternatives:</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {domainSuggestions.map((suggestion) => (
                              <div 
                                key={suggestion}
                                className={cn(
                                  "border rounded-lg p-3 flex items-center justify-between cursor-pointer transition-colors",
                                  suggestionAvailability[suggestion] 
                                    ? "hover:bg-green-50" 
                                    : "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => suggestionAvailability[suggestion] && handleSelectSuggestion(suggestion)}
                              >
                                <span className="font-medium">{suggestion}</span>
                                {suggestionAvailability[suggestion] ? (
                                  <Button size="sm" variant="outline">Select</Button>
                                ) : (
                                  <span className="text-xs text-red-500">Unavailable</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Projects Tab */}
              <TabsContent value="projects">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Add New Project</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddProject} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="projectTitle">Project Title</Label>
                        <Input 
                          id="projectTitle" 
                          placeholder="e.g. E-commerce Website"
                          value={newProject.title}
                          onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="projectDesc">Description</Label>
                        <Textarea 
                          id="projectDesc" 
                          placeholder="Describe your project..."
                          value={newProject.description}
                          onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                          required
                          rows={3}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="projectCategory">Category</Label>
                          <select 
                            id="projectCategory"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={newProject.category}
                            onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                          >
                            <option>Web Design</option>
                            <option>UI/UX</option>
                            <option>Mobile App</option>
                            <option>Graphic Design</option>
                            <option>Photography</option>
                            <option>Illustration</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="projectUrl">Project URL (optional)</Label>
                          <Input 
                            id="projectUrl" 
                            placeholder="https://example.com"
                            value={newProject.url}
                            onChange={(e) => setNewProject({...newProject, url: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Project Image</Label>
                        <div 
                          {...projectImageDropzone.getRootProps()} 
                          className="border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <input {...projectImageDropzone.getInputProps()} />
                          {newProject.imagePreview ? (
                            <div className="flex flex-col items-center">
                              <img src={newProject.imagePreview} alt="Project preview" className="h-48 object-contain mb-2" />
                              <span className="text-sm text-muted-foreground">Click or drag to replace</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center text-center">
                              <Plus className="h-10 w-10 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Drag & drop a project image here, or click to browse
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full">Add Project</Button>
                    </form>
                  </CardContent>
                </Card>
                
                {/* Projects List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Your Projects ({projects.length})</span>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs flex items-center gap-1"
                          onClick={() => projects.length > 0 && setProjects([])}
                          disabled={projects.length === 0}
                        >
                          <Trash2 className="h-3 w-3" />
                          Clear All
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs flex items-center gap-1"
                          onClick={() => setActiveTab('design')}
                        >
                          <ArrowRight className="h-3 w-3" />
                          Next: Design
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {projects.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-muted-foreground">No projects added yet. Add your first project above.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.map((project: any) => (
                          <div key={project.id} className="border rounded-lg overflow-hidden group relative">
                            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteProject(project.id)}
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Move className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="aspect-video bg-gray-100 relative">
                              <img 
                                src={project.image} 
                                alt={project.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-3">
                              <h3 className="font-medium line-clamp-1">{project.title}</h3>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {project.description}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                  {project.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Design Tab */}
              <TabsContent value="design">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-primary" />
                      Design Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex items-center gap-3">
                          <input 
                            type="color" 
                            id="primaryColor"
                            value={designSettings.primaryColor}
                            onChange={(e) => setDesignSettings({...designSettings, primaryColor: e.target.value})}
                            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
                          />
                          <Input 
                            value={designSettings.primaryColor}
                            onChange={(e) => setDesignSettings({...designSettings, primaryColor: e.target.value})}
                            className="w-32"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <div className="flex items-center gap-3">
                          <input 
                            type="color" 
                            id="secondaryColor"
                            value={designSettings.secondaryColor}
                            onChange={(e) => setDesignSettings({...designSettings, secondaryColor: e.target.value})}
                            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
                          />
                          <Input 
                            value={designSettings.secondaryColor}
                            onChange={(e) => setDesignSettings({...designSettings, secondaryColor: e.target.value})}
                            className="w-32"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="font">Font</Label>
                        <select 
                          id="font"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={designSettings.font}
                          onChange={(e) => setDesignSettings({...designSettings, font: e.target.value})}
                        >
                          <option>Inter</option>
                          <option>Roboto</option>
                          <option>Open Sans</option>
                          <option>Montserrat</option>
                          <option>Playfair Display</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label className="block mb-3">Sections</Label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border rounded-lg p-3">
                            <span>Hero Section</span>
                            <input 
                              type="checkbox" 
                              checked={designSettings.showHero}
                              onChange={(e) => setDesignSettings({...designSettings, showHero: e.target.checked})}
                              className="h-4 w-4"
                            />
                          </div>
                          <div className="flex items-center justify-between border rounded-lg p-3">
                            <span>Projects Section</span>
                            <input 
                              type="checkbox" 
                              checked={designSettings.showProjects}
                              onChange={(e) => setDesignSettings({...designSettings, showProjects: e.target.checked})}
                              className="h-4 w-4"
                            />
                          </div>
                          <div className="flex items-center justify-between border rounded-lg p-3">
                            <span>About Section</span>
                            <input 
                              type="checkbox" 
                              checked={designSettings.showAbout}
                              onChange={(e) => setDesignSettings({...designSettings, showAbout: e.target.checked})}
                              className="h-4 w-4"
                            />
                          </div>
                          <div className="flex items-center justify-between border rounded-lg p-3">
                            <span>Contact Section</span>
                            <input 
                              type="checkbox" 
                              checked={designSettings.showContact}
                              onChange={(e) => setDesignSettings({...designSettings, showContact: e.target.checked})}
                              className="h-4 w-4"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveTab('projects')}
                        >
                          Back to Projects
                        </Button>
                        <Button 
                          onClick={handleSaveDesign}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Save Design Settings
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      <div 
                        className="h-96 flex items-center justify-center" 
                        style={{
                          backgroundColor: designSettings.primaryColor,
                          color: '#fff',
                          fontFamily: designSettings.font
                        }}
                      >
                        <div className="text-center max-w-md px-4">
                          {logoPreview && (
                            <div className="mb-4 flex justify-center">
                              <img src={logoPreview} alt="Logo" className="h-20 object-contain" />
                            </div>
                          )}
                          <h2 className="text-2xl font-bold mb-2">
                            {portfolioName || 'Your Portfolio'}
                          </h2>
                          <p className="max-w-md mx-auto">
                            {portfolioDescription || 'A showcase of my professional work and skills'}
                          </p>
                          <Button 
                            className="mt-4"
                            style={{backgroundColor: designSettings.secondaryColor}}
                          >
                            View Projects
                          </Button>
                        </div>
                      </div>
                      
                      {/* Projects Preview */}
                      {designSettings.showProjects && projects.length > 0 && (
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-4 text-center">Projects</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {projects.slice(0, 2).map((project: any) => (
                              <div key={project.id} className="border rounded-lg overflow-hidden">
                                <div className="aspect-video bg-gray-100">
                                  <img 
                                    src={project.image} 
                                    alt={project.title} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="p-3">
                                  <h4 className="font-medium">{project.title}</h4>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex justify-center">
                      <Button 
                        onClick={togglePreview}
                        className="flex items-center gap-2"
                      >
                        <Presentation className="h-4 w-4" />
                        View Full Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* SEO Tab */}
              <TabsContent value="seo">
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="seoTitle">SEO Title</Label>
                        <Input 
                          id="seoTitle" 
                          placeholder="Portfolio | Your Name" 
                          defaultValue={portfolioName ? `${portfolioName} | Portfolio` : ''}
                        />
                        <p className="text-xs text-muted-foreground">
                          The title that appears in search engines (50-60 characters recommended)
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="seoDescription">Meta Description</Label>
                        <Textarea 
                          id="seoDescription" 
                          placeholder="A brief description of your portfolio for search engines"
                          defaultValue={portfolioDescription || ''}
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                          A brief summary that appears in search results (150-160 characters recommended)
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="seoKeywords">Keywords</Label>
                        <Input 
                          id="seoKeywords" 
                          placeholder="portfolio, design, web development, etc." 
                        />
                        <p className="text-xs text-muted-foreground">
                          Comma-separated keywords related to your portfolio
                        </p>
                      </div>
                      
                      <div className="pt-4">
                        <Button onClick={handleSaveSeo}>Save SEO Settings</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Site Preview Panel */}
          {showPreview && (
            <div className="sticky top-24 h-[calc(100vh-100px)]">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-2 flex-shrink-0">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      Live Preview
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={togglePreview}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-grow overflow-auto">
                  <iframe 
                    className="w-full h-full border-0" 
                    src={getPreviewUrl()}
                    title="Portfolio Preview"
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PortfolioSetup;
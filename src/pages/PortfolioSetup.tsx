import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PortfolioTemplates, { TemplateProps } from '@/components/PortfolioTemplates';
import DraggablePortfolio from '@/components/DraggablePortfolio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { 
  BookOpen, ChevronRight, Eye, FileText, Globe, 
  Layout, Palette, Plus, Save, Settings2, Upload 
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Step types
type StepStatus = "not-started" | "in-progress" | "completed";

interface Step {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
  icon: React.ElementType;
}

// Define the structure of the portfolio state
interface PortfolioState {
  title: string;
  description: string;
  contactEmail: string;
  domain: string;
  socialLinks: {
    twitter: string;
    github: string;
    linkedin: string;
  };
  template: string;
  projects: any[];
  isPublished: boolean;
}

const PortfolioSetup: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateProps | null>(null);
  const [activeTab, setActiveTab] = useState("templates");
  const [currentStep, setCurrentStep] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);
  const [portfolio, setPortfolio] = useState<PortfolioState>({
    title: "",
    description: "",
    contactEmail: "",
    domain: "",
    socialLinks: {
      twitter: "",
      github: "",
      linkedin: "",
    },
    template: "",
    projects: [],
    isPublished: false,
  });

  // Set up steps
  const steps: Step[] = [
    {
      id: "template",
      title: "Choose Template",
      description: "Select a design template for your portfolio website",
      status: "not-started",
      icon: Layout,
    },
    {
      id: "info",
      title: "Basic Information",
      description: "Add your personal info and social links",
      status: "not-started",
      icon: FileText,
    },
    {
      id: "projects",
      title: "Add Projects",
      description: "Showcase your work with projects",
      status: "not-started",
      icon: BookOpen,
    },
    {
      id: "publish",
      title: "Publish Website",
      description: "Review and publish your portfolio",
      status: "not-started",
      icon: Globe,
    },
  ];

  // Check auth status and load saved data
  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    // Load saved portfolio data
    const savedPortfolio = localStorage.getItem('portfolioData');
    if (savedPortfolio) {
      try {
        const parsedData = JSON.parse(savedPortfolio);
        setPortfolio(parsedData);
        
        // Set template if exists
        if (parsedData.template) {
          const templateObject = {
            id: parsedData.template,
            name: parsedData.template.charAt(0).toUpperCase() + parsedData.template.slice(1),
            description: "",
            image: "",
            isPremium: false,
          };
          setSelectedTemplate(templateObject);
        }
        
        // Calculate progress
        calculateProgress(parsedData);
      } catch (e) {
        console.error('Error parsing saved portfolio data', e);
      }
    }
  }, []);

  // Calculate setup progress
  const calculateProgress = (data: PortfolioState) => {
    let completed = 0;
    
    // Check template selection
    if (data.template) completed++;
    
    // Check basic info
    if (data.title && data.description) completed++;
    
    // Check projects
    if (data.projects && data.projects.length > 0) completed++;
    
    // Check publishing status
    if (data.isPublished) completed++;
    
    const progress = Math.floor((completed / steps.length) * 100);
    setSetupProgress(progress);
    
    // Update current step
    setCurrentStep(Math.min(completed, steps.length - 1));
  };

  // Handle template selection
  const handleTemplateSelect = (template: TemplateProps) => {
    setSelectedTemplate(template);
    
    // Update portfolio data
    const updatedPortfolio = {
      ...portfolio,
      template: template.id,
    };
    
    setPortfolio(updatedPortfolio);
    localStorage.setItem('portfolioData', JSON.stringify(updatedPortfolio));
    
    // Update progress
    calculateProgress(updatedPortfolio);
    
    // Move to next step
    setActiveTab("setup");
    toast({
      title: "Template Selected",
      description: `You've selected the ${template.name} template.`,
    });
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      if (parent === 'socialLinks') {
        setPortfolio({
          ...portfolio,
          socialLinks: {
            ...portfolio.socialLinks,
            [child]: value,
          },
        });
      } else {
        // For other potential nested properties, handle them safely
        const updatedPortfolio = { ...portfolio };
        
        // Type assertion to ensure we can safely access and modify the property
        // This is safer than directly spreading an unknown property
        if (parent in updatedPortfolio) {
          const parentObj = updatedPortfolio[parent as keyof PortfolioState];
          
          // Only attempt to update if the parent is an object
          if (parentObj && typeof parentObj === 'object' && !Array.isArray(parentObj)) {
            // Update the nested property safely
            // Casting to any is necessary to handle the dynamic property access
            (updatedPortfolio[parent as keyof PortfolioState] as any)[child] = value;
          }
        }
        
        setPortfolio(updatedPortfolio);
      }
    } else {
      setPortfolio({
        ...portfolio,
        [name]: value,
      });
    }
  };

  // Save portfolio data
  const savePortfolio = () => {
    localStorage.setItem('portfolioData', JSON.stringify(portfolio));
    calculateProgress(portfolio);
    
    toast({
      title: "Progress Saved",
      description: "Your portfolio setup progress has been saved.",
    });
    
    if (activeTab === "setup" && currentStep === 1) {
      setActiveTab("projects");
    }
  };

  // Add new project
  const addProject = () => {
    const newProject = {
      id: uuidv4(),
      title: "New Project",
      description: "Project description goes here",
      images: [],
      links: {
        demo: "",
        github: "",
      },
      tags: [],
      category: "Other",
    };
    
    const updatedProjects = [...portfolio.projects, newProject];
    const updatedPortfolio = {
      ...portfolio,
      projects: updatedProjects,
    };
    
    setPortfolio(updatedPortfolio);
    localStorage.setItem('portfolioData', JSON.stringify(updatedPortfolio));
    calculateProgress(updatedPortfolio);
    
    toast({
      title: "Project Added",
      description: "New project has been added to your portfolio.",
    });
  };

  // Handle project reordering
  const handleProjectReorder = (reorderedProjects: any[]) => {
    const updatedPortfolio = {
      ...portfolio,
      projects: reorderedProjects,
    };
    
    setPortfolio(updatedPortfolio);
    localStorage.setItem('portfolioData', JSON.stringify(updatedPortfolio));
    
    toast({
      title: "Projects Reordered",
      description: "Your project order has been updated.",
    });
  };

  // Edit project
  const editProject = (project: any) => {
    // For simplicity, just show a toast for now
    toast({
      title: "Edit Project",
      description: `Editing "${project.title}" project.`,
    });
    
    // In a real app, you'd open a modal or navigate to an edit page
    navigate('/projects');
  };

  // Delete project
  const deleteProject = (projectId: string) => {
    const updatedProjects = portfolio.projects.filter(project => project.id !== projectId);
    const updatedPortfolio = {
      ...portfolio,
      projects: updatedProjects,
    };
    
    setPortfolio(updatedPortfolio);
    localStorage.setItem('portfolioData', JSON.stringify(updatedPortfolio));
    calculateProgress(updatedPortfolio);
    
    toast({
      title: "Project Deleted",
      description: "Project has been removed from your portfolio.",
    });
  };

  // View project
  const viewProject = (project: any) => {
    toast({
      title: "View Project",
      description: `Viewing "${project.title}" project.`,
    });
    
    // In a real app, you'd open a modal or navigate to a view page
  };

  // Publish portfolio
  const publishPortfolio = () => {
    const updatedPortfolio = {
      ...portfolio,
      isPublished: true,
    };
    
    setPortfolio(updatedPortfolio);
    localStorage.setItem('portfolioData', JSON.stringify(updatedPortfolio));
    calculateProgress(updatedPortfolio);
    
    toast({
      title: "Portfolio Published!",
      description: "Your portfolio website is now live and accessible online.",
    });
  };

  // Render progress steps
  const renderProgress = () => {
    return (
      <div className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Setup Progress</h3>
          <span className="text-sm text-muted-foreground">{setupProgress}% complete</span>
        </div>
        <Progress value={setupProgress} className="h-2" />
        
        <div className="mt-6 space-y-4">
          {steps.map((step, index) => {
            // Determine step status
            let status: StepStatus = "not-started";
            if (index < currentStep) status = "completed";
            else if (index === currentStep) status = "in-progress";
            
            return (
              <div 
                key={step.id}
                className={cn(
                  "flex items-start p-3 rounded-md transition-all",
                  status === "completed" && "bg-green-50",
                  status === "in-progress" && "bg-blue-50",
                  status === "not-started" && "bg-gray-50"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full shrink-0",
                  status === "completed" && "bg-green-100 text-green-600",
                  status === "in-progress" && "bg-blue-100 text-blue-600",
                  status === "not-started" && "bg-gray-100 text-gray-500"
                )}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                <div>
                  {status === "completed" && (
                    <div className="text-green-600 font-medium text-sm">Completed</div>
                  )}
                  {status === "in-progress" && (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => {
                        // Navigate to the appropriate tab based on the step
                        if (step.id === "template") setActiveTab("templates");
                        else if (step.id === "info") setActiveTab("setup");
                        else if (step.id === "projects") setActiveTab("projects");
                        else if (step.id === "publish") setActiveTab("publish");
                      }}
                    >
                      Start
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="portfolio-container">
          <div className="text-center mb-10">
            <h1 className="section-title flex items-center justify-center gap-2">
              <Layout className="h-6 w-6" />
              Portfolio Setup
            </h1>
            <p className="section-subtitle mx-auto">
              Create your professional portfolio website in minutes. Choose a template, add your projects, and publish your site.
            </p>
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 w-full max-w-md mx-auto justify-center">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="setup">Basic Setup</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="publish">Publish</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="animate-fade-in">
              <div className="max-w-3xl mx-auto">
                {renderProgress()}
                
                <div className="flex justify-center mt-8">
                  <Button onClick={() => setActiveTab(steps[currentStep].id === "template" ? "templates" : "setup")} className="gap-2">
                    Continue Setup <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="templates" className="animate-fade-in">
              <PortfolioTemplates onSelect={handleTemplateSelect} selectedTemplateId={selectedTemplate?.id} />
            </TabsContent>
            
            <TabsContent value="setup" className="animate-fade-in">
              <div className="max-w-2xl mx-auto space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Basic Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium mb-1">Portfolio Title</label>
                      <input
                        id="title"
                        name="title"
                        value={portfolio.title}
                        onChange={handleInputChange}
                        placeholder="John Doe's Portfolio"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium mb-1">Portfolio Description</label>
                      <textarea
                        id="description"
                        name="description"
                        value={portfolio.description}
                        onChange={handleInputChange}
                        placeholder="Full stack developer specializing in React and Node.js"
                        className="w-full p-2 border rounded-md h-24"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="contactEmail" className="block text-sm font-medium mb-1">Contact Email</label>
                      <input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={portfolio.contactEmail}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Social Links</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="socialLinks.twitter" className="block text-sm font-medium mb-1">Twitter</label>
                      <input
                        id="socialLinks.twitter"
                        name="socialLinks.twitter"
                        value={portfolio.socialLinks.twitter}
                        onChange={handleInputChange}
                        placeholder="https://twitter.com/yourusername"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="socialLinks.github" className="block text-sm font-medium mb-1">GitHub</label>
                      <input
                        id="socialLinks.github"
                        name="socialLinks.github"
                        value={portfolio.socialLinks.github}
                        onChange={handleInputChange}
                        placeholder="https://github.com/yourusername"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="socialLinks.linkedin" className="block text-sm font-medium mb-1">LinkedIn</label>
                      <input
                        id="socialLinks.linkedin"
                        name="socialLinks.linkedin"
                        value={portfolio.socialLinks.linkedin}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/yourusername"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setActiveTab("templates")}>Back</Button>
                  <Button onClick={savePortfolio} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save & Continue
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="projects" className="animate-fade-in">
              <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Portfolio Projects</h3>
                  </div>
                  
                  <Button onClick={addProject} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Project
                  </Button>
                </div>
                
                <DraggablePortfolio 
                  projects={portfolio.projects}
                  onReorder={handleProjectReorder}
                  onEdit={editProject}
                  onDelete={deleteProject}
                  onView={viewProject}
                />
                
                <div className="mt-8 text-center text-sm text-muted-foreground">
                  <p>Drag and drop projects to reorder them in your portfolio</p>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setActiveTab("setup")}>Back</Button>
                  <Button onClick={() => {
                    savePortfolio();
                    setActiveTab("publish");
                  }} className="gap-2">
                    Continue to Publish <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="publish" className="animate-fade-in">
              <div className="max-w-2xl mx-auto space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Preview Your Portfolio</h3>
                  </div>
                  
                  <div className="aspect-video bg-gray-100 rounded-lg border overflow-hidden">
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-lg font-medium text-gray-500 mb-4">Portfolio Preview</p>
                        <Button className="gap-2">
                          <Eye className="h-4 w-4" />
                          View Full Preview
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Publishing Options</h3>
                  </div>
                  
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label htmlFor="domain" className="block text-sm font-medium mb-1">Custom Domain (Optional)</label>
                      <input
                        id="domain"
                        name="domain"
                        value={portfolio.domain}
                        onChange={handleInputChange}
                        placeholder="yourname.com"
                        className="w-full p-2 border rounded-md"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Leave blank to use our free subdomain</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("projects")}>Back</Button>
                  <Button 
                    onClick={publishPortfolio} 
                    disabled={portfolio.isPublished}
                    className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Upload className="h-4 w-4" />
                    {portfolio.isPublished ? "Published" : "Publish Portfolio"}
                  </Button>
                </div>
                
                {portfolio.isPublished && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-green-700 font-medium">Your portfolio is published and live!</p>
                    <p className="text-sm text-green-600 mt-1">
                      {portfolio.domain 
                        ? `View at ${portfolio.domain}` 
                        : 'View your portfolio on our platform'}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default PortfolioSetup;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResumeBuilder from '@/components/ResumeBuilder';
import ResumePreview from '@/components/ResumePreview';
import ResumeTemplates, { ResumeTemplateProps } from '@/components/ResumeTemplates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { FileText, Download, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Resume = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
  });
  
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplateProps | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#3399ff');

  // Check auth status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    // Load saved resume data from localStorage if available
    const savedResumeData = localStorage.getItem('resumeData');
    if (savedResumeData) {
      try {
        setResumeData(JSON.parse(savedResumeData));
      } catch (e) {
        console.error('Error parsing saved resume data', e);
      }
    }
    
    // Load saved template/color preferences if available
    const savedTemplate = localStorage.getItem('resumeTemplate');
    const savedColor = localStorage.getItem('resumeColor');
    
    if (savedTemplate) {
      try {
        setSelectedTemplate(JSON.parse(savedTemplate));
      } catch (e) {
        console.error('Error parsing saved template', e);
      }
    }
    
    if (savedColor) {
      setSelectedColor(savedColor);
    }
  }, []);

  // Save resume data to localStorage when it changes
  useEffect(() => {
    if (Object.keys(resumeData.personalInfo).some(key => resumeData.personalInfo[key] !== '')) {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
    }
    
    // Save template and color preferences
    if (selectedTemplate) {
      localStorage.setItem('resumeTemplate', JSON.stringify(selectedTemplate));
    }
    
    if (selectedColor) {
      localStorage.setItem('resumeColor', selectedColor);
    }
  }, [resumeData, selectedTemplate, selectedColor]);

  const handleTemplateSelect = (template: ResumeTemplateProps) => {
    setSelectedTemplate(template);
    toast({
      title: "Template Selected",
      description: `You've selected the ${template.name} template.`,
    });
    setActiveTab('editor');
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    toast({
      title: "Color Selected",
      description: "Resume color theme updated.",
    });
  };

  const handleDownload = () => {
    // This function is now directly handled by the ResumePreview component
    const previewComponent = document.getElementById('resume-preview-content');
    if (!previewComponent) {
      toast({
        title: "Download Error",
        description: "Unable to generate resume. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Download Started",
        description: "Your resume PDF is being prepared for download.",
      });
    }
  };

  const handleLoginPrompt = () => {
    navigate('/login');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="portfolio-container">
            <div className="text-center mb-10 animate-fade-in">
              <h1 className="section-title flex items-center justify-center gap-2">
                <FileText className="h-6 w-6" />
                Resume Builder
              </h1>
              <p className="section-subtitle mx-auto">
                Create a professional resume with our easy-to-use builder. Choose a template, customize your content, and download your resume.
              </p>
            </div>
            
            <Card className="max-w-md mx-auto animate-scale-in">
              <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                <LogIn className="h-12 w-12 text-primary" />
                <h2 className="text-xl font-semibold">Login Required</h2>
                <p className="text-center text-muted-foreground">
                  Please login or register to access our professional resume builder tool and save your progress.
                </p>
                <div className="flex gap-4">
                  <Button onClick={handleLoginPrompt} className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/register')}>
                    Register
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Preview of templates */}
            <div className="mt-16 pt-6 border-t">
              <h2 className="text-xl font-semibold text-center mb-8">Available Resume Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-[3/4] bg-gray-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="w-full max-w-[80%] bg-white shadow-sm rounded-sm p-4">
                          <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 w-40 bg-gray-100 rounded mb-4"></div>
                          <div className="space-y-1">
                            <div className="h-2 bg-gray-100 rounded"></div>
                            <div className="h-2 bg-gray-100 rounded"></div>
                            <div className="h-2 w-3/4 bg-gray-100 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-white">
                      <div className="flex justify-between">
                        <span className="font-medium">Template {i}</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Free</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="portfolio-container">
          <div className="text-center mb-10 animate-on-scroll">
            <h1 className="section-title flex items-center justify-center gap-2">
              <FileText className="h-6 w-6" />
              Resume Builder
            </h1>
            <p className="section-subtitle mx-auto">
              Create a professional resume with our easy-to-use builder. Choose a template, customize your content, and download your resume.
            </p>
          </div>
          
          <Tabs defaultValue="templates" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 w-full max-w-md mx-auto justify-center">
              <TabsTrigger value="templates">Choose Template</TabsTrigger>
              <TabsTrigger value="editor">Edit Content</TabsTrigger>
              <TabsTrigger value="preview">Preview & Download</TabsTrigger>
            </TabsList>
            
            <TabsContent value="templates">
              <ResumeTemplates 
                onSelect={handleTemplateSelect} 
                selectedTemplateId={selectedTemplate?.id}
                onColorSelect={handleColorSelect}
                selectedColor={selectedColor}
              />
            </TabsContent>
            
            <TabsContent value="editor">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <ResumeBuilder resumeData={resumeData} setResumeData={setResumeData} />
                  
                  <div className="mt-6 flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab('templates')}
                    >
                      Back to Templates
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('preview')}
                    >
                      Preview Resume
                    </Button>
                  </div>
                </div>
                
                <div className="hidden lg:block">
                  <div className="sticky top-24">
                    <div className="border rounded-lg shadow-sm p-4 bg-white">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        Live Preview
                      </h3>
                      <div className="border rounded bg-white p-2 shadow-inner transition-all hover:shadow-md">
                        <ResumePreview 
                          resumeData={resumeData} 
                          selectedTemplate={selectedTemplate ? selectedTemplate.id : undefined}
                          selectedColor={selectedColor}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="py-4">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg border overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <ResumePreview 
                    resumeData={resumeData} 
                    selectedTemplate={selectedTemplate ? selectedTemplate.id : undefined}
                    selectedColor={selectedColor}
                    downloadable={true}
                  />
                </div>
                
                <div className="mt-8 flex justify-center">
                  <Button 
                    className="flex items-center gap-2 px-6 py-6 h-auto shadow-md hover:shadow-lg transition-all" 
                    onClick={handleDownload}
                  >
                    <Download className="h-5 w-5" />
                    Download PDF
                  </Button>
                </div>
                
                <div className="mt-4 flex justify-center gap-4">
                  <Button 
                    variant="outline" 
                    className="shadow-sm"
                    onClick={() => setActiveTab('templates')}
                  >
                    Change Template
                  </Button>
                  <Button 
                    variant="outline" 
                    className="shadow-sm"
                    onClick={() => setActiveTab('editor')}
                  >
                    Edit Content
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Resume;
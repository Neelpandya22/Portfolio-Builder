import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Image, Trash2, Edit, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  url: string;
  createdAt: string;
}

const Projects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<Omit<Project, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    image: '',
    category: 'Web Design',
    url: '',
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);

  const categories = ["Web Design", "Mobile App", "UI/UX", "Graphic Design", "Other"];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login', { replace: true });
      return;
    }
    
    setUser(JSON.parse(userData));
    setIsAuthenticated(true);
    
    const savedProjects = localStorage.getItem('userProjects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    
    setIsLoading(false);
    
    setTimeout(() => {
      setAnimateIn(true);
    }, 100);
  }, [navigate]);

  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('userProjects', JSON.stringify(projects));
    }
  }, [projects]);

  const handleAddProject = () => {
    if (!newProject.title || !newProject.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const project: Project = {
      ...newProject,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setProjects([...projects, project]);
    setNewProject({
      title: '',
      description: '',
      image: '',
      category: 'Web Design',
      url: '',
    });
    setIsAddDialogOpen(false);

    toast({
      title: "Project Added",
      description: "Your project has been added successfully",
    });
  };

  const handleUpdateProject = () => {
    if (!editingProject) return;

    setProjects(projects.map(p => 
      p.id === editingProject.id ? editingProject : p
    ));
    setEditingProject(null);

    toast({
      title: "Project Updated",
      description: "Your project has been updated successfully",
    });
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    
    toast({
      title: "Project Deleted",
      description: "Your project has been deleted",
    });
  };

  const filteredProjects = activeTab === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeTab);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="py-16 bg-gradient-to-b from-white to-gray-50 animate-fade-in">
          <div className="portfolio-container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
            
            <Skeleton className="h-12 w-full max-w-md mb-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="portfolio-container">
          <div className={cn(
            "flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4",
            "transition-all duration-300",
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div>
              <h1 className="text-3xl font-bold mb-2">My Projects</h1>
              <p className="text-muted-foreground">
                Welcome, {user?.name}! Manage your portfolio projects here.
              </p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-black hover:bg-black/90 text-white">
                  <Plus size={16} />
                  Add New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                  <DialogDescription>
                    Add the details of your project below
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input 
                      id="title" 
                      value={newProject.title}
                      onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                      placeholder="My Awesome Project"
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category *</Label>
                    <select 
                      id="category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-200 focus:ring-2 focus:ring-primary/30 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newProject.category}
                      onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea 
                      id="description" 
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      placeholder="Describe your project"
                      rows={3}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">Image URL</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="image" 
                        value={newProject.image}
                        onChange={(e) => setNewProject({...newProject, image: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
                      />
                      <Button size="icon" variant="outline">
                        <Image size={16} />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter a URL or upload an image for your project
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="url">Project URL</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="url" 
                        value={newProject.url}
                        onChange={(e) => setNewProject({...newProject, url: e.target.value})}
                        placeholder="https://example.com"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
                      />
                      <Button size="icon" variant="outline">
                        <LinkIcon size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddProject} className="bg-black hover:bg-black/90 text-white">Add Project</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Edit Project</DialogTitle>
                  <DialogDescription>
                    Update the details of your project
                  </DialogDescription>
                </DialogHeader>
                {editingProject && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-title">Project Title *</Label>
                      <Input 
                        id="edit-title" 
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-category">Category *</Label>
                      <select 
                        id="edit-category"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-200 focus:ring-2 focus:ring-primary/30 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={editingProject.category}
                        onChange={(e) => setEditingProject({...editingProject, category: e.target.value})}
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-description">Description *</Label>
                      <Textarea 
                        id="edit-description" 
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                        rows={3}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-image">Image URL</Label>
                      <Input 
                        id="edit-image" 
                        value={editingProject.image}
                        onChange={(e) => setEditingProject({...editingProject, image: e.target.value})}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-url">Project URL</Label>
                      <Input 
                        id="edit-url" 
                        value={editingProject.url}
                        onChange={(e) => setEditingProject({...editingProject, url: e.target.value})}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingProject(null)}>Cancel</Button>
                  <Button onClick={handleUpdateProject} className="bg-black hover:bg-black/90 text-white">Update Project</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className={cn(
            "w-full transition-all duration-300",
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )} style={{ transitionDelay: "100ms" }}>
            <TabsList className="mb-8">
              <TabsTrigger value="all">All Projects</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              {filteredProjects.length === 0 ? (
                <Card className="border-dashed animate-fade-in">
                  <CardContent className="pt-10 pb-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Image className="h-12 w-12 text-muted-foreground/50" />
                      <h3 className="text-lg font-semibold">No projects found</h3>
                      <p className="text-muted-foreground">
                        {activeTab === 'all'
                          ? "You haven't added any projects yet."
                          : `You haven't added any ${activeTab} projects yet.`}
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setIsAddDialogOpen(true)}
                      >
                        <Plus size={16} className="mr-2" />
                        Add Your First Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project, index) => (
                    <Card 
                      key={project.id} 
                      className={cn(
                        "overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
                        animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      )}
                      style={{ transitionDelay: `${150 + index * 50}ms`, transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                    >
                      <div className="aspect-video relative overflow-hidden bg-gray-100">
                        {project.image ? (
                          <img 
                            src={project.image} 
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Image className="h-10 w-10 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Button 
                            size="icon" 
                            variant="secondary" 
                            className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
                            onClick={() => setEditingProject(project)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="destructive" 
                            className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-red-100"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold truncate">{project.title}</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {project.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {project.description}
                        </p>
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary flex items-center hover:underline"
                          >
                            Visit Project <ExternalLink size={12} className="ml-1" />
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Projects;
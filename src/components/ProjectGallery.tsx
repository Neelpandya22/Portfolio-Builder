import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import ProjectCard, { ProjectProps } from './ProjectCard';
import { Button } from '@/components/ui/button';
import { Plus, FolderPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../lib/api.mjs';

// Sample project data for non-logged in users
const sampleProjects = [
  {
    id: 1,
    title: "Minimalist Portfolio",
    description: "A clean, modern portfolio design with a focus on typography and whitespace.",
    image: "https://images.unsplash.com/photo-1551739440-5dd934d3a94a?q=80&w=1024&auto=format&fit=crop",
    category: "Web Design",
    url: "#",
  },
  {
    id: 2,
    title: "E-commerce Dashboard",
    description: "An intuitive dashboard for managing online store operations and analytics.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1024&auto=format&fit=crop",
    category: "UI/UX",
    url: "#",
  },
  {
    id: 3,
    title: "Travel Blog",
    description: "A visually-rich blog design perfect for showcasing travel photography and stories.",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1024&auto=format&fit=crop",
    category: "Web Design",
    url: "#",
  },
  {
    id: 4,
    title: "Mobile Fitness App",
    description: "A health-tracking application with a focus on clean data visualization.",
    image: "https://images.unsplash.com/photo-1593429736389-d3bbe239b27c?q=80&w=1024&auto=format&fit=crop",
    category: "Mobile App",
    url: "#",
  },
  {
    id: 5,
    title: "Restaurant Website",
    description: "An elegant website design for a high-end restaurant with online reservation system.",
    image: "https://images.unsplash.com/photo-1593584785033-9c7604d0863f?q=80&w=1024&auto=format&fit=crop",
    category: "Web Design",
    url: "#",
  },
  {
    id: 6,
    title: "Music Streaming Interface",
    description: "A modern interface for a music streaming platform with dark mode and personalization features.",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1024&auto=format&fit=crop",
    category: "UI/UX",
    url: "#",
  }
];

const ProjectGallery: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [titleVisible, setTitleVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);

  // Check if user is logged in
  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated();
    setIsLoggedIn(isAuthenticated);

    // If logged in, try to get user projects from localStorage
    if (isAuthenticated) {
      const savedProjects = localStorage.getItem('userProjects');
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects);
        setUserProjects(parsedProjects);
        setAllProjects(parsedProjects);
      } else {
        setAllProjects([]); // Empty for logged in users with no projects
      }
    } else {
      // Not logged in, use sample projects
      setAllProjects(sampleProjects);
    }
  }, []);

  // Get unique categories from projects
  const categories = ['All', ...Array.from(new Set(allProjects.map(project => 
    typeof project.category === 'string' ? project.category : 'Other'
  )))];

  useEffect(() => {
    // Filter projects based on selected category
    if (selectedCategory === 'All') {
      setFilteredProjects(allProjects);
    } else {
      setFilteredProjects(allProjects.filter(project => project.category === selectedCategory));
    }
  }, [selectedCategory, allProjects]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTitleVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const title = document.getElementById('projects-title');
    if (title) {
      observer.observe(title);
    }

    return () => {
      if (title) {
        observer.unobserve(title);
      }
    };
  }, []);

  const handleAddProject = () => {
    navigate('/projects');
  };

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="portfolio-container">
        <div 
          id="projects-title"
          className={cn(
            "text-center mb-12 opacity-0 transition-all duration-700",
            titleVisible && "opacity-100 transform-none"
          )}
        >
          <h2 className="section-title">
            {isLoggedIn ? 'My Projects' : 'Projects Showcase'}
          </h2>
          <p className="section-subtitle mx-auto">
            {isLoggedIn 
              ? 'Showcase your portfolio projects and creative work'
              : 'Explore a collection of beautifully designed portfolio templates for various industries and purposes.'
            }
          </p>
          
          {isLoggedIn && (
            <div className="mt-6">
              <Button 
                onClick={handleAddProject}
                className="flex items-center gap-2 animate-pulse-slow"
              >
                <Plus size={18} />
                {userProjects.length === 0 ? 'Add Your First Project' : 'Manage Projects'}
              </Button>
            </div>
          )}
        </div>

        {allProjects.length > 0 && (
          <>
            <div className="flex justify-center mb-10 overflow-x-auto pb-2">
              <div className="flex gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                      selectedCategory === category
                        ? "bg-primary text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  {...project}
                  index={index}
                />
              ))}
            </div>
          </>
        )}
        
        {isLoggedIn && userProjects.length === 0 && (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-10 text-center">
            <FolderPlus className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't added any projects to your portfolio. Add your first project to showcase your work.
            </p>
            <Button 
              onClick={handleAddProject}
              size="lg"
              className="px-6 py-6 h-auto rounded-full bg-primary/90 hover:bg-primary transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Project
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectGallery;
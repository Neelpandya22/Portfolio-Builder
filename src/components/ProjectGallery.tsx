import React, { useState, useEffect, useContext } from 'react';
import { cn } from "@/lib/utils";
import ProjectCard, { ProjectProps } from './ProjectCard';
import { Button } from '@/components/ui/button';
import { Plus, FolderPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "@/App";
import { toast } from "@/components/ui/use-toast";

const ProjectGallery: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [titleVisible, setTitleVisible] = useState(false);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);

  // Load user projects
  useEffect(() => {
    // If logged in, try to get user projects from localStorage
    if (isAuthenticated) {
      const savedProjects = localStorage.getItem('userProjects');
      const portfolioData = localStorage.getItem('portfolioData');
      
      if (portfolioData) {
        try {
          const parsedPortfolio = JSON.parse(portfolioData);
          if (parsedPortfolio.projects && parsedPortfolio.projects.length > 0) {
            setUserProjects(parsedPortfolio.projects);
            setAllProjects(parsedPortfolio.projects);
            return;
          }
        } catch (e) {
          console.error('Error parsing portfolio data', e);
        }
      }
      
      if (savedProjects) {
        try {
          const parsedProjects = JSON.parse(savedProjects);
          setUserProjects(parsedProjects);
          setAllProjects(parsedProjects);
        } catch (e) {
          console.error('Error parsing saved projects', e);
          setAllProjects([]); // Empty for logged in users with no projects
        }
      } else {
        setAllProjects([]); // Empty for logged in users with no projects
      }
    } else {
      // Not logged in, use empty projects array to encourage signup
      setAllProjects([]);
    }
  }, [isAuthenticated]);

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

  const handleManagePortfolio = () => {
    navigate('/portfolio-setup');
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
            {isAuthenticated ? 'My Projects' : 'Showcase Your Work'}
          </h2>
          <p className="section-subtitle mx-auto">
            {isAuthenticated 
              ? 'Manage and showcase your professional portfolio projects'
              : 'Sign up to create your own professional portfolio and showcase your best work.'
            }
          </p>
          
          <div className="mt-6 flex gap-3 justify-center">
            <Button 
              onClick={isAuthenticated ? handleAddProject : () => navigate('/register')}
              className="flex items-center gap-2 animate-pulse-slow bg-black hover:bg-black/90 text-white"
            >
              <Plus size={18} />
              {isAuthenticated 
                ? (userProjects.length === 0 ? 'Add Your First Project' : 'Manage Projects')
                : 'Get Started Free'
              }
            </Button>
            
            {isAuthenticated && (
              <Button 
                onClick={handleManagePortfolio}
                variant="outline"
                className="flex items-center gap-2"
              >
                Manage Portfolio
              </Button>
            )}
          </div>
        </div>

        {allProjects.length > 0 ? (
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
                        ? "bg-black text-white shadow-sm"
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
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  category={project.category}
                  url={project.url}
                  index={index}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-10 text-center">
            <FolderPlus className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {isAuthenticated ? 'No Projects Yet' : 'Create Your Portfolio'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {isAuthenticated 
                ? "You haven't added any projects to your portfolio. Add your first project to showcase your work."
                : "Sign up to create and manage your professional portfolio. Showcase your work to potential clients and employers."
              }
            </p>
            <Button 
              onClick={isAuthenticated ? handleAddProject : () => navigate('/register')}
              size="lg"
              className="px-6 py-6 h-auto rounded-full bg-black hover:bg-black/90 text-white transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              {isAuthenticated ? 'Create Your First Project' : 'Create Free Account'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectGallery;
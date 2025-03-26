import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import ProjectCard, { ProjectProps } from './ProjectCard';
import { Button } from '@/components/ui/button';
import { Plus, FolderPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../lib/api.mjs';

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
      // Not logged in, use empty projects array to encourage signup
      setAllProjects([]);
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
            {isLoggedIn ? 'My Projects' : 'Showcase Your Work'}
          </h2>
          <p className="section-subtitle mx-auto">
            {isLoggedIn 
              ? 'Manage and showcase your professional portfolio projects'
              : 'Sign up to create your own professional portfolio and showcase your best work.'
            }
          </p>
          
          <div className="mt-6">
            <Button 
              onClick={isLoggedIn ? handleAddProject : () => navigate('/register')}
              className="flex items-center gap-2 animate-pulse-slow bg-black hover:bg-black/90 text-white"
            >
              <Plus size={18} />
              {isLoggedIn 
                ? (userProjects.length === 0 ? 'Add Your First Project' : 'Manage Projects')
                : 'Get Started Free'
              }
            </Button>
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
                  {...project}
                  index={index}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-10 text-center">
            <FolderPlus className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {isLoggedIn ? 'No Projects Yet' : 'Create Your Portfolio'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {isLoggedIn 
                ? "You haven't added any projects to your portfolio. Add your first project to showcase your work."
                : "Sign up to create and manage your professional portfolio. Showcase your work to potential clients and employers."
              }
            </p>
            <Button 
              onClick={isLoggedIn ? handleAddProject : () => navigate('/register')}
              size="lg"
              className="px-6 py-6 h-auto rounded-full bg-black hover:bg-black/90 text-white transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              {isLoggedIn ? 'Create Your First Project' : 'Create Free Account'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectGallery;
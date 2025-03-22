import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2, Briefcase, GraduationCap, Code, User, FolderCode, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type ResumeData = {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: {
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    id: string;
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  skills: {
    id: string;
    name: string;
    level: number;
  }[];
  projects: {
    id: string;
    title: string;
    description: string;
    technologies: string;
    link: string;
    startDate: string;
    endDate: string;
  }[];
};

interface ResumeBuilderProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ resumeData, setResumeData }) => {
  // Helper function to generate a unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Personal Information handlers
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [name]: value,
      },
    });
  };

  // Experience handlers
  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          id: generateId(),
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    });
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id),
    });
  };

  // Education handlers
  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          id: generateId(),
          degree: '',
          institution: '',
          location: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id),
    });
  };

  // Skills handlers
  const addSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [
        ...resumeData.skills,
        {
          id: generateId(),
          name: '',
          level: 3,
        },
      ],
    });
  };

  const updateSkill = (id: string, field: string, value: string | number) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map(skill => 
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });
  };

  const removeSkill = (id: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter(skill => skill.id !== id),
    });
  };

  // Projects handlers
  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        {
          id: generateId(),
          title: '',
          description: '',
          technologies: '',
          link: '',
          startDate: '',
          endDate: '',
        },
      ],
    });
  };

  const updateProject = (id: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      ),
    });
  };

  const removeProject = (id: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter(project => project.id !== id),
    });
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Experience</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Education</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FolderCode className="h-4 w-4" />
            <span className="hidden sm:inline">Projects</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Skills</span>
          </TabsTrigger>
        </TabsList>

        {/* Personal Information Section */}
        <TabsContent value="personal" className="space-y-4">
          <h3 className="text-lg font-medium">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={resumeData.personalInfo.name} 
                onChange={handlePersonalInfoChange} 
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input 
                id="title" 
                name="title" 
                value={resumeData.personalInfo.title} 
                onChange={handlePersonalInfoChange} 
                placeholder="Frontend Developer"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={resumeData.personalInfo.email} 
                onChange={handlePersonalInfoChange} 
                placeholder="johndoe@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={resumeData.personalInfo.phone} 
                onChange={handlePersonalInfoChange} 
                placeholder="(123) 456-7890"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                name="location" 
                value={resumeData.personalInfo.location} 
                onChange={handlePersonalInfoChange} 
                placeholder="New York, NY"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea 
                id="summary" 
                name="summary" 
                value={resumeData.personalInfo.summary} 
                onChange={handlePersonalInfoChange} 
                placeholder="A brief summary of your professional background and goals."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </TabsContent>

        {/* Experience Section */}
        <TabsContent value="experience" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Work Experience</h3>
            <Button type="button" variant="outline" size="sm" onClick={addExperience} className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Experience
            </Button>
          </div>

          {resumeData.experience.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No work experience added. Click the button above to add your work history.
            </div>
          ) : (
            <div className="space-y-6">
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id} className="border rounded-md p-4 relative">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                    onClick={() => removeExperience(exp.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`job-title-${index}`}>Job Title</Label>
                      <Input 
                        id={`job-title-${index}`} 
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                        placeholder="Senior Developer"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`company-${index}`}>Company</Label>
                      <Input 
                        id={`company-${index}`} 
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        placeholder="Acme Inc."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`exp-location-${index}`}>Location</Label>
                      <Input 
                        id={`exp-location-${index}`} 
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        placeholder="New York, NY"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor={`start-date-${index}`}>Start Date</Label>
                        <Input 
                          id={`start-date-${index}`} 
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          placeholder="Jan 2020"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`end-date-${index}`}>End Date</Label>
                        <Input 
                          id={`end-date-${index}`} 
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          placeholder="Present"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`job-description-${index}`}>Description</Label>
                      <Textarea 
                        id={`job-description-${index}`} 
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        placeholder="Describe your responsibilities and achievements in this role."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Education Section */}
        <TabsContent value="education" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Education</h3>
            <Button type="button" variant="outline" size="sm" onClick={addEducation} className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Education
            </Button>
          </div>

          {resumeData.education.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No education added. Click the button above to add your educational background.
            </div>
          ) : (
            <div className="space-y-6">
              {resumeData.education.map((edu, index) => (
                <div key={edu.id} className="border rounded-md p-4 relative">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                    onClick={() => removeEducation(edu.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`degree-${index}`}>Degree</Label>
                      <Input 
                        id={`degree-${index}`} 
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="Bachelor of Science in Computer Science"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`institution-${index}`}>Institution</Label>
                      <Input 
                        id={`institution-${index}`} 
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        placeholder="University of Technology"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`edu-location-${index}`}>Location</Label>
                      <Input 
                        id={`edu-location-${index}`} 
                        value={edu.location}
                        onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                        placeholder="Boston, MA"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor={`edu-start-date-${index}`}>Start Date</Label>
                        <Input 
                          id={`edu-start-date-${index}`} 
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          placeholder="Sep 2016"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`edu-end-date-${index}`}>End Date</Label>
                        <Input 
                          id={`edu-end-date-${index}`} 
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          placeholder="Jun 2020"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`edu-description-${index}`}>Description</Label>
                      <Textarea 
                        id={`edu-description-${index}`} 
                        value={edu.description}
                        onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                        placeholder="Describe your academic achievements, relevant coursework, etc."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Projects Section */}
        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Projects</h3>
            <Button type="button" variant="outline" size="sm" onClick={addProject} className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Project
            </Button>
          </div>

          {resumeData.projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No projects added. Click the button above to add your projects.
            </div>
          ) : (
            <div className="space-y-6">
              {resumeData.projects.map((project, index) => (
                <div key={project.id} className="border rounded-md p-4 relative">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                    onClick={() => removeProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`project-title-${index}`}>Project Title</Label>
                      <Input 
                        id={`project-title-${index}`} 
                        value={project.title}
                        onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                        placeholder="Portfolio Website"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`project-technologies-${index}`}>Technologies</Label>
                      <Input 
                        id={`project-technologies-${index}`} 
                        value={project.technologies}
                        onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                        placeholder="React, TypeScript, Tailwind CSS"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`project-link-${index}`}>Project Link</Label>
                      <Input 
                        id={`project-link-${index}`} 
                        value={project.link}
                        onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor={`project-start-date-${index}`}>Start Date</Label>
                        <Input 
                          id={`project-start-date-${index}`} 
                          value={project.startDate}
                          onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                          placeholder="Jan 2023"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`project-end-date-${index}`}>End Date</Label>
                        <Input 
                          id={`project-end-date-${index}`} 
                          value={project.endDate}
                          onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                          placeholder="Present"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`project-description-${index}`}>Description</Label>
                      <Textarea 
                        id={`project-description-${index}`} 
                        value={project.description}
                        onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                        placeholder="Describe your project, its purpose, and your role in it."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Skills Section */}
        <TabsContent value="skills" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Skills</h3>
            <Button type="button" variant="outline" size="sm" onClick={addSkill} className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Skill
            </Button>
          </div>

          {resumeData.skills.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No skills added. Click the button above to add your skills.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resumeData.skills.map((skill, index) => (
                <div key={skill.id} className="border rounded-md p-3 relative flex items-center">
                  <div className="flex-1">
                    <Input 
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                      placeholder="Skill name (e.g. JavaScript)"
                      className="border-0 px-0 py-0 h-auto text-sm focus-visible:ring-0"
                    />
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={skill.level}
                      onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Beginner</span>
                      <span>Expert</span>
                    </div>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2 text-muted-foreground hover:text-destructive"
                    onClick={() => removeSkill(skill.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;
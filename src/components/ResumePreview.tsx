import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Printer, Mail, Phone, MapPin, Calendar, ExternalLink } from "lucide-react";
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

interface ResumePreviewProps {
  resumeData: ResumeData;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData }) => {
  const { personalInfo, experience, education, skills, projects } = resumeData;

  const handlePrint = () => {
    const content = document.getElementById('resume-preview-content');
    const printWindow = window.open('', '_blank');
    
    if (content && printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${personalInfo.name || 'Resume'}</title>
            <style>
              body {
                font-family: 'Inter', sans-serif;
                line-height: 1.5;
                color: #111827;
                padding: 40px;
                max-width: 800px;
                margin: 0 auto;
              }
              h1, h2, h3 {
                margin-top: 0;
              }
              h1 {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 4px;
              }
              h2 {
                font-size: 18px;
                font-weight: 600;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 4px;
                margin-top: 24px;
                margin-bottom: 16px;
              }
              h3 {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 4px;
              }
              p {
                margin: 0 0 16px;
              }
              .header {
                margin-bottom: 24px;
              }
              .contact-info {
                display: flex;
                flex-wrap: wrap;
                gap: 16px;
                font-size: 14px;
                margin-top: 8px;
              }
              .contact-item {
                display: flex;
                align-items: center;
              }
              .title {
                font-size: 16px;
                color: #4b5563;
                margin-bottom: 12px;
              }
              .section {
                margin-bottom: 24px;
              }
              .experience-item, .education-item {
                margin-bottom: 20px;
              }
              .item-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
              }
              .item-subheader {
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                color: #4b5563;
                margin-bottom: 8px;
              }
              .skills-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
              }
              .skill-item {
                background: #f3f4f6;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 14px;
              }
              .description {
                white-space: pre-line;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            ${content.innerHTML}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleDownload = () => {
    const content = document.getElementById('resume-preview-content');
    if (!content) return;
    
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${personalInfo.name || 'Resume'}</title>
            <style>
              body {
                font-family: 'Inter', sans-serif;
                line-height: 1.5;
                color: #111827;
                padding: 40px;
                max-width: 800px;
                margin: 0 auto;
              }
              h1, h2, h3 {
                margin-top: 0;
              }
              h1 {
                font-size: 28px;
                font-weight: 700;
                margin-bottom: 4px;
              }
              h2 {
                font-size: 18px;
                font-weight: 600;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 4px;
                margin-top: 24px;
                margin-bottom: 16px;
              }
              h3 {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 4px;
              }
              p {
                margin: 0 0 16px;
              }
              .header {
                margin-bottom: 24px;
              }
              .contact-info {
                display: flex;
                flex-wrap: wrap;
                gap: 16px;
                font-size: 14px;
                margin-top: 8px;
              }
              .contact-item {
                display: flex;
                align-items: center;
              }
              .title {
                font-size: 16px;
                color: #4b5563;
                margin-bottom: 12px;
              }
              .section {
                margin-bottom: 24px;
              }
              .experience-item, .education-item {
                margin-bottom: 20px;
              }
              .item-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
              }
              .item-subheader {
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                color: #4b5563;
                margin-bottom: 8px;
              }
              .skills-list {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
              }
              .skill-item {
                background: #f3f4f6;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 14px;
              }
              .description {
                white-space: pre-line;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            ${content.innerHTML}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        try {
          printWindow.document.execCommand('SaveAs', true, `${personalInfo.name || 'resume'}.pdf`);
          printWindow.close();
        } catch (e) {
          // If execCommand doesn't work (e.g., in Chrome)
          printWindow.print();
        }
      }, 500);
    }
  };

  const renderSkillLevel = (level: number) => {
    const maxLevel = 5;
    const stars = [];
    
    for (let i = 1; i <= maxLevel; i++) {
      stars.push(
        <span 
          key={i}
          className={cn(
            "inline-block w-2 h-2 rounded-full mx-0.5",
            i <= level ? "bg-primary" : "bg-gray-200"
          )}
        />
      );
    }
    
    return stars;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-medium">Resume Preview</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-1">
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button variant="default" size="sm" onClick={handleDownload} className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-8 bg-white">
          <div id="resume-preview-content" className="max-w-[800px] mx-auto">
            {/* Header Section */}
            <div className="header">
              <h1 className="text-2xl font-bold">{personalInfo.name || 'Your Name'}</h1>
              {personalInfo.title && <div className="title">{personalInfo.title}</div>}
              
              <div className="contact-info text-sm text-gray-600 flex flex-wrap gap-4">
                {personalInfo.email && (
                  <div className="contact-item">
                    <Mail className="h-4 w-4 mr-1" />
                    {personalInfo.email}
                  </div>
                )}
                
                {personalInfo.phone && (
                  <div className="contact-item">
                    <Phone className="h-4 w-4 mr-1" />
                    {personalInfo.phone}
                  </div>
                )}
                
                {personalInfo.location && (
                  <div className="contact-item">
                    <MapPin className="h-4 w-4 mr-1" />
                    {personalInfo.location}
                  </div>
                )}
              </div>
            </div>
            
            {/* Summary Section */}
            {personalInfo.summary && (
              <div className="section">
                <h2 className="text-lg font-semibold border-b pb-1 mb-4">Professional Summary</h2>
                <p className="description">{personalInfo.summary}</p>
              </div>
            )}
            
            {/* Experience Section */}
            {experience.length > 0 && (
              <div className="section">
                <h2 className="text-lg font-semibold border-b pb-1 mb-4">Work Experience</h2>
                
                {experience.map((exp) => (
                  <div key={exp.id} className="experience-item mb-5">
                    <div className="item-header">
                      <h3 className="font-semibold">{exp.title || 'Position Title'}</h3>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {exp.startDate || 'Start Date'} - {exp.endDate || 'End Date'}
                      </div>
                    </div>
                    
                    <div className="item-subheader">
                      <div>{exp.company || 'Company Name'}{exp.location && `, ${exp.location}`}</div>
                    </div>
                    
                    {exp.description && <p className="description">{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}
            
            {/* Projects Section */}
            {projects.length > 0 && (
              <div className="section">
                <h2 className="text-lg font-semibold border-b pb-1 mb-4">Projects</h2>
                
                {projects.map((project) => (
                  <div key={project.id} className="experience-item mb-5">
                    <div className="item-header">
                      <h3 className="font-semibold flex items-center">
                        {project.title || 'Project Title'}
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center ml-2 text-primary hover:text-primary/80">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </h3>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {project.startDate || 'Start Date'} - {project.endDate || 'End Date'}
                      </div>
                    </div>
                    
                    {project.technologies && (
                      <div className="item-subheader">
                        <div className="text-primary font-medium">{project.technologies}</div>
                      </div>
                    )}
                    
                    {project.description && <p className="description">{project.description}</p>}
                  </div>
                ))}
              </div>
            )}
            
            {/* Education Section */}
            {education.length > 0 && (
              <div className="section">
                <h2 className="text-lg font-semibold border-b pb-1 mb-4">Education</h2>
                
                {education.map((edu) => (
                  <div key={edu.id} className="education-item mb-5">
                    <div className="item-header">
                      <h3 className="font-semibold">{edu.degree || 'Degree'}</h3>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {edu.startDate || 'Start Date'} - {edu.endDate || 'End Date'}
                      </div>
                    </div>
                    
                    <div className="item-subheader">
                      <div>{edu.institution || 'Institution'}{edu.location && `, ${edu.location}`}</div>
                    </div>
                    
                    {edu.description && <p className="description">{edu.description}</p>}
                  </div>
                ))}
              </div>
            )}
            
            {/* Skills Section */}
            {skills.length > 0 && (
              <div className="section">
                <h2 className="text-lg font-semibold border-b pb-1 mb-4">Skills</h2>
                
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between">
                      <span>{skill.name || 'Skill Name'}</span>
                      <div className="flex items-center">
                        {renderSkillLevel(skill.level)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
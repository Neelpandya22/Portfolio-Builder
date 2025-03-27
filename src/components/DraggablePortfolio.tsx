import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2, Edit2, Eye } from 'lucide-react';
import { cn } from "@/lib/utils";

interface DraggablePortfolioProps {
  projects: any[];
  onReorder: (items: any[]) => void;
  onEdit: (project: any) => void;
  onDelete: (projectId: string) => void;
  onView: (project: any) => void;
}

const DraggablePortfolio: React.FC<DraggablePortfolioProps> = ({
  projects,
  onReorder,
  onEdit,
  onDelete,
  onView
}) => {
  // Handle drag end
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onReorder(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="projects">
        {(provided) => (
          <div 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4 my-4"
          >
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <Draggable 
                  key={project.id} 
                  draggableId={project.id} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "transition-all",
                        snapshot.isDragging ? "shadow-lg" : "hover:shadow-md"
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div 
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="h-5 w-5 text-gray-400" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{project.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {project.description?.substring(0, 60)}
                              {project.description?.length > 60 ? '...' : ''}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onView(project)}
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(project)}
                              className="text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(project.id)}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p className="text-muted-foreground">No projects added yet.</p>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DraggablePortfolio;
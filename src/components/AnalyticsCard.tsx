
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  description?: string;
  type: 'line' | 'bar' | 'number';
  data?: any[];
  className?: string;
  icon?: React.ReactNode;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  title, 
  value, 
  description, 
  type, 
  data, 
  className,
  icon
}) => {
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        
        {type === 'line' && data && (
          <div className="h-[80px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {type === 'bar' && data && (
          <div className="h-[80px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;

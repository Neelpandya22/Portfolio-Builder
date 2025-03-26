import React, { useState, useRef, useContext } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Camera, Upload, LogOut } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { AuthContext } from '@/App';
import { useNavigate } from 'react-router-dom';

interface ProfileSettingsProps {
  userName: string;
  userInitials: string;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ 
  userName, 
  userInitials, 
  avatarUrl, 
  setAvatarUrl 
}) => {
  const [name, setName] = useState(userName);
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { setIsAuthenticated, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebsite(e.target.value);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // In a real application, you would upload this file to your server or cloud storage
    // For now, we'll use a FileReader to get a data URL and store it locally
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setAvatarUrl(result);
        localStorage.setItem('avatarUrl', result);
        
        setIsUploading(false);
        toast({
          title: "Profile photo updated",
          description: "Your profile photo has been updated successfully.",
        });
      }
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: "Error uploading image",
        description: "There was a problem uploading your image. Please try again.",
        variant: "destructive",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    // In a real application, you would save this data to your backend
    // For now, we'll just store it in localStorage
    localStorage.setItem('userName', name);
    if (email) localStorage.setItem('userEmail', email);
    if (bio) localStorage.setItem('userBio', bio);
    if (location) localStorage.setItem('userLocation', location);
    if (website) localStorage.setItem('userWebsite', website);
    
    // Update the user in context if name changed
    if (name !== userName) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.name = name;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleSignOut = () => {
    // Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update auth context
    setIsAuthenticated(false);
    setUser(null);
    
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    
    // Redirect to home page
    navigate('/');
  };

  // Load saved profile data from localStorage
  React.useEffect(() => {
    const storedBio = localStorage.getItem('userBio');
    const storedEmail = localStorage.getItem('userEmail');
    const storedLocation = localStorage.getItem('userLocation');
    const storedWebsite = localStorage.getItem('userWebsite');
    
    if (storedBio) setBio(storedBio);
    if (storedEmail) setEmail(storedEmail);
    if (storedLocation) setLocation(storedLocation);
    if (storedWebsite) setWebsite(storedWebsite);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Update your personal information and profile picture</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-2 border-primary/10 cursor-pointer" onClick={handleAvatarClick}>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-2xl">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            
            <div 
              className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
              onClick={handleAvatarClick}
            >
              <Camera size={16} className="text-white" />
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="text-sm text-muted-foreground">
              Click on the profile picture to upload a new photo. For best results, use an image at least 256px by 256px in JPG, PNG, or GIF format.
            </div>
            
            {isUploading && (
              <div className="text-sm text-primary animate-pulse">
                Uploading...
              </div>
            )}
          </div>
        </div>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              placeholder="Your name" 
              value={name} 
              onChange={handleNameChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email"
              placeholder="your.email@example.com" 
              value={email} 
              onChange={handleEmailChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea 
              id="bio" 
              className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Write a short bio about yourself..."
              value={bio}
              onChange={handleBioChange}
            />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                placeholder="City, Country" 
                value={location} 
                onChange={handleLocationChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input 
                id="website" 
                placeholder="https://yourwebsite.com" 
                value={website} 
                onChange={handleWebsiteChange}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2">
          <LogOut size={16} />
          Sign Out
        </Button>
        <Button onClick={handleSaveProfile}>
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSettings;
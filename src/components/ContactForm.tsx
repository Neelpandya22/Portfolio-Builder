
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Check, Loader2, Mail, MessageSquare, User } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface FormState {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState<FormState>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = React.useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      
      // Reset form after showing success state
      setTimeout(() => {
        setFormState({ name: '', email: '', message: '' });
        setIsSuccess(false);
      }, 3000);
    }, 1500);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => {
      if (formRef.current) {
        observer.unobserve(formRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="contact" 
      className="py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="portfolio-container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-subtitle mx-auto">
              Have questions or ready to start building your portfolio? Reach out to us.
            </p>
          </div>
          
          <div 
            ref={formRef}
            className={cn(
              "bg-white rounded-2xl p-8 shadow-medium transition-all duration-700",
              "border border-gray-100 relative overflow-hidden",
              "opacity-0 translate-y-8",
              isVisible && "opacity-100 translate-y-0"
            )}
          >
            {isSuccess && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 z-10 animate-fade-in">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">Message Sent!</h3>
                <p className="text-muted-foreground max-w-md">
                  Thank you for reaching out. We've received your message and will get back to you shortly.
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label 
                    htmlFor="name" 
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <User size={16} />
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className={cn(
                      "w-full px-4 py-3 rounded-lg border border-gray-200",
                      "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                      "transition-all duration-200"
                    )}
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="space-y-2">
                  <label 
                    htmlFor="email" 
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Mail size={16} />
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className={cn(
                      "w-full px-4 py-3 rounded-lg border border-gray-200",
                      "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                      "transition-all duration-200"
                    )}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label 
                  htmlFor="message" 
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <MessageSquare size={16} />
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border border-gray-200",
                    "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                    "transition-all duration-200"
                  )}
                  placeholder="Tell us how we can help you..."
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full sm:w-auto px-6 py-3 font-medium rounded-full",
                    "bg-primary text-white transition-all duration-300",
                    "flex items-center justify-center gap-2",
                    "hover:shadow-md hover:shadow-primary/20",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
                    "disabled:opacity-70 disabled:cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;

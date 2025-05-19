
import { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = sectionRef.current?.querySelectorAll('.fade-element');
    elements?.forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      elements?.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "Thank you for your message. We'll get back to you soon.",
    });
  };

  return (
    <section id="contact" className="py-24 bg-white" ref={sectionRef}>
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-light mb-4">GET IN TOUCH</h2>
          <div className="w-20 h-0.5 bg-gray-900 mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600">
            Interested in discussing a project or learning more about our services? 
            Reach out through the form below or via direct contact methods.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="fade-element opacity-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    required
                    className="w-full border-gray-300 focus:ring-black focus:border-black"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    className="w-full border-gray-300 focus:ring-black focus:border-black"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <Input
                  id="subject"
                  type="text"
                  required
                  className="w-full border-gray-300 focus:ring-black focus:border-black"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  required
                  rows={5}
                  className="w-full border-gray-300 focus:ring-black focus:border-black"
                />
              </div>
              
              <Button 
                type="submit"
                className="bg-black hover:bg-black/80 text-white w-full py-6"
              >
                SEND MESSAGE
              </Button>
            </form>
          </div>
          
          <div className="fade-element opacity-0">
            <div className="h-full flex flex-col">
              <div className="bg-secondary p-8 mb-6 flex-grow">
                <h3 className="text-2xl font-light mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-4 mt-1" />
                    <div>
                      <h4 className="font-medium mb-1">Our Studio</h4>
                      <p className="text-gray-600">
                        123 Architecture Street<br />
                        Design District<br />
                        New York, NY 10001
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 mr-4 mt-1" />
                    <div>
                      <h4 className="font-medium mb-1">Email Us</h4>
                      <p className="text-gray-600">
                        info@architect-studio.com<br />
                        projects@architect-studio.com
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 mr-4 mt-1" />
                    <div>
                      <h4 className="font-medium mb-1">Call Us</h4>
                      <p className="text-gray-600">
                        +1 (555) 123-4567<br />
                        +1 (555) 987-6543
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-black text-white p-8">
                <h3 className="text-xl font-light mb-4">Working Hours</h3>
                <div className="space-y-2">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: By appointment only</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSocialMediaLinks, getSocialMediaLinks, SocialMediaLinks } from "@/lib/projectsData";
import { useToast } from "@/components/ui/use-toast";
import { Instagram, Twitter, Linkedin } from "lucide-react";

export function SocialMediaSettings() {
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const links = getSocialMediaLinks();
    setInstagram(links.instagram || "");
    setTwitter(links.twitter || "");
    setLinkedin(links.linkedin || "");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedLinks: SocialMediaLinks = {
      instagram: instagram.trim(),
      twitter: twitter.trim(),
      linkedin: linkedin.trim()
    };
    
    updateSocialMediaLinks(updatedLinks);
    
    toast({
      title: "Social media links updated",
      description: "The links have been successfully updated",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-light mb-4">Social Media Links</h2>
      <p className="text-muted-foreground mb-6">
        Add your social media profile URLs to activate the links in the footer
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Instagram className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input
              id="instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://instagram.com/yourusername"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Twitter className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <Label htmlFor="twitter">Twitter URL</Label>
            <Input
              id="twitter"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="https://twitter.com/yourusername"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Linkedin className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/yourusername"
            />
          </div>
        </div>
      </div>
      
      <Button type="submit">Save Social Media Links</Button>
    </form>
  );
}

export default SocialMediaSettings;

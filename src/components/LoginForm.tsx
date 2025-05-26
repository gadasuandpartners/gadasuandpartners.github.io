import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { signInWithEmail, signInWithGoogle } from '@/lib/authSupabase';

const ADMIN_EMAIL = "sstonelabs@gmail.com";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { user } = await signInWithEmail(email, password);
      if (user && user.email === ADMIN_EMAIL) {
        toast({ title: "Login successful", description: "Welcome to the admin dashboard" });
        navigate('/admin');
      } else {
        toast({ title: "Access denied", description: "You are not authorized", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // Supabase will redirect on success
    } catch (error: any) {
      toast({ title: "Google login failed", description: error.message, variant: "destructive" });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder=""
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder=""
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Sign In'}
      </Button>
      <Button type="button" className="w-full" variant="outline" onClick={handleGoogleLogin} disabled={isLoading}>
        {isLoading ? 'Redirecting...' : 'Sign In with Google'}
      </Button>
    </form>
  );
};

export default LoginForm;

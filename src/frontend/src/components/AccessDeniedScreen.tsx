import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function AccessDeniedScreen() {
  const navigate = useNavigate();

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <ShieldAlert className="h-16 w-16 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page. This area is restricted to administrators only.
          </p>
        </div>
        <Button onClick={() => navigate({ to: '/' })} className="w-full sm:w-auto">
          Go to Home
        </Button>
      </div>
    </div>
  );
}

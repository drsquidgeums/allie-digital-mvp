import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickAccessButton = () => {
  const navigate = useNavigate();

  const goToLiveSessions = () => {
    navigate('/live-sessions');
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={goToLiveSessions}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        size="sm"
      >
        <Users className="w-4 h-4 mr-2" />
        Live Sessions
      </Button>
    </div>
  );
};
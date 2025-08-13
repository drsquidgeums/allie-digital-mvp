
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickAccessButton = () => {
  const navigate = useNavigate();
  
  console.log('QuickAccessButton is rendering');

  const goToLiveSessions = () => {
    console.log('Navigating to live sessions');
    navigate('/live-sessions');
  };

  return (
    <div className="fixed top-4 right-4 z-50" style={{ background: 'red', padding: '2px' }}>
      <Button
        onClick={goToLiveSessions}
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        size="sm"
      >
        <Users className="w-4 h-4 mr-2" />
        Live Sessions
      </Button>
    </div>
  );
};

import { LiveSessionMonitor } from '@/components/LiveSessionMonitor';

const LiveSessionsPage = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Live Sessions</h1>
        <p className="text-muted-foreground">Monitor active user sessions in real-time</p>
      </div>
      
      <LiveSessionMonitor />
    </div>
  );
};

export default LiveSessionsPage;
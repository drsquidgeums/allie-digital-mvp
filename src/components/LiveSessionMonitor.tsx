import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users, Clock, Monitor } from 'lucide-react';
import { useActiveSessionMonitor } from '@/hooks/useActiveSessionMonitor';
import { formatDistanceToNow } from 'date-fns';

export const LiveSessionMonitor = () => {
  const { activeSessions, isLoading, refreshSessions } = useActiveSessionMonitor();
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshSessions();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, refreshSessions]);

  const getSessionStatus = (lastActivity: string) => {
    const lastActivityTime = new Date(lastActivity);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastActivityTime.getTime()) / (1000 * 60);

    if (diffMinutes < 5) return { status: 'active', color: 'bg-emerald-500' };
    if (diffMinutes < 15) return { status: 'idle', color: 'bg-amber-500' };
    return { status: 'inactive', color: 'bg-gray-500' };
  };

  const getBrowserName = (userAgent?: string) => {
    if (!userAgent) return 'Unknown';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Live Sessions ({activeSessions.length})
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-emerald-50 border-emerald-200' : ''}
          >
            <Monitor className="h-4 w-4 mr-1" />
            Auto: {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshSessions}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading sessions...</span>
          </div>
        ) : activeSessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No active sessions found
          </div>
        ) : (
          <div className="space-y-4">
            {activeSessions.map((session) => {
              const { status, color } = getSessionStatus(session.last_activity);
              const browser = getBrowserName(session.user_agent);
              
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${color}`} />
                    <div>
                      <div className="font-medium">
                        User ID: {session.user_id.slice(0, 8)}...
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Session: {session.session_id.slice(0, 12)}...
                      </div>
                      {session.page_url && (
                        <div className="text-xs text-muted-foreground">
                          Page: {new URL(session.page_url).pathname}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={status === 'active' ? 'default' : 'secondary'}>
                      {status}
                    </Badge>
                    <Badge variant="outline">{browser}</Badge>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(session.last_activity), { addSuffix: true })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Started: {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
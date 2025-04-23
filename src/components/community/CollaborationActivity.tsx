
import React from 'react';
import { 
  MessageSquare, 
  FileEdit, 
  Upload, 
  Monitor 
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'comment' | 'edit' | 'upload' | 'collaboration';
  user: string;
  content: string;
  timestamp: string;
}

interface CollaborationActivityProps {
  activities?: Activity[]; // Make activities optional with the ? operator
}

export const CollaborationActivity: React.FC<CollaborationActivityProps> = ({ activities = [] }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
      return minutes <= 1 ? 'a minute ago' : `${minutes} minutes ago`;
    } else if (hours < 24) {
      return hours <= 1 ? 'an hour ago' : `${hours} hours ago`;
    } else if (days < 7) {
      return days <= 1 ? 'yesterday' : `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'edit':
        return <FileEdit className="h-4 w-4 text-amber-500" />;
      case 'upload':
        return <Upload className="h-4 w-4 text-green-500" />;
      case 'collaboration':
        return <Monitor className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  // Default activities for demonstration
  const defaultActivities: Activity[] = [
    {
      id: '1',
      type: 'comment',
      user: 'Sarah J.',
      content: 'Added notes on chapter 5',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    },
    {
      id: '2',
      type: 'edit',
      user: 'Michael T.',
      content: 'Updated timeline for project',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
      id: '3',
      type: 'upload',
      user: 'Alex K.',
      content: 'Uploaded study guide PDF',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    }
  ];

  // Use provided activities or fallback to default ones
  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Recent Activity</h2>
      <ul className="space-y-4">
        {displayActivities.map((activity) => (
          <li key={activity.id} className="flex items-start space-x-3">
            {getActivityIcon(activity.type)}
            <div>
              <div className="text-sm font-medium leading-none">{activity.user}</div>
              <p className="text-sm text-muted-foreground">{activity.content}</p>
              <time className="text-xs text-gray-500">{formatDate(activity.timestamp)}</time>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Default export for lazy loading
export default { CollaborationActivity };

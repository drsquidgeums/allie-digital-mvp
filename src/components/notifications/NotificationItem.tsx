import React from "react";

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  onRead: (id: string) => void;
}

export const NotificationItem = ({ 
  id, 
  title, 
  message, 
  timestamp, 
  read, 
  onRead 
}: NotificationItemProps) => {
  return (
    <div
      className={`p-3 rounded-lg ${
        read ? "bg-[#222222]/80" : "bg-[#2a2a2a]/80"
      } cursor-pointer hover:bg-[#333333]/80 transition-colors border border-gray-600/50`}
      onClick={() => onRead(id)}
    >
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-medium text-gray-200">{title}</h4>
        <span className="text-xs text-gray-400">
          {new Date(timestamp).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })}
        </span>
      </div>
      <p className="text-sm text-gray-300 mt-1">
        {message}
      </p>
    </div>
  );
};
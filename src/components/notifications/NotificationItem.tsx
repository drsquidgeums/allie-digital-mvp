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
        read 
          ? "dark:bg-[#222222]/80 bg-[#f5f5f5]/80 sepia:bg-[#F2E8CF]/80" 
          : "dark:bg-[#2a2a2a]/80 bg-[#ffffff]/80 sepia:bg-[#F2E8CF]/90"
      } cursor-pointer dark:hover:bg-[#333333]/80 hover:bg-[#f0f0f0]/80 sepia:hover:bg-[#F2E8CF]/70 transition-colors dark:border-gray-600/50 border-gray-200/50`}
      onClick={() => onRead(id)}
    >
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-medium dark:text-gray-200 text-gray-800 sepia:text-[#F2E8CF]">{title}</h4>
        <span className="text-xs dark:text-gray-400 text-gray-500 sepia:text-[#F2E8CF]">
          {new Date(timestamp).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })}
        </span>
      </div>
      <p className="text-sm dark:text-gray-300 text-gray-600 sepia:text-[#F2E8CF] mt-1">
        {message}
      </p>
    </div>
  );
};
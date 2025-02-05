interface TaskNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
}

export const emitTaskNotification = (title: string, message: string) => {
  const event = new CustomEvent('taskNotification', {
    detail: { 
      id: Date.now().toString(),
      title,
      message,
      read: false,
      timestamp: new Date()
    } as TaskNotification
  });
  window.dispatchEvent(event);
};
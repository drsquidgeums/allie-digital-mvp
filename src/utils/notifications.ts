
interface TaskNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  taskId?: string;
  action?: string;
}

export const emitTaskNotification = (title: string, message: string, taskId?: string, action?: string) => {
  const event = new CustomEvent('taskNotification', {
    detail: { 
      id: Date.now().toString(),
      title,
      message,
      read: false,
      timestamp: new Date(),
      taskId,
      action
    } as TaskNotification
  });
  window.dispatchEvent(event);
};

import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { ContactForm } from "@/components/ContactForm";
import { Button } from "@/components/ui/button";
import ReactDOM from "react-dom/client";

const Index = () => {
  return (
    <div>
      <WorkspaceLayout />
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => {
            const dialog = document.createElement('dialog');
            dialog.className = 'p-4 rounded-lg shadow-lg bg-background';
            dialog.innerHTML = '<div id="contact-form-container"></div>';
            document.body.appendChild(dialog);
            dialog.showModal();
            
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '×';
            closeButton.className = 'absolute top-2 right-2 text-2xl hover:text-primary';
            closeButton.onclick = () => dialog.close();
            dialog.appendChild(closeButton);
            
            const root = ReactDOM.createRoot(document.getElementById('contact-form-container')!);
            root.render(<ContactForm />);
          }}
        >
          Contact Us
        </Button>
      </div>
    </div>
  );
};

export default Index;
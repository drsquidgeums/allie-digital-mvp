
import { SelectContent, SelectItem, SelectScrollUpButton, SelectScrollDownButton } from "@/components/ui/select";

interface FontListProps {
  className?: string;
}

export const FontList = ({ className }: FontListProps) => {
  const fonts = [
    // System fonts
    { name: "System Default", value: "system-ui" },
    
    // Sans-serif fonts
    { name: "Arial", value: "Arial" },
    { name: "Helvetica", value: "Helvetica" },
    { name: "Verdana", value: "Verdana" },
    { name: "Trebuchet MS", value: "Trebuchet MS" },
    { name: "Tahoma", value: "Tahoma" },
    { name: "Century Gothic", value: "Century Gothic" },
    { name: "Lucida Sans", value: "Lucida Sans" },
    { name: "Segoe UI", value: "Segoe UI" },
    { name: "Inter", value: "Inter" },
    { name: "Roboto", value: "Roboto" },
    { name: "Open Sans", value: "Open Sans" },
    { name: "Lato", value: "Lato" },
    { name: "Source Sans Pro", value: "Source Sans Pro" },
    { name: "Avenir", value: "Avenir" },
    { name: "Suisse Int'l", value: "Suisse Int'l" },
    
    // Serif fonts
    { name: "Times New Roman", value: "Times New Roman" },
    { name: "Georgia", value: "Georgia" },
    { name: "Garamond", value: "Garamond" },
    { name: "Book Antiqua", value: "Book Antiqua" },
    { name: "Palatino", value: "Palatino" },
    { name: "Baskerville", value: "Baskerville" },
    { name: "Crimson Text", value: "Crimson Text" },
    
    // Monospace fonts
    { name: "Courier New", value: "Courier New" },
    { name: "Monaco", value: "Monaco" },
    { name: "Consolas", value: "Consolas" },
    { name: "Fira Code", value: "Fira Code" },
    { name: "Source Code Pro", value: "Source Code Pro" },
    
    // Accessibility-friendly fonts
    { name: "Comic Sans MS", value: "Comic Sans MS" },
    { name: "OpenDyslexic", value: "OpenDyslexic" },
    { name: "Dyslexie", value: "Dyslexie" },
    { name: "Readability", value: "Readability" },
    { name: "Lexie Readable", value: "Lexie Readable" },
    { name: "Andika", value: "Andika" },
    
    // Display fonts
    { name: "Impact", value: "Impact" },
    { name: "Papyrus", value: "Papyrus" },
    { name: "Brush Script MT", value: "Brush Script MT" },
  ];

  return (
    <SelectContent className={className}>
      <SelectScrollUpButton className="text-foreground" />
      {fonts.map((font) => (
        <SelectItem 
          key={font.value} 
          value={font.value}
          className="text-foreground hover:bg-accent hover:text-accent-foreground dark:text-[#FAFAFA] dark:hover:bg-accent/20"
          style={{ fontFamily: font.value }}
        >
          {font.name}
        </SelectItem>
      ))}
      <SelectScrollDownButton className="text-foreground" />
    </SelectContent>
  );
};

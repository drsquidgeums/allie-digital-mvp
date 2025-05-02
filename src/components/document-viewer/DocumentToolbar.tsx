
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash, Download, Link } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DocumentToolbarProps {
  onUpload: () => void;
  onDownload: () => void;
  onDelete: () => void;
  hasFile: boolean;
}

export const DocumentToolbar: React.FC<DocumentToolbarProps> = ({
  onUpload,
  onDownload,
  onDelete,
  hasFile,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="h-9 bg-background hover:bg-accent hover:text-accent-foreground"
        onClick={onUpload}
      >
        <Upload className="h-4 w-4 mr-2" />
        {t('tools.uploadDocument')}
      </Button>

      {hasFile && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="h-9 bg-background hover:bg-accent hover:text-accent-foreground"
            onClick={onDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            {t('fileUploader.success')}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-9 bg-background hover:bg-accent hover:text-accent-foreground hover:bg-destructive/90 hover:text-destructive-foreground"
            onClick={onDelete}
          >
            <Trash className="h-4 w-4 mr-2" />
            {t('fileUploader.error')}
          </Button>
        </>
      )}
    </div>
  );
};

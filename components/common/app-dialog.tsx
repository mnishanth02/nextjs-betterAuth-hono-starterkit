import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ButtonConfig {
  text: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onClick?: () => void;
}

export interface AppDialogProps {
  trigger?: React.ReactNode;
  title: string;
  message: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  primaryButton?: ButtonConfig;
  secondaryButton?: ButtonConfig;
  showSecondaryButton?: boolean;
  showButtons?: boolean;
  customContent?: React.ReactNode;
  className?: string;
}

const AppDialog: React.FC<AppDialogProps> = ({
  trigger,
  title,
  message,
  open,
  onOpenChange,
  primaryButton = { text: "Confirm", variant: "default" },
  secondaryButton = { text: "Cancel", variant: "secondary" },
  showSecondaryButton = true,
  showButtons = true,
  customContent,
  className,
}) => {
  const handlePrimaryClick = () => {
    if (primaryButton.onClick) {
      primaryButton.onClick();
    }
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleSecondaryClick = () => {
    if (secondaryButton.onClick) {
      secondaryButton.onClick();
    }
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={`sm:max-w-lg ${className}`}>
        <DialogHeader>
          <DialogTitle className="flex justify-center">{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>

        {customContent && <div className="my-2">{customContent}</div>}

        {showButtons && (
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
            {showSecondaryButton && (
              <Button
                type="button"
                variant={secondaryButton.variant}
                onClick={handleSecondaryClick}
              >
                {secondaryButton.text}
              </Button>
            )}
            <Button type="button" variant={primaryButton.variant} onClick={handlePrimaryClick}>
              {primaryButton.text}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppDialog;

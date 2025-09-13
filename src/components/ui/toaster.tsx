import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { Copy } from "lucide-react";

const copyToastContent = (title: any, description: any) => {
  const content = [
    title ? `Title: ${title}` : '',
    description ? `Description: ${description}` : ''
  ].filter(Boolean).join('\n');
  
  navigator.clipboard.writeText(content).then(() => {
    console.log('Toast content copied to clipboard');
  }).catch((err) => {
    console.error('Failed to copy toast content: ', err);
  });
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="relative group cursor-pointer">
            <div className="grid gap-1" onClick={() => copyToastContent(title, description)}>
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            <button
              onClick={() => copyToastContent(title, description)}
              className="absolute right-8 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2"
              title="Copy toast message"
            >
              <Copy className="h-4 w-4" />
            </button>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

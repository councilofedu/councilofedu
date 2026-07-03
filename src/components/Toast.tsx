import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success", title?: string, duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { id, title, message, type, duration };
      
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, toasts, removeToast }}>
      {children}
      
      {/* Floating Portal for Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-[calc(100%-2.5rem)] sm:w-96 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const config = getToastConfig(toast.type);
            const Icon = config.icon;

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, y: -20, transition: { duration: 0.15 } }}
                layout
                className={`pointer-events-auto flex gap-3 p-4 rounded-xl shadow-lg border ${config.bgClass} ${config.borderClass} text-slate-800 font-sans`}
              >
                {/* Accent Icon */}
                <div className={`shrink-0 ${config.iconClass} mt-0.5`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Body Text */}
                <div className="flex-1 space-y-1">
                  {toast.title ? (
                    <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-tight">
                      {toast.title}
                    </h4>
                  ) : (
                    <h4 className="text-xs font-bold text-slate-950 tracking-tight leading-tight">
                      {config.defaultTitle}
                    </h4>
                  )}
                  <p className="text-[11px] font-medium leading-relaxed text-slate-600">
                    {toast.message}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100/50 transition-colors cursor-pointer self-start h-fit"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// Visual configuration mapper
function getToastConfig(type: ToastType) {
  switch (type) {
    case "success":
      return {
        icon: CheckCircle2,
        bgClass: "bg-emerald-50/95 backdrop-blur-xs",
        borderClass: "border-emerald-200",
        iconClass: "text-emerald-600",
        defaultTitle: "Action Completed Successfully",
      };
    case "error":
      return {
        icon: AlertCircle,
        bgClass: "bg-rose-50/95 backdrop-blur-xs",
        borderClass: "border-rose-200",
        iconClass: "text-rose-600",
        defaultTitle: "Operation Failed",
      };
    case "warning":
      return {
        icon: AlertTriangle,
        bgClass: "bg-amber-50/95 backdrop-blur-xs",
        borderClass: "border-amber-200",
        iconClass: "text-amber-600",
        defaultTitle: "Caution Advised",
      };
    case "info":
    default:
      return {
        icon: Info,
        bgClass: "bg-blue-50/95 backdrop-blur-xs",
        borderClass: "border-blue-200",
        iconClass: "text-blue-600",
        defaultTitle: "Information Bulletin",
      };
  }
}

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import Toast, { type ToastProps } from "./index";

type EnqueueOptions = Omit<ToastProps, "onDismiss" | "shouldDismiss"> & {
  id?: string;
};

type ToastContextType = {
  showToast: (opts: EnqueueOptions) => string;
  hideToast: (id?: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<
    (Required<EnqueueOptions> & { shouldDismiss?: boolean }) | null
  >(null);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

  const hideToast = useCallback((id?: string) => {
    setActive((current) => {
      if (!current) return current;
      if (!id || id === current.id) {
        if (dismissTimerRef.current) {
          clearTimeout(dismissTimerRef.current);
          dismissTimerRef.current = null;
        }
        return null;
      }
      return current;
    });
  }, []);

  const showToast = useCallback(
    (opts: EnqueueOptions) => {
      const id =
        opts.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const normalized: Required<EnqueueOptions> & { shouldDismiss?: boolean } =
        {
          id,
          icon: opts.icon,
          text: opts.text,
          src: opts.src ?? undefined,
          duration: opts.duration ?? 3,
          shouldDismiss: false,
        } as Required<EnqueueOptions> & { shouldDismiss?: boolean };

      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }

      if (active) {
        setActive((current) =>
          current ? { ...current, shouldDismiss: true } : null,
        );

        setTimeout(() => {
          setActive(normalized);
          dismissTimerRef.current = setTimeout(
            () => {
              setActive((current) =>
                current?.id === normalized.id
                  ? { ...current, shouldDismiss: true }
                  : current,
              );
            },
            Math.max(0, Math.floor(normalized.duration * 1000)),
          );
        }, 250);
      } else {
        setActive(normalized);
        dismissTimerRef.current = setTimeout(
          () => {
            setActive((current) =>
              current?.id === normalized.id
                ? { ...current, shouldDismiss: true }
                : current,
            );
          },
          Math.max(0, Math.floor(normalized.duration * 1000)),
        );
      }

      return id;
    },
    [active],
  );

  const contextValue = useMemo<ToastContextType>(
    () => ({ showToast, hideToast }),
    [showToast, hideToast],
  );

  const handleToastDismiss = useCallback(() => {
    setActive(null);
  }, []);

  return (
    <ToastContext.Provider value={contextValue}>
      <View style={styles.root} pointerEvents="box-none">
        {children}
        {active ? (
          <Toast
            key={active.id}
            icon={active.icon}
            text={active.text}
            src={active.src}
            duration={active.duration}
            shouldDismiss={active.shouldDismiss}
            onDismiss={handleToastDismiss}
          />
        ) : null}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

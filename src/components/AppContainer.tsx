import { cn } from "@/lib/utils";

type AppContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppContainer({ children, className }: AppContainerProps) {
  return (
    <div className="bg-background flex items-center justify-center min-h-screen">
      <div className={cn("relative w-full max-w-md h-screen md:h-[90vh] md:max-h-[800px] bg-card md:rounded-2xl shadow-2xl flex flex-col overflow-hidden", className)}>
        {children}
      </div>
    </div>
  );
}

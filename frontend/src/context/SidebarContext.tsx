import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  isDesktopCollapsed: boolean;
  setIsDesktopCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ isDesktopCollapsed, setIsDesktopCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

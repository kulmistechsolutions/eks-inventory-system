import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSidebar } from '../context/SidebarContext';

const Layout = () => {
  const { isDesktopCollapsed } = useSidebar();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className={`transition-all duration-300 ease-in-out ${
        isDesktopCollapsed ? 'lg:pl-16' : 'lg:pl-64'
      }`}>
        <Header />
        <main className="p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;








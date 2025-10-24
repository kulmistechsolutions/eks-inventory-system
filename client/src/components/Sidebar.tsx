import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wrench,
  DollarSign,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isDesktopCollapsed, setIsDesktopCollapsed } = useSidebar();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'sales_tech'] },
    { icon: Package, label: 'Products', path: '/products', roles: ['admin'] },
    { icon: ShoppingCart, label: 'Sales', path: '/sales', roles: ['admin', 'sales_tech'] },
    { icon: Wrench, label: 'Repairs', path: '/repairs', roles: ['admin', 'sales_tech'] },
    { icon: DollarSign, label: 'Debts', path: '/debts', roles: ['admin'] },
    { icon: DollarSign, label: 'Expenses', path: '/expenses', roles: ['admin'] },
    { icon: Users, label: 'Users', path: '/users', roles: ['admin'] },
    { icon: FileText, label: 'Reports', path: '/reports', roles: ['admin'] },
    { icon: User, label: 'Profile', path: '/profile', roles: ['admin', 'sales_tech'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  const NavLinkItem = ({ item }: { item: typeof menuItems[0] }) => (
    <NavLink
      to={item.path}
      onClick={() => setIsMobileMenuOpen(false)}
      className={({ isActive }) =>
        `flex items-center py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
          isDesktopCollapsed 
            ? 'justify-center px-2' 
            : 'px-3 sm:px-4'
        } ${
          isActive
            ? 'bg-primary-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
      title={isDesktopCollapsed ? item.label : undefined}
    >
      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
      {!isDesktopCollapsed && <span className="ml-2 sm:ml-3">{item.label}</span>}
    </NavLink>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-3 left-3 sm:top-4 sm:left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-white shadow-xl transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } ${
          isDesktopCollapsed ? 'w-16 lg:w-16' : 'w-64 sm:w-72 lg:w-64'
        }`}
      >
        {/* Logo */}
        <div className={`flex items-center h-14 sm:h-16 px-3 sm:px-4 border-b border-gray-200 ${
          isDesktopCollapsed ? 'justify-center' : 'justify-start'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            {!isDesktopCollapsed && <span className="text-lg sm:text-xl font-bold text-gray-900">EKS</span>}
          </div>
        </div>

        {/* User Info */}
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <div className={`flex items-center ${
            isDesktopCollapsed ? 'justify-center' : 'space-x-2 sm:space-x-3'
          }`}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-sm sm:text-base">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            {!isDesktopCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <NavLinkItem key={item.path} item={item} />
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className={`flex items-center w-full py-2 sm:py-3 text-xs sm:text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors ${
              isDesktopCollapsed 
                ? 'justify-center px-2' 
                : 'px-3 sm:px-4'
            }`}
            title={isDesktopCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            {!isDesktopCollapsed && <span className="ml-2 sm:ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Desktop Toggle Button */}
      <button
        onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
        className="hidden lg:block fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow border border-gray-200"
        style={{ left: isDesktopCollapsed ? '4rem' : '16rem' }}
      >
        {isDesktopCollapsed ? (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;


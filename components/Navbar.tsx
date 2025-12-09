import React from 'react';
import { AppRoute } from '../types';
import { LayoutDashboard, UserPlus, Users, Activity } from 'lucide-react';

interface NavbarProps {
  currentRoute: AppRoute;
  setRoute: (route: AppRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, setRoute }) => {
  const navItems = [
    { id: AppRoute.DASHBOARD, label: 'แดชบอร์ด', icon: LayoutDashboard },
    { id: AppRoute.REGISTER, label: 'ลงทะเบียน', icon: UserPlus },
    { id: AppRoute.LIST, label: 'รายชื่อผู้อพยพ', icon: Users },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 tracking-tight">RefugeeConnect</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setRoute(item.id)}
                  className={`${
                    currentRoute === item.id
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          {/* Mobile menu button could go here */}
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="sm:hidden flex justify-around border-t border-gray-200 bg-gray-50 py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setRoute(item.id)}
            className={`flex flex-col items-center p-2 rounded-md ${
              currentRoute === item.id ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
             <item.icon className="w-6 h-6" />
             <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
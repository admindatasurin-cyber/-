import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { RegistrationForm } from './components/RegistrationForm';
import { Dashboard } from './components/Dashboard';
import { RefugeeList } from './components/RefugeeList';
import { AppRoute, Refugee } from './types';
import { fetchRefugees } from './services/sheetService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>(AppRoute.DASHBOARD);
  const [data, setData] = useState<Refugee[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const refugees = await fetchRefugees();
    setData(refugees);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [route]); // Refresh data when switching routes (simple strategy)

  const renderContent = () => {
    if (loading && route !== AppRoute.REGISTER) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-500">กำลังเชื่อมต่อฐานข้อมูล...</p>
        </div>
      );
    }

    switch (route) {
      case AppRoute.DASHBOARD:
        return <Dashboard data={data} />;
      case AppRoute.REGISTER:
        return <RegistrationForm />;
      case AppRoute.LIST:
        return <RefugeeList data={data} />;
      default:
        return <Dashboard data={data} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentRoute={route} setRoute={setRoute} />
      <main>
        {renderContent()}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
           <p className="text-center text-sm text-gray-500">
             &copy; {new Date().getFullYear()} RefugeeConnect ระบบจัดการข้อมูลความปลอดภัยสูง
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
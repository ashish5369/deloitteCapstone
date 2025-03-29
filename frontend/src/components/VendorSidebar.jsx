import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaCalendarAlt, FaUser, FaMoneyBillWave } from 'react-icons/fa';

function VendorSidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/vendor', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/vendor/events', label: 'My Events', icon: <FaCalendarAlt /> },
    { path: '/vendor/profile', label: 'Profile', icon: <FaUser /> },
    { path: '/vendor/finance', label: 'Finance', icon: <FaMoneyBillWave /> },
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-center text-gray-800 tracking-wide">EventZen</h1>
        <p className="text-sm text-gray-500 text-center mt-1">Vendor Panel</p>
      </div>
      <nav className="flex-1 mt-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-lg font-medium transition-colors duration-300 ${location.pathname === item.path
                ? 'bg-purple-100 text-purple-600'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
              }`}
          >
            <span className="mr-4 text-xl">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">© 2025 EventZen</p>
        <p className="text-sm text-gray-500 text-center">Created by Ashish</p>

      </div>
    </div>
  );
}

export default VendorSidebar;
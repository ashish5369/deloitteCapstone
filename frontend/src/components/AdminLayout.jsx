import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Header from './Header';

function AdminLayout() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white shadow-lg rounded-tl-lg p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
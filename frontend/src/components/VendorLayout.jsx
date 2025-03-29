import { Outlet } from 'react-router-dom';
import VendorSidebar from './VendorSidebar';
import Header from './Header';

function VendorLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <VendorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default VendorLayout;
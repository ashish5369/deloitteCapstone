import { Outlet } from 'react-router-dom';
import CustomerSidebar from './CustomerSidebar';
import Header from './Header';

function CustomerLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <CustomerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CustomerLayout;
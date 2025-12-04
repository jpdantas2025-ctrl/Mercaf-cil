import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import LoginAdmin from './auth/LoginAdmin';
import MarketList from './components/MarketList';
import MarketForm from './components/MarketForm';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import DriverList from './components/DriverList';
import DriverForm from './components/DriverForm';
import PayoutList from './components/PayoutList';
import { LayoutDashboard, Store, ShoppingBag, Bike, DollarSign, LogOut } from 'lucide-react';

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Carregando...</div>;
  return user ? children : <Navigate to="/login" />;
}

function AdminLayout({ children }) {
  const { logout, user } = useContext(AuthContext);
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-orange-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-orange-600">Mercafácil</div>
        <nav className="flex-1 p-4 space-y-2">
            <Link to="/" className="flex items-center gap-3 p-3 hover:bg-orange-600 rounded transition-colors">
                <LayoutDashboard size={20}/> Dashboard
            </Link>
            <Link to="/markets" className="flex items-center gap-3 p-3 hover:bg-orange-600 rounded transition-colors">
                <Store size={20}/> Mercados
            </Link>
            <Link to="/products" className="flex items-center gap-3 p-3 hover:bg-orange-600 rounded transition-colors">
                <ShoppingBag size={20}/> Produtos
            </Link>
            <Link to="/drivers" className="flex items-center gap-3 p-3 hover:bg-orange-600 rounded transition-colors">
                <Bike size={20}/> Motoristas
            </Link>
            <Link to="/payouts" className="flex items-center gap-3 p-3 hover:bg-orange-600 rounded transition-colors">
                <DollarSign size={20}/> Financeiro
            </Link>
        </nav>
        <div className="p-4 border-t border-orange-600">
            <div className="mb-2 text-sm opacity-75">Olá, {user?.name || 'Admin'}</div>
            <button onClick={logout} className="flex items-center gap-2 text-sm hover:text-orange-200">
                <LogOut size={16}/> Sair
            </button>
        </div>
      </aside>
      
      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginAdmin />} />
          
          <Route path="/" element={<PrivateRoute><AdminLayout><PayoutList /></AdminLayout></PrivateRoute>} />
          
          <Route path="/markets" element={<PrivateRoute><AdminLayout><MarketList /></AdminLayout></PrivateRoute>} />
          <Route path="/markets/new" element={<PrivateRoute><AdminLayout><MarketForm /></AdminLayout></PrivateRoute>} />
          
          <Route path="/products" element={<PrivateRoute><AdminLayout><ProductList /></AdminLayout></PrivateRoute>} />
          <Route path="/products/new" element={<PrivateRoute><AdminLayout><ProductForm /></AdminLayout></PrivateRoute>} />
          
          <Route path="/drivers" element={<PrivateRoute><AdminLayout><DriverList /></AdminLayout></PrivateRoute>} />
          <Route path="/drivers/new" element={<PrivateRoute><AdminLayout><DriverForm /></AdminLayout></PrivateRoute>} />
          
          <Route path="/payouts" element={<PrivateRoute><AdminLayout><PayoutList /></AdminLayout></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
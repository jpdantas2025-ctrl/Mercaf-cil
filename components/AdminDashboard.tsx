

import React, { useState } from 'react';
import { BarChart3, Store, DollarSign, Users, TrendingUp, AlertCircle, Plus, Edit, Trash2, X, Save, Package, Search, Zap, ShoppingBag, Utensils, Leaf, Coffee, Sparkles, Snowflake, Fish, Tag, Bike, Car, Footprints, ClipboardList, CheckCircle, Clock, Ban, MapPin } from 'lucide-react';
import { Button } from './Button';
import { Order, Municipality, Product, Driver } from '../types';
import { CATEGORIES } from '../constants';
import { AdminOrderList } from './AdminOrderList';
import { FinancialDashboard } from './FinancialDashboard'; // New Import

interface AdminDashboardProps {
  orders: Order[];
  totalPayouts: number;
  products: Product[];
  drivers?: Driver[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  orders, 
  totalPayouts, 
  products,
  drivers = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'drivers' | 'financial'>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Stats calculation
  const completedOrders = orders.filter(o => o.status === 'delivered');
  const totalRevenue = completedOrders.reduce((acc, o) => acc + o.total, 0);
  const platformRevenue = completedOrders.reduce((acc, o) => acc + o.commission.platform, 0);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const getCategoryIcon = (category: string) => {
    const c = category.toLowerCase();
    const props = { size: 14, className: "mr-1.5" };
    
    if (c.includes('oferta') || c.includes('relâmpago')) return <Zap {...props} className="mr-1.5 text-yellow-600" />;
    if (c.includes('limpeza')) return <Sparkles {...props} className="mr-1.5 text-purple-600" />;
    if (c.includes('congelad') || c.includes('sorvete')) return <Snowflake {...props} className="mr-1.5 text-cyan-600" />;
    if (c.includes('peix')) return <Fish {...props} className="mr-1.5 text-blue-500" />;
    if (c.includes('bebida') || c.includes('leite') || c.includes('latic') || c.includes('café')) return <Coffee {...props} className="mr-1.5 text-amber-700" />;
    if (c.includes('horti') || c.includes('frut') || c.includes('legum') || c.includes('veget')) return <Leaf {...props} className="mr-1.5 text-green-600" />;
    if (c.includes('açoug') || c.includes('carn') || c.includes('churras')) return <Utensils {...props} className="mr-1.5 text-red-600" />;
    if (c.includes('mercearia') || c.includes('alimento') || c.includes('grão')) return <ShoppingBag {...props} className="mr-1.5 text-orange-600" />;
    
    return <Tag {...props} className="mr-1.5 text-gray-500" />;
  };

  const getDriverStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"><CheckCircle size={10} /> Disponível</span>;
      case 'busy':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"><Clock size={10} /> Ocupado</span>;
      case 'offline':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200"><Ban size={10} /> Offline</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Painel Administrativo</h2>
          <p className="text-gray-500">Gestão geral do Mercafácil Roraima</p>
        </div>
        
        <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm overflow-x-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'orders' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Pedidos
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'products' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Produtos
          </button>
          <button 
            onClick={() => setActiveTab('drivers')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'drivers' ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Motoristas
          </button>
          <button 
            onClick={() => setActiveTab('financial')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'financial' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <DollarSign size={14} /> Financeiro
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><TrendingUp size={20} /></div>
                <span className="text-xs text-green-600 font-medium">+12% hoje</span>
              </div>
              <p className="text-sm text-gray-500">Vendas Totais</p>
              <h3 className="text-2xl font-bold text-gray-900">R$ {totalRevenue.toFixed(2)}</h3>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><DollarSign size={20} /></div>
              </div>
              <p className="text-sm text-gray-500">Receita Plataforma (10%)</p>
              <h3 className="text-2xl font-bold text-gray-900">R$ {platformRevenue.toFixed(2)}</h3>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Users size={20} /></div>
              </div>
              <p className="text-sm text-gray-500">Motoristas Ativos</p>
              <h3 className="text-2xl font-bold text-gray-900">{drivers.length}</h3>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-50 rounded-lg text-green-600"><Store size={20} /></div>
              </div>
              <p className="text-sm text-gray-500">Produtos Cadastrados</p>
              <h3 className="text-2xl font-bold text-gray-900">{products.length}</h3>
            </div>
          </div>

          {/* Quick Order Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Últimos Pedidos</h3>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')}>Ver todos</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">ID Pedido</th>
                    <th className="px-6 py-3">Município</th>
                    <th className="px-6 py-3">Valor Total</th>
                    <th className="px-6 py-3 text-green-600">Motorista (10%)</th>
                    <th className="px-6 py-3">Tempo Est.</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-400">Nenhum pedido registrado ainda.</td>
                    </tr>
                  ) : (
                    orders.slice().reverse().slice(0, 5).map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium">#{order.id.slice(-6)}</td>
                        <td className="px-6 py-4">{order.municipality}</td>
                        <td className="px-6 py-4">R$ {order.total.toFixed(2)}</td>
                        <td className="px-6 py-4">R$ {order.commission.driver.toFixed(2)}</td>
                        <td className="px-6 py-4 text-gray-500">{order.estimatedDeliveryTime ? `${order.estimatedDeliveryTime} min` : '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                            order.status === 'delivering' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'accepted' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status === 'delivered' ? 'Entregue' : 
                             order.status === 'delivering' ? 'Em Rota' :
                             order.status === 'accepted' ? 'Aceito' : 'Pendente'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <ClipboardList size={20} />
              Gestão de Pedidos
            </h3>
            <AdminOrderList orders={orders} />
        </div>
      )}

      {/* DRIVERS TAB */}
      {activeTab === 'drivers' && (
        <div className="space-y-6 animate-in fade-in duration-300">
           <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Users size={20} />
              Gestão de Motoristas
            </h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">Nome</th>
                            <th className="px-6 py-3">Município</th>
                            <th className="px-6 py-3">Veículo</th>
                            <th className="px-6 py-3">Pontos / Nível</th>
                            <th className="px-6 py-3">Ganhos</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {drivers.map(driver => (
                            <tr key={driver.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{driver.name}</td>
                                <td className="px-6 py-4">{driver.municipality}</td>
                                <td className="px-6 py-4 flex items-center gap-2 capitalize">
                                    {driver.vehicleType === 'motorcycle' && <Bike size={16}/>}
                                    {driver.vehicleType === 'car' && <Car size={16}/>}
                                    {driver.vehicleType === 'bike' && <Bike size={16}/>}
                                    {driver.vehicleType === 'walking' && <Footprints size={16}/>}
                                    {driver.vehicleType === 'on_foot' && <Footprints size={16}/>}
                                    {driver.vehicleType === 'on_foot' ? 'A pé' : driver.vehicleType}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold">{driver.points} pts</span>
                                        <span className="text-xs text-gray-500">{driver.level}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-green-600 font-bold">R$ {driver.earnings.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    {getDriverStatusBadge(driver.status)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Package size={20} />
              Catálogo de Produtos
            </h3>
            <Button onClick={handleOpenAddModal}>
              <Plus size={16} className="mr-2" />
              Novo Produto
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             {/* Filter Bar (Placeholder) */}
             <div className="p-4 border-b border-gray-100 flex gap-4">
               <div className="relative flex-1">
                 <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="Buscar produtos por nome..." 
                   className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                 />
               </div>
             </div>

             <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Produto</th>
                    <th className="px-6 py-3">Categoria</th>
                    <th className="px-6 py-3">Loja</th>
                    <th className="px-6 py-3">Preço</th>
                    <th className="px-6 py-3">Estoque</th>
                    <th className="px-6 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt="" className="w-10 h-10 rounded-md object-cover bg-gray-100" />
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs flex items-center w-fit border border-gray-200">
                          {getCategoryIcon(product.category)}
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.store}</td>
                      <td className="px-6 py-4 font-medium">R$ {product.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${
                             (product.stock || 0) > 20 ? 'bg-green-50' : 
                             (product.stock || 0) > 0 ? 'bg-yellow-50' : 'bg-red-500'
                           }`}></div>
                           {(product.stock || 0)} un
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => onDeleteProduct(product.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
             </div>
          </div>
        </div>
      )}

      {/* FINANCIAL TAB (NEW) */}
      {activeTab === 'financial' && (
        <FinancialDashboard />
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <ProductFormModal 
          product={editingProduct}
          onClose={() => setIsModalOpen(false)}
          onSave={(p) => {
            if (editingProduct) {
              onUpdateProduct({ ...editingProduct, ...p });
            } else {
              onAddProduct(p);
            }
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

// Internal Sub-component: Product Form Modal
interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: any) => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    description: product?.description || '',
    image: product?.image || '',
    category: product?.category || CATEGORIES[1].name,
    stock: product?.stock !== undefined ? product.stock : '', // Allows number or empty string
    store: product?.store || 'Mercado Geral', // Default store
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900">{product ? 'Editar Produto' : 'Novo Produto'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
            <input 
              required
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
              <input 
                required
                type="number" 
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
              <input 
                required
                type="number" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                <option value="Outros">Outros</option>
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loja</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={formData.store}
                onChange={e => setFormData({...formData, store: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
            <input 
              required
              type="url" 
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              value={formData.image}
              onChange={e => setFormData({...formData, image: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea 
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit">
              <Save size={18} className="mr-2" />
              Salvar Produto
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
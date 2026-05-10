import { useApiStorage } from '../../hooks/useApiData';
import React, { useState, useEffect } from 'react';
import { Buyer, Order } from './types';
import { INITIAL_BUYERS, INITIAL_ORDERS } from './mockData';
import { LayoutDashboard, Users, ShoppingCart } from 'lucide-react';
import { OrdersList } from './OrdersList';
import { BuyersList } from './BuyersList';
import { Dashboard } from './Dashboard';

type TabType = 'dashboard' | 'orders' | 'buyers';

interface OrdersBuyersModuleProps {
  navigationPayload?: any;
  onNavigationHandled?: () => void;
}

export function OrdersBuyersModule({ navigationPayload, onNavigationHandled }: OrdersBuyersModuleProps = {}) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [buyers, setBuyers] = useApiStorage('aqm_ordersbuyers_buyers', INITIAL_BUYERS);
  const [orders, setOrders] = useApiStorage('aqm_ordersbuyers_orders', INITIAL_ORDERS);
  const [externalViewOrderId, setExternalViewOrderId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Handle external navigation payload passed via props
    if (navigationPayload?.styleNumber || navigationPayload?.poArticleNumber) {
      setActiveTab('orders');
      const order = orders.find(o => 
        (navigationPayload.styleNumber && o.styleNumber === navigationPayload.styleNumber) ||
        (navigationPayload.poArticleNumber && o.poArticleNumber === navigationPayload.poArticleNumber)
      );
      if (order) {
        setExternalViewOrderId(order.id);
      }
      if (onNavigationHandled) {
        onNavigationHandled();
      }
    }
    
    // Also keep the event listener for when component is already mounted
    const handleNav = (e: CustomEvent) => {
      if (e.detail?.module === 'orders_and_buyers' && (e.detail?.styleNumber || e.detail?.poArticleNumber)) {
        setActiveTab('orders');
        const order = orders.find(o => 
          (e.detail.styleNumber && o.styleNumber === e.detail.styleNumber) ||
          (e.detail.poArticleNumber && o.poArticleNumber === e.detail.poArticleNumber)
        );
        if (order) {
          setExternalViewOrderId(order.id);
        }
      }
    };

    const handleFullscreen = (e: CustomEvent) => {
      setIsFullscreen(!!e.detail);
    };

    window.addEventListener('app-navigate', handleNav as EventListener);
    window.addEventListener('app-fullscreen', handleFullscreen as EventListener);
    return () => {
      window.removeEventListener('app-navigate', handleNav as EventListener);
      window.removeEventListener('app-fullscreen', handleFullscreen as EventListener);
    };
  }, [navigationPayload, orders, onNavigationHandled]);

  // Example handlers for updating state
  const handleSaveBuyer = (buyer: Buyer) => {
    if (buyers.find(b => b.id === buyer.id)) {
      setBuyers(buyers.map(b => b.id === buyer.id ? buyer : b));
    } else {
      setBuyers([...buyers, buyer]);
    }
  };

  const handleDeleteBuyer = (ids: string[]) => {
    setBuyers(buyers.filter(b => !ids.includes(b.id)));
  };

  const handleSaveOrder = (order: Order) => {
    if (orders.find(o => o.id === order.id)) {
      setOrders(orders.map(o => o.id === order.id ? order : o));
    } else {
      setOrders([...orders, order]);
    }
  };

  const handleDeleteOrder = (ids: string[]) => {
    setOrders(orders.filter(o => !ids.includes(o.id)));
  };

  // Internal Navigation
  const renderNav = () => (
    <div className="flex bg-white rounded-lg p-1 border border-slate-200 mb-6 shrink-0 w-fit">
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'dashboard' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <LayoutDashboard className="w-4 h-4" /> Dashboard
      </button>
      <button
        onClick={() => setActiveTab('orders')}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'orders' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <ShoppingCart className="w-4 h-4" /> Orders
      </button>
      <button
        onClick={() => setActiveTab('buyers')}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'buyers' ? 'bg-slate-100 text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
      >
        <Users className="w-4 h-4" /> Buyers
      </button>
    </div>
  );

  return (
    <div className={`w-full h-full flex flex-col ${isFullscreen ? 'bg-slate-50' : ''}`}>
      {!isFullscreen && renderNav()}

      <div className={`flex-1 overflow-y-auto w-full ${isFullscreen ? 'h-full' : ''}`}>
        {activeTab === 'dashboard' && (
          <Dashboard buyers={buyers} orders={orders} />
        )}
        {activeTab === 'orders' && (
          <OrdersList 
            orders={orders} 
            buyers={buyers} 
            onSave={handleSaveOrder} 
            onDelete={handleDeleteOrder} 
            externalViewOrderId={externalViewOrderId}
            onExternalViewHandled={() => setExternalViewOrderId(null)}
          />
        )}
        {activeTab === 'buyers' && (
          <BuyersList 
            buyers={buyers} 
            orders={orders}
            onSave={handleSaveBuyer} 
            onDelete={handleDeleteBuyer} 
          />
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../utils/supabaseClient';
import { Clock, ChevronDown, ChevronRight, Coffee, Check, X } from 'lucide-react';

const OrderQueue = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    // Subscribe to new orders
    const ordersSubscription = supabase
      .channel('orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      ordersSubscription.unsubscribe();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name),
            order_item_customizations (
              *,
              customizations (name)
            )
          ),
          promotions:applied_promotion_id (
            name,
            discount_type,
            discount_value
          )
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (orderError) throw orderError;

      // Add status history
      const { error: historyError } = await supabase
        .from('order_status_history')
        .insert([{
          order_id: orderId,
          new_status: status,
          changed_by: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (historyError) throw historyError;

      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Rest of the component remains the same...
  // (Keep existing JSX and other functions)

  return (
    // Keep existing JSX, but update the order display to show discount info:
    <div className="space-y-6">
      {/* ... existing header ... */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No orders in queue
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
              >
                {/* ... existing order header ... */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-200 p-4 space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-start justify-between">
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.quantity}x {item.products.name}
                            </div>
                            {/* ... customizations and notes ... */}
                          </div>
                          <span className="text-gray-600">
                            ${item.subtotal.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total and Discount Information */}
                    <div className="border-t pt-4">
                      {order.discount_amount > 0 && (
                        <>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="text-gray-900">${order.total_before_discount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">
                              Discount:
                              {order.promotions && (
                                <span className="text-sm text-green-600 ml-1">
                                  ({order.promotions.name})
                                </span>
                              )}
                            </span>
                            <span className="text-red-600">-${order.discount_amount.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium text-gray-700">Total Amount:</span>
                        <span className="text-lg font-semibold text-gray-900">
                          ${order.total_amount.toFixed(2)}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'cancelled')}
                              className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              className="px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderQueue;
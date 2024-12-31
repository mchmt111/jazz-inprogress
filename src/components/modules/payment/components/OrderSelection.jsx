import React from 'react';
import { Coffee } from 'lucide-react';

const OrderSelection = ({ orders, selectedOrder, onSelectOrder }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Order</h4>
    <div className="space-y-4">
      {orders.map((order) => (
        <button
          key={order.id}
          onClick={() => onSelectOrder(order)}
          className={`w-full p-4 rounded-lg border transition-all ${
            selectedOrder?.id === order.id
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 hover:bg-gray-100'
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="font-medium text-gray-900">
                Order #{order.order_number}
              </p>
              <p className="text-sm text-gray-500">
                {order.order_items.length} items
              </p>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              ${order.total_amount.toFixed(2)}
            </p>
          </div>
        </button>
      ))}

      {orders.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No pending orders
        </div>
      )}
    </div>
  </div>
);
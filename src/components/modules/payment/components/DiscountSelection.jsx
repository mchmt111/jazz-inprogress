import React from 'react';
import { Tag, Percent } from 'lucide-react';

const DiscountSelection = ({
  activePromos,
  selectedPromo,
  discountType,
  manualDiscount,
  onSelectPromo,
  onChangeDiscountType,
  onChangeManualDiscount
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <h4 className="text-lg font-semibold text-gray-900 mb-4">Apply Discount</h4>
    
    <div className="space-y-4">
      <div className="flex space-x-4">
        <button
          onClick={() => onChangeDiscountType('none')}
          className={`flex-1 p-3 rounded-lg border transition-colors ${
            discountType === 'none'
              ? 'bg-white border-green-500 text-green-600'
              : 'border-gray-200 hover:bg-gray-100'
          }`}
        >
          No Discount
        </button>
        <button
          onClick={() => onChangeDiscountType('manual')}
          className={`flex-1 p-3 rounded-lg border transition-colors ${
            discountType === 'manual'
              ? 'bg-white border-green-500 text-green-600'
              : 'border-gray-200 hover:bg-gray-100'
          }`}
        >
          Manual
        </button>
        <button
          onClick={() => onChangeDiscountType('promo')}
          className={`flex-1 p-3 rounded-lg border transition-colors ${
            discountType === 'promo'
              ? 'bg-white border-green-500 text-green-600'
              : 'border-gray-200 hover:bg-gray-100'
          }`}
        >
          Promotion
        </button>
      </div>

      {discountType === 'manual' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={manualDiscount}
              onChange={(e) => onChangeManualDiscount(parseFloat(e.target.value) || 0)}
              className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            />
          </div>
        </div>
      )}

      {discountType === 'promo' && (
        <div className="space-y-4">
          {activePromos.map((promo) => (
            <button
              key={promo.id}
              onClick={() => onSelectPromo(promo)}
              className={`w-full p-4 rounded-lg border transition-all ${
                selectedPromo?.id === promo.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <p className="font-medium text-gray-900">{promo.name}</p>
                  <p className="text-sm text-gray-500">{promo.description}</p>
                </div>
                <p className="font-medium text-green-600">
                  {promo.discount_type === 'percentage'
                    ? `${promo.discount_value}%`
                    : `$${promo.discount_value}`}
                </p>
              </div>
            </button>
          ))}

          {activePromos.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No active promotions
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);
import React from 'react';
import { AlertCircle } from 'lucide-react';
import DenominationInput from './DenominationInput';

const PaymentSummary = ({
  order,
  discount,
  total,
  amountTendered,
  changeAmount,
  onAmountTenderedChange,
  onSubmit,
  loading,
  error
}) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
    <h4 className="text-xl font-semibold text-gray-900 mb-6">
      Payment Details
    </h4>

    <div className="space-y-6">
      {/* Order Summary */}
      <div className="space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span>${order.total_amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Discount:</span>
          <span>-${discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-semibold text-gray-900 pt-3 border-t">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Cash Input */}
      <DenominationInput
        onTotalChange={onAmountTenderedChange}
        minimumAmount={total}
      />

      {/* Change Calculation */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount Tendered:</span>
          <span className="font-medium text-gray-900">
            ${amountTendered.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-600">Change:</span>
          <span className="font-medium text-gray-900">
            ${changeAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={loading || amountTendered < total}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          loading || amountTendered < total
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {loading ? 'Processing...' : 'Complete Payment'}
      </button>
    </div>
  </div>
);
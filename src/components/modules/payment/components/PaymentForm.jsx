import React from 'react';
import DenominationInput from './DenominationInput';

const PaymentForm = ({ 
  amountTendered,
  onAmountTenderedChange,
  onSubmit,
  loading,
  error,
  minimumAmount 
}) => {
  return (
    <div className="space-y-4">
      <DenominationInput
        onTotalChange={onAmountTenderedChange}
        minimumAmount={minimumAmount}
      />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={loading || amountTendered < minimumAmount}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          loading || amountTendered < minimumAmount
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {loading ? 'Processing...' : 'Complete Payment'}
      </button>
    </div>
  );
};

export default PaymentForm;
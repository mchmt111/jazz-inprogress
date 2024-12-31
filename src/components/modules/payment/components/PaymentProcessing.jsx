import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../../utils/supabaseClient';
import { processPayment } from '../../../../utils/payment/paymentService';
import { calculateDiscount, calculateTotal, calculateChange } from '../../../../utils/payment/paymentCalculations';
import OrderSelection from './OrderSelection';
import DiscountSelection from './DiscountSelection';
import PaymentSummary from './PaymentSummary';
import PaymentForm from './PaymentForm';

const PaymentProcessing = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [discountType, setDiscountType] = useState('none');
  const [manualDiscount, setManualDiscount] = useState(0);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [amountTendered, setAmountTendered] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handlePayment = async () => {
    if (!selectedOrder) return;
    setLoading(true);
    setError('');

    try {
      await processPayment(
        selectedOrder,
        discountType,
        manualDiscount,
        selectedPromo,
        amountTendered
      );

      // Refresh orders and reset form
      fetchPendingOrders();
      setSelectedOrder(null);
      setDiscountType('none');
      setManualDiscount(0);
      setSelectedPromo(null);
      setAmountTendered(0);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const discount = calculateDiscount(selectedOrder, discountType, manualDiscount, selectedPromo);
  const total = calculateTotal(selectedOrder, discount);
  const change = calculateChange(amountTendered, total);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <OrderSelection
          orders={orders}
          selectedOrder={selectedOrder}
          onSelectOrder={setSelectedOrder}
        />
        
        {selectedOrder && (
          <DiscountSelection
            activePromos={[]} // Fetch from Supabase
            selectedPromo={selectedPromo}
            discountType={discountType}
            manualDiscount={manualDiscount}
            onSelectPromo={setSelectedPromo}
            onChangeDiscountType={setDiscountType}
            onChangeManualDiscount={setManualDiscount}
          />
        )}
      </div>

      {selectedOrder && (
        <div>
          <PaymentSummary
            order={selectedOrder}
            discount={discount}
            total={total}
            amountTendered={amountTendered}
            changeAmount={change}
          />
          
          <PaymentForm
            amountTendered={amountTendered}
            onAmountTenderedChange={setAmountTendered}
            onSubmit={handlePayment}
            loading={loading}
            error={error}
            minimumAmount={total}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentProcessing;
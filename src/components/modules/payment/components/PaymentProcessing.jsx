import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../../utils/supabaseClient';
import { processPayment } from '../../../../utils/payment/paymentService';
import { calculateDiscount, calculateTotal, calculateChange } from '../../../../utils/payment/paymentCalculations';
import PaymentForm from './PaymentForm';
import OrderSelection from './OrderSelection';
import DiscountSelection from './DiscountSelection';
import PaymentSummary from './PaymentSummary';

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activePromos, setActivePromos] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [manualDiscount, setManualDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('none');
  const [amountTendered, setAmountTendered] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingOrders();
    fetchActivePromotions();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, price)
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchActivePromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString());

      if (error) throw error;
      setActivePromos(data || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
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

      setShowReceipt(true);
      resetForm();
      navigate('/dashboard/order/queue');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedOrder(null);
    setSelectedPromo(null);
    setManualDiscount(0);
    setDiscountType('none');
    setAmountTendered(0);
  };

  const currentDiscount = calculateDiscount(selectedOrder, discountType, manualDiscount, selectedPromo);
  const totalAmount = calculateTotal(selectedOrder, currentDiscount);
  const changeAmount = calculateChange(amountTendered, totalAmount);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-semibold text-green-800 mb-2">Payment Processing</h3>
        <p className="text-green-600">Process payments and apply discounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <OrderSelection
            orders={pendingOrders}
            selectedOrder={selectedOrder}
            onSelectOrder={setSelectedOrder}
          />
          
          {selectedOrder && (
            <DiscountSelection
              activePromos={activePromos}
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
          <PaymentSummary
            order={selectedOrder}
            discount={currentDiscount}
            total={totalAmount}
            amountTendered={amountTendered}
            changeAmount={changeAmount}
            onAmountTenderedChange={setAmountTendered}
            onSubmit={handlePayment}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentProcessing;
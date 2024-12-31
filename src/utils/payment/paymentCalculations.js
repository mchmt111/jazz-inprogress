// Payment calculation utilities
export const calculateDiscount = (order, discountType, manualDiscount, selectedPromo) => {
  if (!order) return 0;
  
  if (discountType === 'manual') {
    return manualDiscount;
  } else if (discountType === 'promo' && selectedPromo) {
    const amount = order.total_amount;
    return selectedPromo.discount_type === 'percentage'
      ? (amount * selectedPromo.discount_value) / 100
      : selectedPromo.discount_value;
  }
  
  return 0;
};

export const calculateTotal = (order, discount) => {
  if (!order) return 0;
  return Math.max(0, order.total_amount - discount);
};

export const calculateChange = (amountTendered, totalAmount) => {
  return Math.max(0, amountTendered - totalAmount);
};
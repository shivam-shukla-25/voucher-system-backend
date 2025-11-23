export const calculateSubtotal = (items: any[]) => {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
};

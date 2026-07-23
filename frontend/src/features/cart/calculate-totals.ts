import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  TAX_RATE,
} from "@/constants/site";

export interface OrderTotals {
  subtotal: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  total: number;
}

export interface CalculateOrderTotalsOptions {
  discountPercent?: number;
  includeDelivery?: boolean;
}

export function calculateOrderTotals(
  subtotal: number,
  options: CalculateOrderTotalsOptions = {},
): OrderTotals {
  const { discountPercent = 0, includeDelivery = true } = options;

  const discount = Number((subtotal * (discountPercent / 100)).toFixed(2));
  const taxableAmount = subtotal - discount;
  const tax = Number((taxableAmount * TAX_RATE).toFixed(2));
  const deliveryFee =
    includeDelivery && subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
  const total = Number((taxableAmount + tax + deliveryFee).toFixed(2));

  return { subtotal, discount, tax, deliveryFee, total };
}

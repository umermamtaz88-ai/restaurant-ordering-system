export const ORDER_STATUS_FLOW = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Delivered",
  "Completed",
] as const;

export type OrderStatusValue = (typeof ORDER_STATUS_FLOW)[number] | "Cancelled";

export const KITCHEN_ROLES = ["chef", "admin", "owner"] as const;
export const ADMIN_ROLES = ["admin", "owner"] as const;

export function isKitchenStaff(role?: string | null) {
  if (!role) return false;
  return (KITCHEN_ROLES as readonly string[]).includes(role.toLowerCase());
}

export function isAdmin(role?: string | null) {
  if (!role) return false;
  return (ADMIN_ROLES as readonly string[]).includes(role.toLowerCase());
}

export function statusStepIndex(status: string) {
  if (status === "Cancelled") return -1;
  const idx = ORDER_STATUS_FLOW.indexOf(status as (typeof ORDER_STATUS_FLOW)[number]);
  return idx >= 0 ? idx : 0;
}

/**
 * Kitchen uses 3 simple steps only:
 * New → Start work (Preparing) → Finish (Completed)
 */
export function nextKitchenAction(
  current: string,
): { status: OrderStatusValue; label: string } | null {
  switch (current) {
    case "Pending":
    case "Confirmed":
      return { status: "Preparing", label: "Start work" };
    case "Preparing":
      return { status: "Completed", label: "Finish" };
    case "Ready":
    case "Out for Delivery":
    case "Delivered":
      return { status: "Completed", label: "Finish" };
    default:
      return null;
  }
}

export function nextKitchenStatuses(
  current: string,
  _orderType?: string,
): { status: OrderStatusValue; label: string }[] {
  const action = nextKitchenAction(current);
  return action ? [action] : [];
}

export function statusHint(status: string): string {
  switch (status) {
    case "Pending":
    case "Confirmed":
      return "Order received — waiting for the kitchen";
    case "Preparing":
      return "Your order is being prepared";
    case "Ready":
      return "Ready for pickup";
    case "Out for Delivery":
      return "On the way to you";
    case "Delivered":
      return "Delivered — enjoy!";
    case "Completed":
      return "Order complete";
    case "Cancelled":
      return "This order was cancelled";
    default:
      return status;
  }
}

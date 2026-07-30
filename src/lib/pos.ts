import type { Timestamp } from "firebase/firestore";

export type PaymentMethod = "cash" | "upi" | "card";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  taxRate: number;
  discount: number;
  preparationTime: number;
  veg: boolean;
  imageUrl?: string | null;
  notes?: string | null;
  variant?: string | null;
}

export interface PaymentSplit {
  method: PaymentMethod;
  amount: number;
}

export function formatCurrency(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(value: Timestamp | null | undefined) {
  if (!value) return "—";
  try {
    return new Date(value.toMillis()).toLocaleString();
  } catch {
    return "—";
  }
}

export function buildReceiptText(_orderNumber: number, customerName: string, items: CartItem[], subtotal: number, tax: number, discount: number, total: number, payments: PaymentSplit[], currency = "INR", orderId?: string) {
  const lines = [
    "NEXAVO POS",
    orderId ? `ORDER ID\n${orderId}` : "",
    `Customer: ${customerName || "Walk-in"}`,
    "",
  ].filter(Boolean);
  items.forEach((item) => {
    let itemLabel = item.name;
    if (item.variant) {
      itemLabel += ` [${item.variant}]`;
    }
    lines.push(`${item.quantity}x ${itemLabel} ${formatCurrency(item.price * item.quantity, currency)}`);
    if (item.notes) {
      lines.push(`   * ${item.notes}`);
    }
  });
  lines.push("", `Subtotal: ${formatCurrency(subtotal, currency)}`);
  lines.push(`Tax: ${formatCurrency(tax, currency)}`);
  lines.push(`Discount: ${formatCurrency(discount, currency)}`);
  lines.push(`Total: ${formatCurrency(total, currency)}`);
  lines.push("Payments:");
  payments.forEach((payment) => lines.push(`- ${payment.method.toUpperCase()}: ${formatCurrency(payment.amount, currency)}`));
  return lines.join("\n");
}

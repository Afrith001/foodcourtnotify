//#region node_modules/.nitro/vite/services/ssr/assets/pos-BKnCkGZE.js
function formatCurrency(amount, currency = "INR") {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency,
		maximumFractionDigits: 0
	}).format(amount);
}
function buildReceiptText(_orderNumber, customerName, items, subtotal, tax, discount, total, payments, currency = "INR", orderId) {
	const lines = [
		"NEXAVO POS",
		orderId ? `ORDER ID\n${orderId}` : "",
		`Customer: ${customerName || "Walk-in"}`,
		""
	].filter(Boolean);
	items.forEach((item) => {
		let itemLabel = item.name;
		if (item.variant) itemLabel += ` [${item.variant}]`;
		lines.push(`${item.quantity}x ${itemLabel} ${formatCurrency(item.price * item.quantity, currency)}`);
		if (item.notes) lines.push(`   * ${item.notes}`);
	});
	lines.push("", `Subtotal: ${formatCurrency(subtotal, currency)}`);
	lines.push(`Tax: ${formatCurrency(tax, currency)}`);
	lines.push(`Discount: ${formatCurrency(discount, currency)}`);
	lines.push(`Total: ${formatCurrency(total, currency)}`);
	lines.push("Payments:");
	payments.forEach((payment) => lines.push(`- ${payment.method.toUpperCase()}: ${formatCurrency(payment.amount, currency)}`));
	return lines.join("\n");
}
//#endregion
export { formatCurrency as n, buildReceiptText as t };

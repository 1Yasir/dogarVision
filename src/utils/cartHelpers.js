export function formatPrice(amount) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export function formatQuantity(item) {
  const qty =
    item.unitType === "kg" && item.quantity % 1 !== 0
      ? item.quantity.toFixed(1)
      : item.quantity;
  return `${qty} ${item.unit}`;
}

export function buildWhatsAppMessage(items, totalBill, checkout) {
  const lines = [
    "*🐔 New Order — DogarVision Poultry Farm*",
    "",
    "*Customer Details*",
    `👤 Name: ${checkout.fullName}`,
    `📞 Phone: ${checkout.phone}`,
    `📍 Address: ${checkout.address}`,
    "",
    "*Order Items*",
  ];

  items.forEach((item, index) => {
    const lineTotal = item.unitPrice * item.quantity;
    lines.push(
      `${index + 1}. ${item.name} — ${formatQuantity(item)} × ${formatPrice(item.unitPrice)} = *${formatPrice(lineTotal)}*`
    );
  });

  lines.push("");
  lines.push(`*💰 Total Bill: ${formatPrice(totalBill)}*`);
  lines.push("");
  lines.push("Please confirm my order. Thank you!");

  return lines.join("\n");
}

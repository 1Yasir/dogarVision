/** Minimum purchasable quantity — never allow 0 or negative cart values. */
export const MIN_QUANTITY = 1;

/**
 * Clamps a cart quantity between minQty and available stock.
 * minQty defaults to 1; kg products pass 0.5 from cart line metadata.
 */
export function clampQuantity(rawValue, stockCount, minQty = MIN_QUANTITY) {
  const stock = Math.max(0, Number(stockCount) || 0);
  const floor = Math.max(MIN_QUANTITY, Number(minQty) || MIN_QUANTITY);
  const maxAllowed = stock > 0 ? stock : floor;
  const parsed = Number(rawValue);

  if (Number.isNaN(parsed) || parsed < floor) {
    return { value: floor, hitMax: false, hitMin: true };
  }

  if (parsed > maxAllowed) {
    return { value: maxAllowed, hitMax: true, hitMin: false };
  }

  return { value: parsed, hitMax: false, hitMin: false };
}

/** Admin forms: prices and stock must never be negative. */
export function clampAdminNumeric(rawValue) {
  const parsed = Number(rawValue);
  if (Number.isNaN(parsed)) return 0;
  return Math.max(0, parsed);
}

/** Round kg-style fractional quantities to one decimal place. */
export function roundQuantity(value, unitType) {
  if (unitType === "kg") {
    return Math.round(Number(value) * 10) / 10;
  }
  return Math.floor(Number(value));
}

export const STOCK_MAX_MESSAGE = "Maximum available stock reached";
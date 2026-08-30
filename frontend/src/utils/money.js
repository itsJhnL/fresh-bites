export const toNumber = (price) => Number(String(price ?? "0").replace(/[^\d.]/g, "")) || 0;

export const formatPeso = (value) => `P${value.toFixed(2)}`;

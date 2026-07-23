const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(value: number): string {
  return currencyFormatter.format(value);
}

export function formatDate(
  date: string,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
): string {
  return new Date(date).toLocaleDateString("en-US", options);
}

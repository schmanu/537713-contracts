export const shortenAddress = (address: string) =>
  address.slice(0, 7) + "..." + address.slice(37, 42)

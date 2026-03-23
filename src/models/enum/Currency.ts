export enum Currency {
  VND = 'VND',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
}

export const CurrencyMappingToSymbol: Record<Currency, string> = {
  [Currency.VND]: '₫',
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£',
  [Currency.JPY]: '¥',
}

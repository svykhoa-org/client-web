import { Currency, CurrencyMappingToSymbol } from '@/models/enum/Currency'

interface FormatCurrencyOptions {
  value: number
  locale?: string
  currency?: Currency
}

export const formatCurrency = ({
  value,
  locale = 'vi-VN',
  currency = Currency.VND,
}: FormatCurrencyOptions) => {
  const symbol = CurrencyMappingToSymbol[currency]
  const formattedValue = value.toLocaleString(locale)

  return `${formattedValue} ${symbol}`
}

import { FileSize, FileSizeMappingToBytes, FileSizeMappingToSymbol } from '@/models/enum/FileSize'

interface FormatFileSizeOptions {
  bytes?: number | null
  toUnit?: FileSize
}

export const formatFileSize = ({ bytes, toUnit }: FormatFileSizeOptions): string => {
  const symbol = FileSizeMappingToSymbol[toUnit || FileSize.KB]

  if (bytes == null) {
    return `0 ${symbol}`
  }

  const convertedValue = bytes / (toUnit ? FileSizeMappingToBytes[toUnit] : 1)

  return `${convertedValue.toFixed(2)} ${symbol}`
}

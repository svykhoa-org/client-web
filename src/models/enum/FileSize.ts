export enum FileSize {
  KB = 'KB',
  MB = 'MB',
  GB = 'GB',
}

export const FileSizeMappingToBytes: Record<FileSize, number> = {
  [FileSize.KB]: 1024,
  [FileSize.MB]: 1024 * 1024,
  [FileSize.GB]: 1024 * 1024 * 1024,
}

export const FileSizeMappingToSymbol: Record<FileSize, string> = {
  [FileSize.KB]: 'KB',
  [FileSize.MB]: 'MB',
  [FileSize.GB]: 'GB',
}

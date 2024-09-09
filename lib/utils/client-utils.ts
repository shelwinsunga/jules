
export function createPathname(userId: string | undefined, locationId: string): string {
  if (!userId) {
    throw new Error('CreatePathname requires a userId')
  }
  return `${userId}/${locationId}/`
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}


export function createPathname(userId: string | undefined, locationId: string): string {
  if (!userId) {
    throw new Error('CreatePathname requires a userId')
  }
  return `${userId}/${locationId}/`
}

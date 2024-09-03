
export function sanitize(input: string): string {
    return input.replace(/[^a-zA-Z0-9]/g, '_');
}

export function createPathname(userId: string | undefined, locationId: string): string {
    if (!userId) {
        throw new Error('CreatePathname requires a userId');
    }
    return `${userId}/${locationId}/`;
}

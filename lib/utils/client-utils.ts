
export function sanitize(input: string): string {
    return input.replace(/[^a-zA-Z0-9]/g, '_');
}

export function createPathname(userId: string, projectId: string): string {
    return `${userId}/${projectId}/`;
}

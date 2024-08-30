/**
 * Sanitizes a string to be safe for use in file systems.
 * Replaces non-alphanumeric characters with underscores.
 * 
 * @param input The string to sanitize
 * @returns The sanitized string
 */
export function sanitize(input: string): string {
    return input.replace(/[^a-zA-Z0-9]/g, '_');
}

/**
 * Generates a pathname for a project based on user email, user ID, project title, and project ID.
 * 
 * @param userEmail The user's email address
 * @param userId The user's ID
 * @param projectTitle The project title
 * @param projectId The project ID
 * @returns The generated pathname
 */
export function generateProjectPathname(userEmail: string, userId: string, projectTitle: string, projectId: string): string {
    const sanitizedEmail = sanitize(userEmail);
    const sanitizedTitle = sanitize(projectTitle);
    return `${sanitizedEmail}-${userId}/${sanitizedTitle}-${projectId}/`;
}

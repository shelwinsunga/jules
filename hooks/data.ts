import { db } from "@/lib/constants";

export function useProjectData(projectId: string) {
    return db.useQuery({
        projects: {
            $: {
                where: {
                    id: projectId
                }
            }
        }
    })
}

export function useProjectFiles(projectId: string) {
    return db.useQuery({
        files: {
            $: {
                where: {
                    projectId: projectId
                }
            }
        }
    })
}
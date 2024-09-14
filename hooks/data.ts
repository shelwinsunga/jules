import { db } from '@/lib/constants'

export function useProjectData(projectId: string, userId: string) {
  return db.useQuery({
    projects: {
      $: {
        where: {
          id: projectId,
          user_id: userId,
        },
      },
    },
  })
}

export function useProjectFiles(projectId: string, userId: string) {
  return db.useQuery({
    files: {
      $: {
        where: {
          projectId: projectId,
          user_id: userId,
        },
      },
    },
  })
}

export function getAllProjects(userId: string) {
  return db.useQuery({
    projects: {
      $: {
        where: {
          user_id: userId,
        },
      },
    },
  })
}

export function getAllProjectFiles(projectId: string, userId: string) {
  return db.useQuery({
    files: {
      $: {
        where: {
          projectId: projectId,
          user_id: userId,
        },
      },
    },
  })
}

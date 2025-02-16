import projectsData from '../data/projects.json'

export const dataService = {
  getProjects() {
    return projectsData.projects
  },

  getProjectById(id: number) {
    return projectsData.projects.find(project => project.id === id)
  },

  getProjectScorecards(projectId: number) {
    const project = projectsData.projects.find(p => p.id === projectId)
    return project?.scorecards || []
  },

  getProjectDesignSteps(projectId: number) {
    const project = projectsData.projects.find(p => p.id === projectId)
    return project?.design_steps || []
  }
} 
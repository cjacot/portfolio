import { defineStore } from 'pinia'
import projectsData from '../data/projects.json'

interface ContentBlock {
  id: number
  design_step_id: number
  block_type: 'text' | 'image'
  layout: 'full' | 'half'
  group: number
  order: number
  text_content: string
  image: string
  image_caption: string | null
}

interface DesignStep {
  id: number
  project_id: number
  step_type: 'empathy' | 'definition' | 'ideation' | 'prototype' | 'testing'
  custom_description: string
  content_blocks: ContentBlock[]
  step_type_display?: string
}

interface Scorecard {
  id: number
  project_id: number
  title: string
  description: string
  preview_image: string
  imageAlt: string
  order: number
}

interface Project {
  id: number
  title: string
  description: string
  preview_image: string
  main_image: string
  role: string
  problem: string
  solution: string
  software_used: string
  scorecards?: Scorecard[]
  design_steps: DesignStep[]
}

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [] as Project[],
    currentProject: null as Project | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async getAllProjects() {
      this.loading = true
      this.error = null
      
      try {
        // Format image paths and ensure all required fields
        this.projects = projectsData.projects.map(project => ({
          ...project,
          preview_image: project.preview_image.startsWith('/') ? project.preview_image : `/images/${project.preview_image}`,
          main_image: project.main_image.startsWith('/') ? project.main_image : `/images/${project.main_image}`,
          design_steps: project.design_steps.map(step => ({
            ...step,
            content_blocks: step.content_blocks.map(block => ({
              ...block,
              image: block.image ? (block.image.startsWith('/') ? block.image : `/images/${block.image}`) : ''
            }))
          }))
        }))
      } catch (error) {
        console.error('Error fetching projects:', error)
        this.error = 'Failed to load projects'
      } finally {
        this.loading = false
      }
    },

    async fetchProject(id: string | number) {
      this.loading = true
      this.error = null
      
      try {
        const projectId = typeof id === 'string' ? parseInt(id) : id
        const project = projectsData.projects.find(p => p.id === projectId)
        
        if (!project) {
          throw new Error('Project not found')
        }

        // Format the project data
        this.currentProject = {
          ...project,
          preview_image: project.preview_image.startsWith('/') ? project.preview_image : `/images/${project.preview_image}`,
          main_image: project.main_image.startsWith('/') ? project.main_image : `/images/${project.main_image}`,
          design_steps: project.design_steps.map(step => ({
            ...step,
            step_type_display: this.getStepTypeDisplay(step.step_type),
            content_blocks: step.content_blocks.map(block => ({
              ...block,
              image: block.image ? (block.image.startsWith('/') ? block.image : `/images/${block.image}`) : ''
            }))
          }))
        }
      } catch (error) {
        console.error('Error fetching project:', error)
        this.error = error instanceof Error ? error.message : 'Failed to load project'
        throw error
      } finally {
        this.loading = false
      }
    },

    getStepTypeDisplay(type: string): string {
      const types: { [key: string]: string } = {
        'empathy': 'Empathie',
        'definition': 'Définition',
        'ideation': 'Idéation',
        'prototype': 'Prototypage',
        'testing': 'Tests'
      }
      return types[type] || type
    }
  }
}) 
export type GradeLevelGroupApiResponse = 'PRIMARY' | 'SECONDARY' | 'HIGH_SCHOOL'

export type CatalogCategoryApiResponse = {
  id: number
  name: string
  description: string
}

export type CatalogSubjectApiResponse = {
  id: number
  categoryId: number
  name: string
  description: string
}

export type CatalogGradeApiResponse = {
  id: number
  name: string
  levelGroup: GradeLevelGroupApiResponse
}

export type CatalogSubjectGradeApiResponse = {
  id: number
  subjectId: number
  gradeId: number | null
}

export type CatalogOptionsApiResponse = {
  categories: CatalogCategoryApiResponse[]
  subjects: CatalogSubjectApiResponse[]
  grades: CatalogGradeApiResponse[]
  subjectGrades: CatalogSubjectGradeApiResponse[]
}

export type CreateSubjectRequest = {
  categoryId: number
  name: string
  description?: string
}

export type UpdateSubjectRequest = {
  categoryId: number
  name: string
  description?: string
}

export type CreateGradeRequest = {
  name: string
  levelGroup: GradeLevelGroupApiResponse
}

export type UpdateGradeRequest = {
  name: string
  levelGroup: GradeLevelGroupApiResponse
}

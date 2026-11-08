import type {
  CatalogCategoryApiResponse,
  CatalogGradeApiResponse,
  CatalogOptionsApiResponse,
  CatalogSubjectGradeApiResponse,
  CatalogSubjectApiResponse
} from '@/types/api/catalog'
import type { ApiResponse } from '@/types/api/common'

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

function buildSuccessResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
  return {
    status: 200,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}

const mockCategories: CatalogCategoryApiResponse[] = [
  {
    id: 1,
    name: 'Toan - Tu duy',
    description: 'Cac mon toan pho thong, toan nang cao va tu duy logic.'
  },
  {
    id: 2,
    name: 'Ngon ngu - Van hoc',
    description: 'Tieng Viet, Ngu van va cac mon phat trien nang luc doc viet.'
  },
  {
    id: 3,
    name: 'Ngoai ngu',
    description: 'Cac ngoai ngu pho bien va chuong trinh luyen chung chi.'
  },
  {
    id: 4,
    name: 'Khoa hoc tu nhien',
    description: 'Vat ly, Hoa hoc, Sinh hoc va cac mon khoa hoc ung dung.'
  }
]

const mockSubjects: CatalogSubjectApiResponse[] = [
  {
    id: 1,
    categoryId: 1,
    name: 'Toan',
    description: 'Toan pho thong theo chuong trinh tu tieu hoc den trung hoc pho thong.'
  },
  {
    id: 2,
    categoryId: 1,
    name: 'Toan tu duy',
    description: 'Phat trien tu duy logic, suy luan va giai quyet van de.'
  },
  {
    id: 3,
    categoryId: 2,
    name: 'Tieng Viet',
    description: 'Tieng Viet bac tieu hoc, doc hieu, chinh ta va tap lam van.'
  },
  {
    id: 4,
    categoryId: 2,
    name: 'Ngu van',
    description: 'Ngu van trung hoc co so va trung hoc pho thong.'
  },
  {
    id: 5,
    categoryId: 3,
    name: 'Tieng Anh',
    description: 'Tieng Anh pho thong va giao tiep co ban.'
  },
  {
    id: 6,
    categoryId: 3,
    name: 'IELTS',
    description: 'Luyen thi IELTS theo bon ky nang.'
  },
  {
    id: 7,
    categoryId: 4,
    name: 'Vat ly',
    description: 'Vat ly trung hoc co so va trung hoc pho thong.'
  },
  {
    id: 8,
    categoryId: 4,
    name: 'Hoa hoc',
    description: 'Hoa hoc trung hoc co so va trung hoc pho thong.'
  }
]

const mockGrades: CatalogGradeApiResponse[] = [
  { id: 1, name: 'Lop 1', levelGroup: 'PRIMARY' },
  { id: 2, name: 'Lop 2', levelGroup: 'PRIMARY' },
  { id: 3, name: 'Lop 3', levelGroup: 'PRIMARY' },
  { id: 4, name: 'Lop 4', levelGroup: 'PRIMARY' },
  { id: 5, name: 'Lop 5', levelGroup: 'PRIMARY' },
  { id: 6, name: 'Lop 6', levelGroup: 'SECONDARY' },
  { id: 7, name: 'Lop 7', levelGroup: 'SECONDARY' },
  { id: 8, name: 'Lop 8', levelGroup: 'SECONDARY' },
  { id: 9, name: 'Lop 9', levelGroup: 'SECONDARY' },
  { id: 10, name: 'Lop 10', levelGroup: 'HIGH_SCHOOL' },
  { id: 11, name: 'Lop 11', levelGroup: 'HIGH_SCHOOL' },
  { id: 12, name: 'Lop 12', levelGroup: 'HIGH_SCHOOL' }
]

const mockSubjectGrades: CatalogSubjectGradeApiResponse[] = mockSubjects.flatMap((subject) =>
  mockGrades.map((grade) => ({
    gradeId: grade.id,
    id: subject.id * 100 + grade.id,
    subjectId: subject.id
  }))
)

const mockCatalogOptions: CatalogOptionsApiResponse = {
  categories: mockCategories,
  grades: mockGrades,
  subjectGrades: mockSubjectGrades,
  subjects: mockSubjects
}

export const mockCatalogApi = {
  async getCatalogOptions(): Promise<ApiResponse<CatalogOptionsApiResponse>> {
    await delay()

    return buildSuccessResponse(mockCatalogOptions, 'Get catalog options successfully')
  },
  async createSubject(
    data: import('@/types/api/catalog').CreateSubjectRequest
  ): Promise<ApiResponse<import('@/types/api/catalog').CatalogSubjectApiResponse>> {
    await delay()
    const newSubject = { id: Date.now(), ...data, description: data.description || '' }
    mockSubjects.push(newSubject)
    return buildSuccessResponse(newSubject, 'Subject created successfully')
  },
  async updateSubject(
    id: number,
    data: import('@/types/api/catalog').UpdateSubjectRequest
  ): Promise<ApiResponse<import('@/types/api/catalog').CatalogSubjectApiResponse>> {
    await delay()
    const index = mockSubjects.findIndex((s) => s.id === id)
    if (index === -1) throw new Error('Subject not found')
    mockSubjects[index] = { ...mockSubjects[index], ...data, description: data.description || '' }
    return buildSuccessResponse(mockSubjects[index], 'Subject updated successfully')
  },
  async deleteSubject(id: number): Promise<ApiResponse<void>> {
    await delay()
    const index = mockSubjects.findIndex((s) => s.id === id)
    if (index > -1) mockSubjects.splice(index, 1)
    return buildSuccessResponse(undefined, 'Subject deleted successfully')
  },
  async createGrade(
    data: import('@/types/api/catalog').CreateGradeRequest
  ): Promise<ApiResponse<import('@/types/api/catalog').CatalogGradeApiResponse>> {
    await delay()
    const newGrade = { id: Date.now(), ...data }
    mockGrades.push(newGrade)
    return buildSuccessResponse(newGrade, 'Grade created successfully')
  },
  async updateGrade(
    id: number,
    data: import('@/types/api/catalog').UpdateGradeRequest
  ): Promise<ApiResponse<import('@/types/api/catalog').CatalogGradeApiResponse>> {
    await delay()
    const index = mockGrades.findIndex((g) => g.id === id)
    if (index === -1) throw new Error('Grade not found')
    mockGrades[index] = { ...mockGrades[index], ...data }
    return buildSuccessResponse(mockGrades[index], 'Grade updated successfully')
  },
  async deleteGrade(id: number): Promise<ApiResponse<void>> {
    await delay()
    const index = mockGrades.findIndex((g) => g.id === id)
    if (index > -1) mockGrades.splice(index, 1)
    return buildSuccessResponse(undefined, 'Grade deleted successfully')
  }
}

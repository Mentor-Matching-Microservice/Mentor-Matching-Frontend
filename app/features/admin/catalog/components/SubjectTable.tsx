import { useState } from 'react'
import { FileEdit, Trash2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import type { CatalogCategoryApiResponse, CatalogSubjectApiResponse } from '@/types/api/catalog'
import { DeleteSubjectModal } from './DeleteSubjectModal'

type SubjectTableProps = {
  subjects: CatalogSubjectApiResponse[]
  categories: CatalogCategoryApiResponse[]
  onEdit: (subject: CatalogSubjectApiResponse) => void
  onRefresh: (message?: string) => void
}

export function SubjectTable({ subjects, categories, onEdit, onRefresh }: SubjectTableProps) {
  const [subjectToDelete, setSubjectToDelete] = useState<CatalogSubjectApiResponse | null>(null)

  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown'
  }

  const handleDeleteClick = (subject: CatalogSubjectApiResponse) => {
    setSubjectToDelete(subject)
  }

  return (
    <>
      <div className='hidden overflow-x-auto lg:block'>
        <Table className='min-w-[700px]'>
          <TableHeader>
            <TableRow>
              <TableHead>Môn học</TableHead>
              <TableHead>Danh mục</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className='text-right'>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <div className='bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl'>
                      <BookOpen size={18} />
                    </div>
                    <span className='text-ink font-semibold'>{subject.name}</span>
                  </div>
                </TableCell>
                <TableCell className='text-sm font-medium text-slate-700'>
                  <span className='rounded-full bg-slate-100 px-3 py-1'>
                    {getCategoryName(subject.categoryId)}
                  </span>
                </TableCell>
                <TableCell className='max-w-[250px] truncate text-sm text-slate-600'>
                  {subject.description || 'Không có mô tả'}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-8 w-8 rounded-lg p-0'
                      onClick={() => onEdit(subject)}
                    >
                      <FileEdit size={14} />
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-8 w-8 rounded-lg p-0 text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700'
                      onClick={() => handleDeleteClick(subject)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteSubjectModal
        isOpen={!!subjectToDelete}
        onClose={() => setSubjectToDelete(null)}
        onSuccess={onRefresh}
        subject={subjectToDelete}
      />
    </>
  )
}

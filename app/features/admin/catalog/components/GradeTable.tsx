import { Edit2, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import type { CatalogGradeApiResponse, GradeLevelGroupApiResponse } from '@/types/api/catalog'

import { DeleteGradeModal } from './DeleteGradeModal'

type GradeTableProps = {
  grades: CatalogGradeApiResponse[]
  onEdit: (grade: CatalogGradeApiResponse) => void
  onRefresh: (message?: string) => void
}

const LEVEL_GROUP_LABELS: Record<GradeLevelGroupApiResponse, string> = {
  PRIMARY: 'Cấp 1',
  SECONDARY: 'Cấp 2',
  HIGH_SCHOOL: 'Cấp 3'
}

export function GradeTable({ grades, onEdit, onRefresh }: GradeTableProps) {
  const [deleteGrade, setDeleteGrade] = useState<CatalogGradeApiResponse | null>(null)

  return (
    <>
      <div className='rounded-xl border border-slate-200 bg-white'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='w-[100px] text-center font-semibold text-slate-600'>
                ID
              </TableHead>
              <TableHead className='font-semibold text-slate-600'>Tên Lớp học / Trình độ</TableHead>
              <TableHead className='w-[200px] font-semibold text-slate-600'>Nhóm Cấp bậc</TableHead>
              <TableHead className='w-[150px] text-right font-semibold text-slate-600'>
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.map((grade) => (
              <TableRow key={grade.id} className='group hover:bg-slate-50/50'>
                <TableCell className='text-center font-medium text-slate-500'>
                  #{grade.id}
                </TableCell>
                <TableCell className='font-medium text-slate-900'>{grade.name}</TableCell>
                <TableCell>
                  <span className='inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800'>
                    {LEVEL_GROUP_LABELS[grade.levelGroup] || grade.levelGroup}
                  </span>
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='hover:text-primary h-8 w-8 text-slate-500'
                      onClick={() => onEdit(grade)}
                      title='Sửa'
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-slate-500 hover:text-red-600'
                      onClick={() => setDeleteGrade(grade)}
                      title='Xóa'
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteGradeModal
        isOpen={!!deleteGrade}
        onClose={() => setDeleteGrade(null)}
        onSuccess={onRefresh}
        grade={deleteGrade}
      />
    </>
  )
}

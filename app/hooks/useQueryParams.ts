import { useMemo } from 'react'
import { useSearchParams } from 'react-router'

/* Đọc query string trên URL và chuyển thành object key-value dạng string. */
export function useQueryParams(): Record<string, string> {
  const [searchParams] = useSearchParams()

  return useMemo(() => Object.fromEntries([...searchParams]), [searchParams])
}

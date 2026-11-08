import {
  Calendar,
  CreditCard,
  LayoutDashboard,
  Settings,
  Users,
  UserCircle,
  BookOpen,
  DollarSign,
  BarChart3,
  Shield,
  GraduationCap,
  ClipboardList
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { path } from '@/config/path'

export type DashboardNavItem = {
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
}

export const userNavItems: DashboardNavItem[] = [
  { label: 'Tổng quan', to: path.user.root, icon: LayoutDashboard, end: true },
  { label: 'Lịch học', to: path.user.bookings, icon: Calendar },
  { label: 'Thanh toán', to: path.user.payments, icon: CreditCard },
  { label: 'Hồ sơ', to: path.user.profile, icon: UserCircle }
]

export const mentorNavItems: DashboardNavItem[] = [
  { label: 'Tổng quan', to: path.mentorPanel.root, icon: LayoutDashboard, end: true },
  { label: 'Lịch dạy', to: path.mentorPanel.schedule, icon: Calendar },
  { label: 'Học viên', to: path.mentorPanel.students, icon: GraduationCap },
  { label: 'Thu nhập', to: path.mentorPanel.earnings, icon: DollarSign },
  { label: 'Hồ sơ mentor', to: path.mentorPanel.profile, icon: BookOpen },
  { label: 'Xác thực danh tính', to: path.mentorPanel.verification, icon: Shield }
]

export const adminNavItems: DashboardNavItem[] = [
  { label: 'Tổng quan', to: path.admin.root, icon: LayoutDashboard, end: true },
  { label: 'Người dùng', to: path.admin.users, icon: Users },
  { label: 'Mentor', to: path.admin.mentors, icon: Shield },
  { label: 'Booking', to: path.admin.bookings, icon: ClipboardList },
  { label: 'Danh mục', to: path.admin.catalog, icon: BookOpen },
  { label: 'Báo cáo', to: path.admin.reports, icon: BarChart3 },
  { label: 'Cài đặt', to: path.admin.settings, icon: Settings }
]

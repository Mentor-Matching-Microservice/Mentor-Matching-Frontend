/** Align with backend UserRole: LEARNER, MENTOR, ADMIN */
export const ROLES = {
  LEARNER: 'LEARNER',
  MENTOR: 'MENTOR',
  ADMIN: 'ADMIN'
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { isMockAccessToken } from '@/services/mock/auth.mock.api'
import { userApi } from '@/services/user.api'
import { useAuthStore } from '@/stores/auth-store'
import type { CurrentUserApiResponse } from '@/types/api/user'
import type { CurrentUser, CurrentUserRole } from '@/types/models/user'
import { isAxiosForbiddenError, isAxiosNotFoundError } from '@/utils/http-error'

type JwtPayloadClaims = {
  sub?: string
  email?: string
  fullName?: string
  name?: string
  role?: string
  roles?: string[]
  authorities?: string[]
}

function normalizeRole(rawRole: string): CurrentUserRole | null {
  const cleaned = rawRole.trim().toUpperCase().replace(/^ROLE_/, '')
  if (cleaned === 'LEANER' || cleaned === 'LEARNER') return 'LEARNER'
  if (cleaned === 'MENTOR') return 'MENTOR'
  if (cleaned === 'ADMIN') return 'ADMIN'
  if (cleaned === 'MANAGER') return 'MANAGER'
  return null
}

export function parseJwtClaims(accessToken: string | null): {
  id: string | null
  email: string | null
  fullName: string | null
  roles: CurrentUserRole[]
} {
  if (!accessToken || isMockAccessToken(accessToken)) {
    return { id: null, email: null, fullName: null, roles: [] }
  }

  try {
    const rawToken = accessToken.replace(/^Bearer\s+/i, '')
    const parts = rawToken.split('.')
    if (parts.length < 2) {
      return { id: null, email: null, fullName: null, roles: [] }
    }

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const jsonPayload = decodeURIComponent(
      Array.from(atob(padded))
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    )
    const claims = JSON.parse(jsonPayload) as JwtPayloadClaims
    const rawRoles = [
      ...(Array.isArray(claims.roles) ? claims.roles : []),
      ...(Array.isArray(claims.authorities) ? claims.authorities : []),
      ...(claims.role ? [claims.role] : [])
    ]
    const roles = rawRoles
      .map(normalizeRole)
      .filter((item): item is CurrentUserRole => item !== null)
      .filter((item, index, list) => list.indexOf(item) === index)

    return {
      id: claims.sub ? String(claims.sub) : null,
      email: claims.email ?? null,
      fullName: claims.fullName ?? claims.name ?? null,
      roles
    }
  } catch {
    return { id: null, email: null, fullName: null, roles: [] }
  }
}

export function mapCurrentUserApiResponse(
  data: CurrentUserApiResponse,
  accessToken: string | null = useAuthStore.getState().accessToken
): CurrentUser {
  const jwtClaims = parseJwtClaims(accessToken)
  const responseRoles = [
    ...(Array.isArray(data.roles) ? data.roles : []),
    ...(data.role ? [data.role] : [])
  ]
    .map(normalizeRole)
    .filter((item): item is CurrentUserRole => item !== null)

  const mergedRoles = [...responseRoles, ...jwtClaims.roles].filter(
    (item, index, list) => list.indexOf(item) === index
  )

  return {
    id: String(data.id ?? data.userId ?? jwtClaims.id ?? ''),
    email: data.email ?? jwtClaims.email ?? '',
    fullName: data.fullName || jwtClaims.fullName || '',
    phone: data.phone ?? '',
    userType: data.userType ?? null,
    status: data.status ?? 'ACTIVE',
    roles: mergedRoles.length > 0 ? mergedRoles : ['LEARNER']
  }
}

async function fetchCurrentUser(): Promise<CurrentUser> {
  const accessToken = useAuthStore.getState().accessToken
  const jwtClaims = parseJwtClaims(accessToken)

  if (
    accessToken &&
    !isMockAccessToken(accessToken) &&
    jwtClaims.roles.length > 0 &&
    !jwtClaims.roles.includes('LEARNER')
  ) {
    return {
      id: jwtClaims.id ?? '',
      email: jwtClaims.email ?? '',
      fullName: jwtClaims.fullName || jwtClaims.email || 'Người dùng',
      phone: '',
      userType: null,
      status: 'ACTIVE',
      roles: jwtClaims.roles
    }
  }

  try {
    return mapCurrentUserApiResponse((await userApi.getCurrentUser()).data, accessToken)
  } catch (error) {
    if ((isAxiosNotFoundError(error) || isAxiosForbiddenError(error)) && jwtClaims.id) {
      return {
        id: jwtClaims.id,
        email: jwtClaims.email ?? '',
        fullName: jwtClaims.fullName || jwtClaims.email || '',
        phone: '',
        userType: null,
        status: 'ACTIVE',
        roles: jwtClaims.roles.length > 0 ? jwtClaims.roles : ['LEARNER']
      }
    }

    throw error
  }
}

export function getCurrentUserQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.auth.me,
    queryFn: fetchCurrentUser
  })
}

export function useCurrentUserQuery() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  return useQuery({
    ...getCurrentUserQueryOptions(),
    enabled: hasHydrated && Boolean(accessToken)
  })
}

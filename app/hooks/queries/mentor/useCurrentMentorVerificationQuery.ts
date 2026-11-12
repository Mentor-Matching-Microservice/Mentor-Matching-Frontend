import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import { useAuthStore } from '@/stores/auth-store'
import type { CurrentMentorVerificationApiResponse } from '@/types/api/mentor'
import { isAxiosNotFoundError } from '@/utils/http-error'

const emptyCurrentMentorVerification: CurrentMentorVerificationApiResponse = {
  id: null,
  mentorId: null,
  fullName: null,
  idCardNumber: null,
  idCardFrontUrl: null,
  idCardFrontMediaId: null,
  idCardBackUrl: null,
  idCardBackMediaId: null,
  selfieWithIdUrl: null,
  selfieWithIdMediaId: null,
  verificationStatus: 'UNVERIFIED',
  verifiedBy: null,
  verifiedAt: null,
  rejectionReason: null,
  createdAt: null,
  updatedAt: null
}

async function fetchCurrentMentorVerification(): Promise<CurrentMentorVerificationApiResponse> {
  try {
    return (await mentorApi.getCurrentMentorVerification()).data
  } catch (error) {
    if (isAxiosNotFoundError(error)) {
      return emptyCurrentMentorVerification
    }

    throw error
  }
}

export function getCurrentMentorVerificationQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.mentor.currentVerification,
    queryFn: fetchCurrentMentorVerification
  })
}

export function useCurrentMentorVerificationQuery(enabled = true) {
  const accessToken = useAuthStore((state) => state.accessToken)

  return useQuery({
    ...getCurrentMentorVerificationQueryOptions(),
    enabled: Boolean(accessToken) && enabled
  })
}

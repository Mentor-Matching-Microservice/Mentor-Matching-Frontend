import { HttpStatusCode } from 'axios'

export { HttpStatusCode }

export const HTTP_STATUS = HttpStatusCode

export const isSuccessStatus = (status: number): boolean => {
  return status >= HttpStatusCode.Ok && status < HttpStatusCode.MultipleChoices
}

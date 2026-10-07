export type LinkRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface LinkRequest {
  requestId: string
  registrationId: string
  meterId: string
  userReference: string
  status: LinkRequestStatus
}

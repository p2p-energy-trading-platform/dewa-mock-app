import { randomUUID } from 'node:crypto'

export type LinkRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type FinalLinkRequestStatus = Exclude<LinkRequestStatus, 'PENDING'>

export interface LinkRequest {
  requestId: string
  registrationId: string
  meterId: string
  userReference: string
  status: LinkRequestStatus
  createdAt: string
}

export type NewLinkRequest = Pick<
  LinkRequest,
  'registrationId' | 'meterId' | 'userReference'
>

export const pendingRequests: LinkRequest[] = []

export function addLinkRequest(request: NewLinkRequest): LinkRequest {
  const newRequest: LinkRequest = {
    ...request,
    requestId: randomUUID(),
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  }

  pendingRequests.push(newRequest)

  return { ...newRequest }
}

export function getPendingRequests(): LinkRequest[] {
  return pendingRequests
    .filter((request) => request.status === 'PENDING')
    .map((request) => ({ ...request }))
}

export function getAllLinkRequests(): LinkRequest[] {
  return pendingRequests.map((request) => ({ ...request }))
}

export function getLinkRequestById(requestId: string): LinkRequest | undefined {
  const request = pendingRequests.find((item) => item.requestId === requestId)

  return request ? { ...request } : undefined
}

export function updateLinkRequestStatus(
  requestId: string,
  status: FinalLinkRequestStatus,
): LinkRequest | undefined {
  const request = pendingRequests.find((item) => item.requestId === requestId)

  if (!request) {
    return undefined
  }

  request.status = status

  return { ...request }
}

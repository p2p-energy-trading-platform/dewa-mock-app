import type { LinkRequest, LinkRequestStatus } from '../types/dewa'

const LINK_REQUESTS_ENDPOINT = '/api/link-requests'

export const linkRequestsQueryKey = ['link-requests'] as const

export const linkRequestQueryKey = (requestId: string) =>
  [...linkRequestsQueryKey, requestId] as const

export interface NewLinkRequest {
  registrationId: string
  meterId: string
  userReference: string
}

export interface CreateLinkRequestResponse {
  requestId: string;
  status: 'PENDING'
  message: string
}

export interface LinkRequestStatusResponse {
  registrationId: string
  meterId: string
  status: LinkRequestStatus
}

export interface LinkRequestDecisionResponse {
  success: true
  status: Extract<LinkRequestStatus, 'APPROVED' | 'REJECTED'>
}

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options)

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`

    try {
      const errorBody = (await response.json()) as {
        message?: string
        statusMessage?: string
      }
      message = errorBody.message ?? errorBody.statusMessage ?? message
    } catch {
      // Keep the HTTP status message when the server does not return JSON.
    }

    throw new Error(message)
  }

  return (await response.json()) as T
}

export function getLinkRequests(signal?: AbortSignal): Promise<LinkRequest[]> {
  return requestJson<LinkRequest[]>(LINK_REQUESTS_ENDPOINT, { signal })
}

export function getLinkRequest(
  requestId: string,
  signal?: AbortSignal,
): Promise<LinkRequestStatusResponse> {
  return requestJson<LinkRequestStatusResponse>(
    `${LINK_REQUESTS_ENDPOINT}/${encodeURIComponent(requestId)}`,
    { signal },
  )
}

export function createLinkRequest(
  request: NewLinkRequest,
): Promise<CreateLinkRequestResponse> {
  return requestJson<CreateLinkRequestResponse>(LINK_REQUESTS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
}

export function approveLinkRequest(
  requestId: string,
): Promise<LinkRequestDecisionResponse> {
  return requestJson<LinkRequestDecisionResponse>(
    `${LINK_REQUESTS_ENDPOINT}/${encodeURIComponent(requestId)}/approve`,
    { method: 'POST' },
  )
}

export function rejectLinkRequest(
  requestId: string,
): Promise<LinkRequestDecisionResponse> {
  return requestJson<LinkRequestDecisionResponse>(
    `${LINK_REQUESTS_ENDPOINT}/${encodeURIComponent(requestId)}/reject`,
    { method: 'POST' },
  )
}

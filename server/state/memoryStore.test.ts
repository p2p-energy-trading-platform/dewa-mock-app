import { beforeEach, describe, expect, it } from 'vitest'

import {
  addLinkRequest,
  getAllLinkRequests,
  getLinkRequestById,
  getPendingRequests,
  pendingRequests,
  updateLinkRequestStatus,
} from './memoryStore'

const requestDetails = {
  registrationId: 'REG-123',
  meterId: 'METER-001',
  userReference: 'USER-123',
}

describe('memoryStore', () => {
  beforeEach(() => {
    pendingRequests.length = 0
  })

  it('adds a request with a generated id, timestamp, and PENDING status', () => {
    const request = addLinkRequest(requestDetails)

    expect(request).toMatchObject({ ...requestDetails, status: 'PENDING' })
    expect(request.requestId).toBeTruthy()
    expect(Number.isNaN(Date.parse(request.createdAt))).toBe(false)
    expect(getLinkRequestById(request.requestId)).toEqual(request)
  })

  it('returns pending requests separately from the full request list', () => {
    const pendingRequest = addLinkRequest(requestDetails)
    const approvedRequest = addLinkRequest({
      ...requestDetails,
      registrationId: 'REG-456',
    })

    updateLinkRequestStatus(approvedRequest.requestId, 'APPROVED')

    expect(getPendingRequests().map(({ requestId }) => requestId)).toEqual([
      pendingRequest.requestId,
    ])
    expect(getAllLinkRequests()).toHaveLength(2)
    expect(
      getAllLinkRequests().find(
        ({ requestId }) => requestId === approvedRequest.requestId,
      )?.status,
    ).toBe('APPROVED')
  })

  it.each(['APPROVED', 'REJECTED'] as const)(
    'updates a request status to %s',
    (status) => {
      const request = addLinkRequest(requestDetails)

      expect(updateLinkRequestStatus(request.requestId, status)?.status).toBe(
        status,
      )
      expect(getLinkRequestById(request.requestId)?.status).toBe(status)
    },
  )

  it('returns undefined when a request id is unknown', () => {
    expect(getLinkRequestById('missing-request')).toBeUndefined()
    expect(
      updateLinkRequestStatus('missing-request', 'REJECTED'),
    ).toBeUndefined()
  })
})

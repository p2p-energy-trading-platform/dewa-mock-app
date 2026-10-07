import { describe, expect, it } from 'vitest'

import { linkRequests } from '../src/data/linkRequests'

describe('linkRequests', () => {
  it('contains a pending link request with the expected identifiers', () => {
    expect(linkRequests).toHaveLength(1)
    expect(linkRequests[0]).toMatchObject({
      requestId: 'REQ-001',
      registrationId: 'REG-123',
      meterId: 'METER-001',
      userReference: 'USER-123',
      status: 'PENDING',
    })
  })
})

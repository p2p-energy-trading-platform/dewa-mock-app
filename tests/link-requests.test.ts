import { describe, expect, it } from 'vitest'

import { linkRequests } from '../src/data/linkRequests'

describe('linkRequests', () => {
  it('contains a mixed queue of mock smart meter link requests', () => {
    expect(linkRequests).toHaveLength(8)
    expect(linkRequests[0]).toMatchObject({
      requestId: 'REQ-1048',
      registrationId: 'REG-283741',
      meterId: 'DEWA-59382174',
      userReference: 'USR-726140',
      status: 'PENDING',
    })
    expect(linkRequests.filter((request) => request.status === 'PENDING'))
      .toHaveLength(5)
  })
})

import { HTTPError, defineEventHandler, getRouterParam } from 'nitro/h3'

import { updateLinkRequestStatus } from '../../../state/memoryStore'

export default defineEventHandler((event) => {
  if (event.req.method !== 'POST') {
    throw new HTTPError({ status: 405, statusText: 'Method Not Allowed' })
  }

  const requestId = getRouterParam(event, 'requestId')

  if (!requestId) {
    throw new HTTPError({
      status: 400,
      statusText: 'Bad Request',
      message: 'requestId is required.',
    })
  }

  const request = updateLinkRequestStatus(requestId, 'REJECTED')

  if (!request) {
    throw new HTTPError({
      status: 404,
      statusText: 'Not Found',
      message: 'Link request not found.',
    })
  }

  return { success: true, status: 'REJECTED' }
})

import { HTTPError, defineEventHandler, getRouterParam } from 'nitro/h3'

import { getLinkRequestById } from '../../../state/memoryStore'

export default defineEventHandler((event) => {
  if (event.req.method !== 'GET') {
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

  const request = getLinkRequestById(requestId)

  if (!request) {
    throw new HTTPError({
      status: 404,
      statusText: 'Not Found',
      message: 'Link request not found.',
    })
  }

  return {
    registrationId: request.registrationId,
    meterId: request.meterId,
    status: request.status,
  }
})

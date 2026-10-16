import { createError, defineEventHandler, getRouterParam } from 'nitro/h3'

import { getLinkRequestById } from '../../../state/memoryStore'

export default defineEventHandler((event) => {
  if (event.method !== 'GET') {
    throw createError({ status: 405, statusText: 'Method Not Allowed' })
  }

  const requestId = getRouterParam(event, 'requestId')

  if (!requestId) {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'requestId is required.',
    })
  }

  const request = getLinkRequestById(requestId)

  if (!request) {
    throw createError({
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

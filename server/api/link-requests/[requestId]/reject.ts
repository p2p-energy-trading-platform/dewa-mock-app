import { createError, defineEventHandler, getRouterParam } from 'nitro/h3'

import { updateLinkRequestStatus } from '../../../state/memoryStore'

export default defineEventHandler((event) => {
  if (event.method !== 'POST') {
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

  const request = updateLinkRequestStatus(requestId, 'REJECTED')

  if (!request) {
    throw createError({
      status: 404,
      statusText: 'Not Found',
      message: 'Link request not found.',
    })
  }

  return { success: true, status: 'REJECTED' }
})

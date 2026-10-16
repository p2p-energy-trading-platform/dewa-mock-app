import {
  createError,
  defineEventHandler,
  readBody,
  setResponseStatus,
} from 'nitro/h3'

import { addLinkRequest, getAllLinkRequests } from '../../state/memoryStore'

interface CreateLinkRequestBody {
  registrationId: string
  meterId: string
  userReference: string
}

function isCreateLinkRequestBody(body: unknown): body is CreateLinkRequestBody {
  if (typeof body !== 'object' || body === null) {
    return false
  }

  const candidate = body as Record<string, unknown>

  return (
    typeof candidate.registrationId === 'string' &&
    candidate.registrationId.trim().length > 0 &&
    typeof candidate.meterId === 'string' &&
    candidate.meterId.trim().length > 0 &&
    typeof candidate.userReference === 'string' &&
    candidate.userReference.trim().length > 0
  )
}

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    return getAllLinkRequests()
  }

  if (event.method !== 'POST') {
    throw createError({ status: 405, statusText: 'Method Not Allowed' })
  }

  const body = await readBody<unknown>(event)

  if (!isCreateLinkRequestBody(body)) {
    throw createError({
      status: 400,
      statusText: 'Bad Request',
      message: 'registrationId, meterId, and userReference are required.',
    })
  }

  addLinkRequest({
    registrationId: body.registrationId.trim(),
    meterId: body.meterId.trim(),
    userReference: body.userReference.trim(),
  })

  setResponseStatus(event, 201)

  return { status: 'PENDING', message: 'Link request created' }
})

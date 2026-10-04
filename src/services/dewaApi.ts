import { linkRequests } from '../data/linkRequests'
import type { LinkRequest } from '../types/dewa'

export function getLinkRequest(requestId: string): LinkRequest| undefined {
    return linkRequests.find((request) => request.requestId === requestId)
}

export function approveLinkRequest(requestId: string): LinkRequest | undefined {

    const request = getLinkRequest(requestId)

    if(!request) {
        return undefined
    }

    request.status = 'APPROVED'

    return request

}

export function rejectLinkRequest(requestId: string): LinkRequest | undefined {

    const request = getLinkRequest(requestId)

    if (!request) {
        return undefined
    }

    request.status = 'REJECTED'

    return request
    
}
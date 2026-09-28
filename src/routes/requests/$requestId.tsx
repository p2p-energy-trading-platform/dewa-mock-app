import { createFileRoute } from '@tanstack/react-router'
import { linkRequests } from '../../data/linkRequests'


export const Route = createFileRoute('/requests/$requestId')({
    component: RequestDetails,
})


function RequestDetails() {

    const { requestId } = Route.useParams()

    const request = linkRequests.find((linkRequest) => linkRequest.requestId === requestId)

    if(!request) {
        return <p>Request not found</p>
    }

    return(
        <main className="min-h-screen bg-gray-100 p-8">
            
            <div className="mx-auto max-w-3xl">
                
                <h1 className="text-3xl font-bold">
                    DEWA Mock Customer Portal
                </h1>

                <p className="mt-2 text-gray-600">
                    Smart Meter Connection Request
                </p>

                <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
                    
                    <h2 className="text-xl font-semibold">
                        Request Details
                    </h2>

                    <div className="mt-6 space-y-3">

                        <p>
                            <strong>Request ID:</strong> {request.requestId}
                        </p>

                        <p>
                            <strong>Registration ID:</strong> {request.registrationId}
                        </p>

                        <p>
                            <strong>Meter ID:</strong> {request.meterId}
                        </p>

                        <p>
                            <strong>User Reference:</strong> {request.userReference}
                        </p>

                        <p>
                            <strong>Status:</strong> {request.status}
                        </p>

                    </div>

                </div>

            </div>

        </main>
    )
}
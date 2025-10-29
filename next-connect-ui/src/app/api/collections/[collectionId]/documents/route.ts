import { NextResponse } from "next/server"
import { serverFetchAPI } from "@/lib/api"
import { uploadFormData } from "@/lib/api"

export async function GET(request: Request, { params }: { params: Promise<{ collectionId: string }> }) {
  const { collectionId } = await params
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit') || '10'
  const offset = searchParams.get('offset') || '0'
    
  try {
    // 백엔드 API 호출 with query parameters
    const response = await serverFetchAPI(`/collections/${collectionId}/documents?limit=${limit}&offset=${offset}`, {
      method: "GET",
    })

    return NextResponse.json({ success: true, data: response }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ collectionId: string }> }) {
  const { collectionId } = await params
  
  try {
    // FormData를 받아서 axios로 백엔드에 전달
    const formData = await request.formData()
    
    // Use the Axios function to upload FormData
    const response = await uploadFormData(`/collections/${collectionId}/documents`, formData)

    return NextResponse.json({ success: true, data: response }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to upload documents'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ collectionId: string }> }
) {
  const { collectionId } = await params
  
  try {
    const body = await request.json()
    
    // Validate the request body
    if (!body.document_ids && !body.file_ids) {
      return NextResponse.json({ 
        success: false, 
        message: 'Either document_ids or file_ids must be provided' 
      }, { status: 400 })
    }
    
    // The backend only supports deleting one document at a time
    // So we need to delete each document individually
    const idsToDelete = body.file_ids || body.document_ids
    const deletePromises = idsToDelete.map((id: string) => 
      serverFetchAPI(`/collections/${collectionId}/documents/${id}`, {
        method: "DELETE",
      })
    )
    
    // Wait for all deletes to complete
    const results = await Promise.allSettled(deletePromises)
    
    // Count successful deletions
    const successCount = results.filter(r => r.status === 'fulfilled').length
    const failedCount = results.filter(r => r.status === 'rejected').length
    
    if (failedCount > 0) {
      console.warn(`${failedCount} document(s) failed to delete`)
    }

    return NextResponse.json({ 
      success: true, 
      deleted_count: successCount,
      failed_count: failedCount,
      message: `Successfully deleted ${successCount} document(s)${failedCount > 0 ? `, ${failedCount} failed` : ''}`
    }, { status: 200 })
  } catch (error: any) {
    console.error('Failed to delete documents:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to delete documents' 
    }, { status: 500 })
  }
}

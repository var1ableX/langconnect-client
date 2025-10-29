import { NextResponse } from "next/server"
import { serverFetchAPI } from "@/lib/api"

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ collectionId: string; documentId: string }> }
) {
  const { collectionId, documentId } = await params
  const { searchParams } = new URL(request.url)
  const deleteBy = searchParams.get('delete_by') || 'file_id'
  
  try {
    // Call backend API for deletion
    const response = await serverFetchAPI(`/collections/${collectionId}/documents/${documentId}?delete_by=${deleteBy}`, {
      method: "DELETE",
    })

    return NextResponse.json({ success: true, data: response }, { status: 200 })
  } catch (error: any) {
    console.error('Failed to delete document:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to delete document' 
    }, { status: 500 })
  }
}
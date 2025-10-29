import { NextResponse } from "next/server"
import { serverFetchAPI } from "@/lib/api"

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ collectionId: string; documentId: string }> }
) {
  const { collectionId, documentId } = await params
  
  try {
    // Call backend API for deletion
    // Note: The backend uses the documentId as the file_id internally
    const response = await serverFetchAPI(`/collections/${collectionId}/documents/${documentId}`, {
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
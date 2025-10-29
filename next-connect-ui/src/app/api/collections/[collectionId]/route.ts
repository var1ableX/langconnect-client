import { NextResponse } from "next/server"
import { serverFetchAPI } from "@/lib/api"

export async function DELETE(request: Request, { params }: { params: Promise<{ collectionId: string }> }) {
  try {
    const { collectionId } = await params
    // 백엔드 API 호출 - returns 204 No Content on success
    await serverFetchAPI(`/collections/${collectionId}`, {
      method: "DELETE",
    })

    // Since backend returns 204 No Content, we create our own success response
    return NextResponse.json({ success: true, message: 'Collection deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.error('Failed to delete collection:', error)
    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Failed to delete collection' 
    }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ collectionId: string }> }) {
  const { collectionId } = await params
  const response = await serverFetchAPI(`/collections/${collectionId}`, {
    method: "GET",
  })
  return NextResponse.json({ success: true, data: response }, { status: 200 })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ collectionId: string }> }) {
  try {
    const { collectionId } = await params
    const body = await request.json()
    const response = await serverFetchAPI(`/collections/${collectionId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    })
    return NextResponse.json({ success: true, data: response }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

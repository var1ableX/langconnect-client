import {
  deleteCollection,
  getCollections,
  createCollection,
  updateCollection,
} from "@/lib/api"
import {
  validateSession,
  NextResponse,
} from "@/lib/utils"

export async function GET(
  req: Request,
  { params }: { params: { collectionId: string } }
) {
  try {
    const { user, error } = await validateSession(req)
    if (error || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const response = await getCollections(user.token)
    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error(`🔴 GET /api/collections failed: ${error}`)
    return NextResponse.json({ success: false, message: error })
  }
}

export async function POST(req: Request) {
  try {
    const { user, error } = await validateSession(req)
    if (error || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name } = await req.json()
    const response = await createCollection(name, user.token)
    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error(`🔴 POST /api/collections failed: ${error}`)
    return NextResponse.json({ success: false, message: error })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { collectionId: string } }
) {
  try {
    const { user, error } = await validateSession(req)
    if (error || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { metadata } = await req.json()
    const response = await updateCollection(
      params.collectionId,
      metadata,
      user.token
    )

    return NextResponse.json({ success: true, data: response })
  } catch (error) {
    console.error(
      `🔴 PATCH /api/collections/${params.collectionId} failed: ${error}`
    )
    return NextResponse.json({ success: false, message: error })
  }
}

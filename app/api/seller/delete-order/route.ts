import { NextResponse } from "next/server"
import { deleteOrder } from "../../../../lib/db"

export async function POST(request: Request) {
  const { orderId } = await request.json()

  try {
    await deleteOrder(orderId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}


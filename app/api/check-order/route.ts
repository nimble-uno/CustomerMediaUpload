import { NextResponse } from "next/server"
import { getOrder, createOrder } from "../../../lib/db"

export async function POST(request: Request) {
  const { orderId } = await request.json()

  try {
    const order = await getOrder(orderId)

    if (order) {
      return NextResponse.json({ exists: true })
    } else {
      await createOrder(orderId)
      return NextResponse.json({ exists: false })
    }
  } catch (error) {
    console.error("Error checking order:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}


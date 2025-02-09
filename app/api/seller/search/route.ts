import { NextResponse } from "next/server"
import { searchOrders, getOrderFiles } from "../../../../lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const orders = await searchOrders(query)

    // Fetch files for each order
    const ordersWithFiles = await Promise.all(
      orders.map(async (order) => {
        const files = await getOrderFiles(order.id)
        return { ...order, files }
      }),
    )

    return NextResponse.json({ success: true, orders: ordersWithFiles })
  } catch (error) {
    console.error("Error searching orders:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}


import { NextResponse } from "next/server"
import { validateSeller } from "../../../../lib/db"

export async function POST(request: Request) {
  const { username, password } = await request.json()

  try {
    const seller = await validateSeller(username, password)

    if (seller) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false })
    }
  } catch (error) {
    console.error("Error validating seller:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}


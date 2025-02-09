import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { updateOrderStatus, addFile } from "../../../lib/db"

export async function POST(request: Request) {
  const formData = await request.formData()
  const orderId = formData.get("orderId") as string
  const video = formData.get("video") as File
  const image = formData.get("image") as File
  const song = formData.get("song") as string

  try {
    const videoBlob = await put(`orders/${orderId}/video.mp4`, video, { access: "public" })
    const imageBlob = await put(`orders/${orderId}/image.jpg`, image, { access: "public" })

    await updateOrderStatus(orderId, "completed", song)
    await addFile(orderId, videoBlob.url, "video")
    await addFile(orderId, imageBlob.url, "image")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error uploading files:", error)
    return NextResponse.json({ error: "An error occurred during upload" }, { status: 500 })
  }
}


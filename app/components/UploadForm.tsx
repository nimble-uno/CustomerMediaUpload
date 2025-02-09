"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type React from "react" // Added import for React

export default function UploadForm({ orderId }: { orderId: string }) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [song, setSong] = useState("")
  const [error, setError] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsUploading(true)

    if (!videoFile || !imageFile) {
      setError("Please select both a video and an image file.")
      setIsUploading(false)
      return
    }

    if (videoFile.size > 3 * 1024 * 1024) {
      setError("Video file size must be less than 3MB.")
      setIsUploading(false)
      return
    }

    const formData = new FormData()
    formData.append("orderId", orderId)
    formData.append("video", videoFile)
    formData.append("image", imageFile)
    formData.append("song", song)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      router.push("/thank-you")
    } catch (error) {
      setError("An error occurred during upload. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="video" className="block text-sm font-medium text-gray-700">
          Video (max 3MB)
        </label>
        <input
          type="file"
          id="video"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          required
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          required
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label htmlFor="song" className="block text-sm font-medium text-gray-700">
          Song
        </label>
        <input
          type="text"
          id="song"
          value={song}
          onChange={(e) => setSong(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isUploading}
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </form>
  )
}


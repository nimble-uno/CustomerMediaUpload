"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SellerDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [orders, setOrders] = useState([])
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSearch = async () => {
    setError("")

    try {
      const response = await fetch(`/api/seller/search?query=${searchQuery}`)
      const data = await response.json()

      if (data.success) {
        setOrders(data.orders)
      } else {
        setError("No orders found")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
  }

  const handleDelete = async (orderId: string) => {
    try {
      const response = await fetch(`/api/seller/delete-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      })

      if (response.ok) {
        setOrders(orders.filter((order: any) => order.id !== orderId))
      } else {
        setError("Failed to delete order")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
  }

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, "_blank")
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search order ID"
          className="flex-grow border border-gray-300 rounded-md shadow-sm p-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {orders.map((order: any) => (
          <div key={order.id} className="bg-white p-4 rounded-md shadow">
            <h2 className="text-xl font-semibold mb-2">Order ID: {order.id}</h2>
            <p>Status: {order.status}</p>
            <p>Song: {order.song}</p>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => handleDelete(order.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              {order.files &&
                order.files.map((file: any) => (
                  <button
                    key={file.id}
                    onClick={() => handleDownload(file.file_url)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors"
                  >
                    Download {file.file_type}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


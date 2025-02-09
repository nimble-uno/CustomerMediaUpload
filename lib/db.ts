import { sql } from "@vercel/postgres"

export async function createTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS sellers (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      song TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS files (
      id SERIAL PRIMARY KEY,
      order_id TEXT REFERENCES orders(id),
      file_url TEXT NOT NULL,
      file_type TEXT NOT NULL
    );
  `
}

export async function getOrder(orderId: string) {
  const result = await sql`
    SELECT * FROM orders WHERE id = ${orderId}
  `
  return result.rows[0]
}

export async function createOrder(orderId: string) {
  await sql`
    INSERT INTO orders (id, status) VALUES (${orderId}, 'pending')
  `
}

export async function updateOrderStatus(orderId: string, status: string, song?: string) {
  await sql`
    UPDATE orders SET status = ${status}, song = ${song} WHERE id = ${orderId}
  `
}

export async function addFile(orderId: string, fileUrl: string, fileType: string) {
  await sql`
    INSERT INTO files (order_id, file_url, file_type) VALUES (${orderId}, ${fileUrl}, ${fileType})
  `
}

export async function getOrderFiles(orderId: string) {
  const result = await sql`
    SELECT * FROM files WHERE order_id = ${orderId}
  `
  return result.rows
}

export async function deleteOrder(orderId: string) {
  await sql`
    DELETE FROM files WHERE order_id = ${orderId};
    DELETE FROM orders WHERE id = ${orderId};
  `
}

export async function searchOrders(query: string) {
  const result = await sql`
    SELECT * FROM orders WHERE id ILIKE ${"%" + query + "%"}
  `
  return result.rows
}

export async function validateSeller(username: string, password: string) {
  const result = await sql`
    SELECT * FROM sellers WHERE username = ${username} AND password = ${password}
  `
  return result.rows[0]
}


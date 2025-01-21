import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const response = await sql`
      SELECT bb.*, u.name AS user_name
      FROM book_borrowing bb
      JOIN users u ON bb.user_id = u.id
      WHERE bb.status = 'Pending'
      ORDER BY bb.created_at DESC;
    `;

    return Response.json( response);
  } catch (error) {
    console.error("Error fetching pending bookings:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
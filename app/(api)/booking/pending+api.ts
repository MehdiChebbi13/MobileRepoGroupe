import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    const response = await sql`
      SELECT * FROM book_borrowing
      WHERE status = 'Pending'
      ORDER BY created_at DESC;
    `;

    return Response.json({ data: response });
  } catch (error) {
    console.error("Error fetching pending bookings:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

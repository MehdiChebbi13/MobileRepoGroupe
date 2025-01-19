// pages/api/book-borrowing/[id]+api.ts
import { neon } from "@neondatabase/serverless";

export async function GET(request: Request, { id }: { id: string }) {
  if (!id) return Response.json({ error: "Missing user ID" }, { status: 400 });

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const response = await sql`
        SELECT * FROM book_borrowing WHERE user_id = ${id} ORDER BY created_at DESC;
    `;

    return Response.json({ data: response });
  } catch (error) {
    console.error("Error fetching book borrowing entries:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

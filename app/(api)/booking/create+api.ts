// pages/api/book-borrowing/index.ts
import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

export async function POST(request: Request) {
  try {
    const { user_id, book_id, book_cover, book_name, author, page_no} =
      await request.json();

    if (
      !user_id ||
      !book_id ||
      !book_cover ||
      !book_name ||
      !author ||
      !page_no
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const response = await sql`
      INSERT INTO book_borrowing (user_id, book_id, book_cover, book_name, author, page_no, borrow_time, return_time, status)
      VALUES (${user_id}, ${book_id}, ${book_cover}, ${book_name}, ${author}, ${page_no}, current_timestamp, current_timestamp + interval '14 day', 'Pending');
      RETURNING *;
    `;

    return new Response(JSON.stringify({ data: response[0] }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
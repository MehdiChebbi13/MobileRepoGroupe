// pages/api/book-borrowing/index.ts
import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

export async function POST(request: Request) {
  try {
    const { clerk_id, book_id, book_cover, book_name, author, page_no } =
      await request.json();

    if (!clerk_id || !book_id || !book_cover || !book_name || !author || !page_no ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const userResponse = await sql`
      SELECT id FROM users WHERE clerk_id = ${clerk_id};
    `;

    if (userResponse.length === 0) {
      return new Response(
        JSON.stringify({ error: "User not found for this Clerk ID" }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    const user_id = userResponse[0].id;

    const response = await sql`
      INSERT INTO book_borrowing (user_id, book_id, book_cover, book_name, author, page_no, borrow_time, return_time, status)
      VALUES (${user_id}, ${book_id}, ${book_cover}, ${book_name}, ${author}, ${page_no}, current_timestamp, current_timestamp + interval '14 day', 'Pending')
      RETURNING *;
    `;

    return new Response(JSON.stringify({ data: response[0] }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating borrowing record:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

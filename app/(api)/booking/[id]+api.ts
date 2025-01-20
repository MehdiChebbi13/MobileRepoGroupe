import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

export async function GET(request: Request, { id }: { id: string }) {
  if (!id) return Response.json({ error: "Missing user ID" }, { status: 400 });

  try {
    
    const response = await sql`
        SELECT * FROM book_borrowing WHERE user_id = ${id} ORDER BY created_at DESC;
    `;

    return Response.json({ data: response });
  } catch (error) {
    console.error("Error fetching book borrowing entries:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// export async function PUT(request: Request) {
//   try {
//     const url = new URL(request.url);
//     const id = url.searchParams.get("id");
//     console.log(id);

//   if (!id) {
//     return new Response(
//       JSON.stringify({ error: "Invalid or missing book ID" }),
//       { status: 400, headers: { "Content-Type": "application/json" } }
//     );  }

  
//     const { status } = await request.json();
//     if (!status || (status !== "Approved" && status !== "Refused")) {
//       return new Response(
//         JSON.stringify({ error: "Invalid status. Must be 'Approved' or 'Refused'" }),
//         { status: 400, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     const response = await sql`
//       UPDATE book_borrowing
//       SET status = ${status}
//       WHERE id = ${id} AND status = 'Pending'
//       RETURNING *;
//     `;

//     console.log("request updated succesfully");

//     if (response.length === 0) {
//       return Response.json(
//         { error: "Booking not found or already processed" },
//         { status: 404 },
//       );
//     }

//     return Response.json({ data: response[0] });
//   } catch (error) {
//     console.error("Error approving or refusing booking:", error);
//     return Response.json({ error: "Internal Server Error" }, { status: 500 });
//   }
//}

export async function PUT(request: Request, { id }: { id: string }) {
  if (!id) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const { status } = await request.json();
    if (!status || (status !== "Borrowed" && status !== "Refused")) {
      return Response.json(
        { error: "Invalid status. Must be 'Borrowed' or 'Refused'" },
        { status: 400 },
      );
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    const response = await sql`
      UPDATE book_borrowing
      SET status = ${status}
      WHERE id = ${id} AND status = 'Pending'
      RETURNING *;
    `;

    if (response.length === 0) {
      return Response.json(
        { error: "Booking not found or already processed" },
        { status: 404 },
      );
    }

    return Response.json({ data: response[0] });
  } catch (error) {
    console.error("Error approving or refusing booking:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
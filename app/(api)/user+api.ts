import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

export async function POST(request: Request) {
  try {
    console.log("Received request:", request);

    const { name, email, clerkId } = await request.json();
    console.log("Received Data:", { name, email, clerkId });

    if (!name || !email || !clerkId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await sql`
      INSERT INTO users (
        name, 
        email, 
        clerk_id
      ) 
      VALUES (
        ${name}, 
        ${email},
        ${clerkId}
     ) RETURNING *;`;

    return new Response(
      JSON.stringify({ message: "User created successfully", data: response }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


// export async function GET(request: Request) {
//   try {
//     const url = new URL(request.url);
//     const clerkId = url.searchParams.get("clerkId");

//     if (!clerkId) {
//       return Response.json({ error: "Missing clerkId parameter" }, { status: 400 });
//     }

//     console.log("Fetching user with clerkId:", clerkId);

//     const response = await sql`
//       SELECT * FROM users WHERE clerk_id = ${clerkId};
//     `;

//     if (response.length === 0) {
//       return Response.json({ error: "User not found" }, { status: 404 });
//     }

//     return new Response(JSON.stringify({ user: response[0] }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     return Response.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
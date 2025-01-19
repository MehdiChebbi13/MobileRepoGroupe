import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

// export async function GET(request: Request) {
//   try {
//     console.log("Fetching all books...");

//     // Query to fetch all books
//     const books = await sql`
//       SELECT * FROM books;
//     `;

//     console.log("Books retrieved successfully:", books);

//     // Return the books as JSON
//     return new Response(JSON.stringify({ data: books }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Error fetching books:", error);
//     return new Response(
//       JSON.stringify({ error: "Internal Server Error" }),
//       { status: 500 }
//     );
//   }
// }

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const bookId = url.searchParams.get("id");  // Get the ID from query parameters

    if (bookId) {
      // Fetch the single book by ID
      const book = await sql`
        SELECT * FROM books WHERE id = ${bookId};
      `;
      
      if (book.length === 0) {
        return new Response(
          JSON.stringify({ error: "Book not found" }),
          { status: 404 }
        );
      }
      
      return new Response(JSON.stringify({ data: book[0] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Fetch all books
      const books = await sql`
        SELECT * FROM books;
      `;
      
      return new Response(JSON.stringify({ data: books }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    try{
    const { 
        book_name, 
        book_cover, 
        published_year, 
        language, 
        page_no, 
        author, 
        description 
      } = await request.json();
  
      // Validate input
      if (!book_name || !book_cover || !published_year || !language || !page_no || !author || !description) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
  
      // Insert the book into the database
      const response = await sql`
      INSERT INTO books (book_name, book_cover, published_year, language, page_no, author, description)
      VALUES (${book_name}, ${book_cover}, ${published_year}, ${language}, ${page_no}, ${author}, ${description})
      RETURNING *;
    `;
  
    return new Response(JSON.stringify({ data: response[0] }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error adding book:", error);
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
}

export async function DELETE(request: Request) {
  try {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");

    // Validate input
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Book ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    console.log("dis is the id",id);
    // Delete the book from the database
    const response = await sql`
      DELETE FROM books WHERE id = ${id} RETURNING *;
    `;
    console.log("i am hereeee ")

    if (response.length === 0) {
      return new Response(
        JSON.stringify({ error: "Book not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ data: response[0] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
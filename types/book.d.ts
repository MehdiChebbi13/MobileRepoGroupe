export type Book = {
    id: number;
    book_name: string;
    book_cover: any;
    published_year: number;
    language: string;
    page_no: number;
    author: string;
    description: string;
    created_at: date;
    
  };
  
  export type Profile = {
    name: string;
    point: number;
  };
  
  export type MyBook = Book & {
    completion: string;
    lastRead: string;
  };
  
  export type Category = {
    id: number;
    categoryName: string;
    books: Book[];
  };
  
  export type HomeProps = {
    navigation: any;
  };
  
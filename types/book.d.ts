export type Book = {
    id: number;
    bookName: string;
    book_cover: any;
    publishedYear: number;
    language: string;
    pageNo: number;
    author: string;
    description: string;
    createdAt: date;
    
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
  
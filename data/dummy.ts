import { Book, MyBook, Category } from "../types/book";
import { images } from "../constants/images";
const bookOtherWordsForHome: Book = {
    id: 1,
    bookName: "Other Words For Home",
    bookCover: "https://tse4.mm.bing.net/th?id=OIP.2MUvap2iUeVdPVEKR1KTTwHaLg&pid=Api",
    publishedYear: 2010,
    language: "Eng",
    pageNo: 341,
    author: "Jasmine Warga",
    genre: ["Romance", "Adventure", "Drama"],
    readed: "12k",
    description:
      "Jude never thought she’d be leaving her beloved older brother and father behind, all the way across the ocean in Syria. But when things in her hometown start becoming volatile, Jude and her mother are sent to live in Cincinnati with relatives...",
   
  };

  const bookTheMetropolis: Book = {
    id: 2,
    bookName: "The Metropolis",
    bookCover: images.theMetropolist,
    publishedYear: 2011,
    language: "Eng",
    pageNo: 272,
    author: "Seith Fried",
    genre: ["Adventure", "Drama"],
    readed: "13k",
    description:
      "In Metropolis, the gleaming city of tomorrow, the dream of the great American city has been achieved. But all that is about to change...",
    
  };

  const bookTheTinyDragon: Book = {
    id: 3,
    bookName: "The Tiny Dragon",
    bookCover: images.theTinyDragon,
    publishedYear: 2024,
    language: "Eng",
    pageNo: 110,
    author: "Ana C Bouvier",
    genre: ["Drama", "Adventure", "Romance"],
    readed: "13k",
    description:
      "This sketchbook for kids is the perfect tool to improve your drawing skills...",
  };

  const myBooksData: MyBook[] = [
    { ...bookOtherWordsForHome, completion: "75%", lastRead: "3d 5h" },
    { ...bookTheMetropolis, completion: "23%", lastRead: "10d 5h" },
    { ...bookTheTinyDragon, completion: "10%", lastRead: "1d 2h" },
  ];

  const categoriesData: Category[] = [
    {
      id: 1,
      categoryName: "Best Seller",
      books: [bookOtherWordsForHome, bookTheMetropolis, bookTheTinyDragon],
    },
    {
      id: 2,
      categoryName: "The Latest",
      books: [bookTheMetropolis],
    },
    {
      id: 3,
      categoryName: "Coming Soon",
      books: [bookTheTinyDragon],
    },
  ];

  export { myBooksData, categoriesData };
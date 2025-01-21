import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { ImageBackground } from "react-native";
import { Book } from "@/types/book";
import { StackScreenProps } from "@react-navigation/stack";
import { fetchAPI } from "@/lib/fetch";
import EvilIcons from "@expo/vector-icons/EvilIcons";

type RootStackParamList = {
  Home: undefined;
  BookDetail: { bookId: string };
  addBook: undefined;
  ModifyBook: { book: Book };
};

type BookDetailProps = StackScreenProps<RootStackParamList, "BookDetail">;

/* type BookDetailProps = {
  route: {
    params: {
      book: Book;
    };
  };
  navigation: any;
}; */

const BookDetail: React.FC<BookDetailProps> = ({
  route,
  navigation,
}: BookDetailProps) => {
  const [book, setBook] = useState<Book | null>(null);
  const { setOpenBook }: any = route.params;

  useEffect(() => {
    const { book }: any = route.params;
    setBook(book);
  }, [route.params]);

  const handleDeleteBook = async (id: any) => {
    try {
      const response = await fetchAPI(`/(api)/book?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setOpenBook(false);
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleUpdateBook = async (id: string, updatedData: any) => {
    try {
      const response = await fetchAPI(`/(api)/book?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  if (!book) return null;

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: book.book_cover }}
        resizeMode="cover"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      />

      {/* Color Overlay */}
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: 0.6,
          backgroundColor: "#4A2B5F",
        }}
      ></View>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon} className="">
            ←
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Book</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Book Cover and Info */}
      <View style={styles.bookInfoContainer}>
        <Image source={{ uri: book.book_cover }} style={styles.bookCover} />
        <Text style={styles.bookTitle}>{book.book_name}</Text>
        <Text style={styles.authorName}>{book.author}</Text>

        <View className="flex flex-row m-2 rounded-3xl p-4 w-auto bg-[rgba(0,0,0,0.32)] gap-9">
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{book.published_year}</Text>
            <Text style={styles.statLabel}>Year Published</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{book.page_no}</Text>
            <Text style={styles.statLabel}>Number of Page</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{book.language}</Text>
            <Text style={styles.statLabel}>Language</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Description</Text>
        <ScrollView style={styles.descriptionScroll}>
          <Text style={styles.descriptionText}>{book.description}</Text>
        </ScrollView>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ModifyBook", { book });
          }}
          style={styles.bookmarkButton}
        >
          <Image
            source={require("../../assets/icons/edit.png")}
            className="h-7 w-7"
            tintColor={"white"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleDeleteBook(book.id);
          }}
          style={styles.startReadingButton}
        >
          <Text style={styles.startReadingText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4A2B5F",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 17,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    color: "white",
    fontSize: 24,
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
  },
  moreButton: {
    padding: 8,
  },
  moreIcon: {
    color: "white",
    fontSize: 24,
  },
  bookInfoContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  bookCover: {
    width: 150,
    height: 220,
    borderRadius: 8,
    marginBottom: 20,
  },
  bookTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  authorName: {
    color: "#B8B8B8",
    fontSize: 16,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    color: "#B8B8B8",
    fontSize: 14,
  },
  descriptionContainer: {
    flex: 1,
    backgroundColor: "#221133",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  descriptionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  descriptionScroll: {
    flex: 1,
  },
  descriptionText: {
    color: "#B8B8B8",
    fontSize: 16,
    lineHeight: 24,
  },
  bottomButtons: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#221133",
  },
  bookmarkButton: {
    width: 50,
    height: 50,
    backgroundColor: "#4A2B5F",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  bookmarkIcon: {
    fontSize: 20,
    color: "white",
  },
  startReadingButton: {
    flex: 1,
    height: 50,
    backgroundColor: "#FF6B4A",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  startReadingText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BookDetail;

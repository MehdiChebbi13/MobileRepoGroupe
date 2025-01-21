import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { ImageBackground } from "react-native";
import { Book } from "@/types/book";
import { StackScreenProps } from "@react-navigation/stack";
import { fetchAPI } from "@/lib/fetch";

type RootStackParamList = {
  Home: undefined;
  BookDetail: { bookId: string };
  addBook: undefined;
  ModifyBook: { book: Book };
};

type BookDetailProps = StackScreenProps<RootStackParamList, "ModifyBook">;

const ModifyBook: React.FC<BookDetailProps> = ({
  route,
  navigation,
}: BookDetailProps) => {
  const [book, setBook] = useState<Book | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState<Book | null>(null);
  const { setOpenBook }: any = route.params;

  useEffect(() => {
    const { book }: any = route.params;
    setBook(book);
    setEditedBook(book);
  }, [route.params]);

  const handleDeleteBook = async (id: any) => {
    try {
      await fetchAPI(`/(api)/book?id=${id}`, {
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

  const handleNumericInput = (
    text: string,
    field: "published_year" | "page_no"
  ) => {
    const number = parseInt(text.replace(/[^0-9]/g, ""));
    if (!isNaN(number)) {
      setEditedBook((prev) => (prev ? { ...prev, [field]: number } : null));
    }
  };

  const handleUpdateBook = async () => {
    if (!editedBook || !book) return;

    try {
      await fetchAPI(`/(api)/book?id=${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedBook),
      });
      setBook(editedBook);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  if (!book || !editedBook) return null;

  const renderContent = () => {
    if (isEditing) {
      return (
        <View style={styles.bookInfoContainer}>
          <Image source={{ uri: book.book_cover }} style={styles.bookCover} />
          <TextInput
            style={[styles.bookTitle, styles.input]}
            value={editedBook.book_name}
            onChangeText={(text) =>
              setEditedBook({ ...editedBook, book_name: text })
            }
          />
          <TextInput
            style={[styles.authorName, styles.input]}
            value={editedBook.author}
            onChangeText={(text) =>
              setEditedBook({ ...editedBook, author: text })
            }
          />

          <View className="flex flex-row m-2 rounded-3xl p-4 w-auto bg-[rgba(0,0,0,0.32)] gap-9">
            <View style={styles.statItem}>
              <TextInput
                style={[styles.statValue, styles.input]}
                value={String(editedBook.published_year)}
                onChangeText={(text) =>
                  handleNumericInput(text, "published_year")
                }
                keyboardType="numeric"
              />
              <Text style={styles.statLabel}>Year Published</Text>
            </View>
            <View style={styles.statItem}>
              <TextInput
                style={[styles.statValue, styles.input]}
                value={String(editedBook.page_no)}
                onChangeText={(text) =>
                  setEditedBook({ ...editedBook, page_no: Number(text) })
                }
                keyboardType="numeric"
              />
              <Text style={styles.statLabel}>Number of Page</Text>
            </View>
            <View style={styles.statItem}>
              <TextInput
                style={[styles.statValue, styles.input]}
                value={editedBook.language}
                onChangeText={(text) =>
                  setEditedBook({ ...editedBook, language: text })
                }
              />
              <Text style={styles.statLabel}>Language</Text>
            </View>
          </View>
        </View>
      );
    }

    return (
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
    );
  };

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
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Book</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {renderContent()}

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Description</Text>
        <ScrollView style={styles.descriptionScroll}>
          {isEditing ? (
            <TextInput
              style={[styles.descriptionText, styles.input]}
              value={editedBook.description}
              onChangeText={(text) =>
                setEditedBook({ ...editedBook, description: text })
              }
              multiline
            />
          ) : (
            <Text style={styles.descriptionText}>{book.description}</Text>
          )}
        </ScrollView>
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          onPress={() => {
            if (isEditing) {
              handleUpdateBook();
            } else {
              setIsEditing(true);
            }
          }}
          style={styles.bookmarkButton}
        >
          {!isEditing ? (
            <Image
              source={require("../../assets/icons/edit.png")}
              className="h-7 w-7"
              tintColor={"white"}
            />
          ) : (
            <Image
              source={require("../../assets/icons/check.png")}
              className="h-7 w-7"
              tintColor={"white"}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (isEditing) {
              setIsEditing(false);
              setEditedBook(book);
            } else {
              handleDeleteBook(book.id);
            }
          }}
          style={[styles.startReadingButton, isEditing && styles.cancelButton]}
        >
          <Text style={styles.startReadingText}>
            {isEditing ? "Cancel" : "Supprimer"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 8,
    padding: 8,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  cancelButton: {
    backgroundColor: "#666",
  },
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

export default ModifyBook;

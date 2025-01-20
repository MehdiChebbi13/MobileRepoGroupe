import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { ScrollView } from "react-native-gesture-handler";
import { fetchAPI } from "@/lib/fetch";
import { RootStackParamList } from "./_layout";
import { StackScreenProps } from "@react-navigation/stack";

type Props = StackScreenProps<RootStackParamList, "editBook">;
const EditBook = ({ navigation, route }: Props) => {
  const { onAdd }: any = route.params;

  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [pageNo, setPageNo] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [bookCover, setBookCover] = useState("");

  const submitForm = async () => {
    if (
      !bookName ||
      !author ||
      !pageNo ||
      !publishedYear ||
      !language ||
      !description ||
      !bookCover
    ) {
      alert("Please fill in all fields");
      return;
    }

    const newBook = {
      book_name: bookName,
      book_cover: { uri: bookCover },
      published_year: parseInt(publishedYear),
      language: "English",
      page_no: parseInt(pageNo),
      author: author,
      description: description,
    };

    try {
      const response = await fetchAPI("/(api)/book", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add book");
      }

      const data = await response.json();
      console.log("Book added successfully:", data);
      onAdd(newBook);

      navigation.goBack();
      return data;
    } catch (error: any) {
      console.error("Error adding book:", error.message);
      throw error;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Book</Text>
      </View>
      <TextInput
        placeholder="Book Name"
        placeholderTextColor={COLORS.lightGray}
        value={bookName}
        onChangeText={setBookName}
        style={styles.input}
      />
      <TextInput
        placeholder="Author"
        placeholderTextColor={COLORS.lightGray}
        value={author}
        onChangeText={setAuthor}
        style={styles.input}
      />

      <TextInput
        placeholder="Page Number"
        placeholderTextColor={COLORS.lightGray}
        value={pageNo}
        onChangeText={setPageNo}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Published Year"
        placeholderTextColor={COLORS.lightGray}
        value={publishedYear}
        onChangeText={setPublishedYear}
        style={styles.input}
      />
      <TextInput
        placeholder="Language"
        placeholderTextColor={COLORS.lightGray}
        value={language}
        onChangeText={setLanguage}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        placeholderTextColor={COLORS.lightGray}
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.addButton} onPress={submitForm}>
        <Text style={styles.buttonText}>Add Book</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
    backgroundColor: COLORS.black,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.padding,
    gap: 80,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: SIZES.base,
  },
  picker: {
    height: 50,
    width: "100%",
    color: COLORS.white, // Ensure the text color is set
    marginBottom: SIZES.radius,
  },
  backText: {
    color: COLORS.white,
    ...FONTS.body3,
    padding: SIZES.base,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.white,
    flex: 1,
    textAlign: "left",
  },
  input: {
    height: 40,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    marginBottom: SIZES.radius,
    paddingHorizontal: SIZES.base,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
  },
  buttonText: {
    color: COLORS.white,
    ...FONTS.body3,
    textAlign: "center",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginTop: SIZES.base,
  },
});

export default EditBook;

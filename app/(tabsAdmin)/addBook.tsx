/* import React, { useState } from "react";
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

const AddBook = ({ navigation, route }) => {
  const { onAdd } = route.params;

  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");
  const [pageNo, setPageNo] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [bookCover, setBookCover] = useState("");

  const selectImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access the camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (
      !result.canceled &&
      Array.isArray(result.assets) &&
      result.assets.length > 0
    ) {
      const uri = result.assets[0]?.uri;

      if (uri) {
        setBookCover(uri);
        console.log("Selected image URI:", uri);
      } else {
        alert("Failed to retrieve image URI.");
      }
    }
  };
  const resetImage = () => {
    setBookCover("");
  };

  const submitForm = () => {
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
      id: Math.random().toString(),
      bookName: bookName,
      bookCover: { uri: bookCover },
      language: "Eng",
      pageNo: parseInt(pageNo),
      publishedYear: parseInt(publishedYear),
      author: author,
      description: description,
    };

    onAdd(newBook);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Books</Text>
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
      <Button title="Select Cover Image" onPress={selectImage} />
      {bookCover && (
        <>
          <Image source={{ uri: bookCover }} style={styles.imagePreview} />
          <Button title="Reset Image" onPress={resetImage} />
        </>
      )}
      <TouchableOpacity style={styles.addButton} onPress={submitForm}>
        <Text style={styles.buttonText}>Add Book</Text>
      </TouchableOpacity>
    </View>
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

export default AddBook;
 */

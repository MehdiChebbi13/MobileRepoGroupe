import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "./_layout";
/* import { COLORS } from "../"; */

type Props = StackScreenProps<RootStackParamList, "addBook">;

interface FormData {
  title: string;
  author: string;
  coverUrl: string;
  pageCount: string;
  rating: string;
  language: string;
  description: string;
}

const BookDetailForm = ({ navigation, route }: Props) => {
  const [form, setForm] = useState<FormData>({
    title: "",
    author: "",
    coverUrl: "",
    pageCount: "",
    rating: "",
    language: "Eng",
    description: "",
  });

  const handleSubmit = async () => {
    try {
      // Validate form
      if (!form.title || !form.author || !form.pageCount || !form.description) {
        alert("Please fill in all required fields");
        return;
      }

      // Add your API call here
      // For now, just log and navigate back
      console.log("Form submitted:", form);
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.scrollView}>
          {/* Book Cover */}
          <View style={styles.coverContainer}>
            {form.coverUrl ? (
              <Image
                source={{ uri: form.coverUrl }}
                style={styles.coverImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.coverPlaceholder} className="bg-[#f96c4185]">
                <Text style={styles.placeholderText}>Book Cover</Text>
              </View>
            )}
          </View>

          {/* Book Title and Author */}
          <View style={styles.headerSection}>
            <TextInput
              style={styles.titleInput}
              placeholder="Book Title"
              placeholderTextColor="#ffffff80"
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
            />
            <Text style={styles.statLabel}>Title</Text>
            <TextInput
              style={styles.authorInput}
              placeholder="Author Name"
              placeholderTextColor="#ffffff80"
              value={form.author}
              onChangeText={(text) => setForm({ ...form, author: text })}
            />
            <Text style={styles.statLabel}>Author</Text>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <TextInput
                style={styles.statInput}
                placeholder="0.0"
                placeholderTextColor="#ffffff80"
                value={form.rating}
                onChangeText={(text) => setForm({ ...form, rating: text })}
                keyboardType="numeric"
              />
              <Text style={styles.statLabel}>Rating</Text>
            </View>

            <View style={styles.statItem}>
              <TextInput
                style={styles.statInput}
                placeholder="0"
                placeholderTextColor="#ffffff80"
                value={form.pageCount}
                onChangeText={(text) => setForm({ ...form, pageCount: text })}
                keyboardType="numeric"
              />
              <Text style={styles.statLabel}>Number of Page</Text>
            </View>

            <View style={styles.statItem}>
              <Picker
                selectedValue={form.language}
                onValueChange={(itemValue) =>
                  setForm({ ...form, language: itemValue })
                }
                style={styles.languagePicker}
                itemStyle={{ color: "white" }}
                dropdownIconColor="white"
              >
                <Picker.Item label="EN" value="En" />
                <Picker.Item label="FR" value="Fr" />
                <Picker.Item label="SP" value="Sp" />
                <Picker.Item label="AR" value="Ar" />
              </Picker>
              <Text style={styles.statLabel}>Language</Text>
            </View>
          </View>
          <TextInput
            style={styles.coverUrlInput}
            placeholder="Cover Image URL"
            placeholderTextColor="#ffffff80"
            value={form.coverUrl}
            onChangeText={(text) => setForm({ ...form, coverUrl: text })}
          />

          {/* Description Section */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Enter book description..."
              placeholderTextColor="#ffffff80"
              multiline
              numberOfLines={4}
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
            />
          </View>

          {/* Cover URL Input */}

          {/* Submit Button */}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Add book</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1B26", // Purple background
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  coverImage: {
    width: 180,
    height: 240,
    borderRadius: 12,
  },
  coverPlaceholder: {
    width: 180,
    height: 240,
    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "white",
  },
  headerSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    width: "100%",
  },
  authorInput: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    width: "100%",
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statInput: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    width: 60,
  },
  statLabel: {
    color: "white",
    fontSize: 14,
    marginTop: 4,
  },
  languagePicker: {
    width: 100,
    color: "white",
    height: 50,
  },
  descriptionContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    marginTop: 20,
  },
  descriptionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  descriptionInput: {
    color: "white",
    textAlignVertical: "top",
    minHeight: 100,
  },
  coverUrlInput: {
    color: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff20",
    padding: 12,
    marginHorizontal: 20,
  },
  submitButton: {
    backgroundColor: "#F96D41",
    marginHorizontal: 40,
    marginBottom: 8,
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BookDetailForm;

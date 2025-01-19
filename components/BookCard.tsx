import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Book } from "../types/book";
import { icons } from "../constants/icons";

type BorrowStatus = "Borrowed" | "Pending" | "Refused";

/* type BookBorrowedCardProps = {
  bookCover: any;
  bookName: string;
  authorName: string;
  pageNo: number;
 borrowTime: string | Date; 
  status: BorrowStatus; 
  onPress?: () => void;
}; */

const getStatusColor = (status: BorrowStatus): string => {
  switch (status) {
    case "Borrowed":
      return "#4CAF50";
    case "Pending":
      return "#FFC107";
    case "Refused":
      return "#F44336";
    default:
      return "#757575";
  }
};

const formatDate = (date: string | Date): string => {
  const borrowDate = new Date(date);
  return borrowDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const BookCard: React.FC<Book> = ({
  book_cover,
  bookName,
  author,
  pageNo,

  /* borrowTime,
  status, */
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => console.log("Book Card Pressed")}
      activeOpacity={0.7}
    >
      {/* Book Cover */}
      <Image
        source={{ uri: book_cover }}
        style={styles.cover}
        resizeMode="cover"
      />

      {/* Book Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.bookName} numberOfLines={1}>
              {bookName}
            </Text>
            <Text style={styles.authorName} numberOfLines={1}>
              by {author}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor("Borrowed") },
            ]}
          >
            <Text style={styles.statusText}>Borrowed</Text>
          </View>
        </View>
        <View>
          <Text className="text-[12px] text-[#F96D41] opacity-70">From:</Text>
          <Text style={styles.borrowTime}>
            {formatDate("2021-02-12T12:00:00")}
          </Text>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[12px] text-[#F96D41] opacity-70">To:</Text>
              <Text style={styles.borrowTime}>
                {formatDate("2022-03-02T12:00:00")}
              </Text>
            </View>
            <View
              style={styles.pageInfo}
              className="flex-row items-center gap-2"
            >
              <Image
                source={icons.page_icon}
                className="size-5 opacity-70"
                tintColor={"white"}
              />
              <Text style={styles.pageCount}>{pageNo} pages</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    /*elevation: 3,
      shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84, */
  },
  cover: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  bookName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  authorName: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  pageCount: {
    fontSize: 13,
    color: "#666666",
  },
  borrowTime: {
    fontSize: 12,
    color: "#888888",
  },
});

export default BookCard;

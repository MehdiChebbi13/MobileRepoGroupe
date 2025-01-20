import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { icons } from "../constants/icons";
import { fetchAPI } from "@/lib/fetch";

type BorrowStatus = "Borrowed" | "Pending" | "Refused";

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

type PendingCardProps = {
  id: number;
  book_cover: string;
  book_name: string;
  author: string;
  page_no: number;
  user_id: number;
  borrow_time: Date | string;
  onRequestProcessed?: () => void; // Optional callback to refresh parent list
};

const PendingCard: React.FC<PendingCardProps> = ({
  id,
  book_cover,
  book_name,
  author,
  page_no,
  user_id,
  borrow_time,
  onRequestProcessed,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<BorrowStatus>("Pending");

  const handleStatusUpdate = async (newStatus: BorrowStatus) => {
    setIsLoading(true);
    try {
      const response = await fetchAPI(`/(api)/booking/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.data) {
        setCurrentStatus(newStatus);
        Alert.alert(
          "Success",
          `Book request ${newStatus.toLowerCase()} successfully`
        );
        onRequestProcessed?.();
      } else {
        throw new Error(response.error || "Failed to update status");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update request status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: book_cover }}
        style={styles.cover}
        resizeMode="cover"
      />

      <View style={styles.detailsContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.bookName} numberOfLines={1}>
              {book_name}
            </Text>
            <Text style={styles.authorName} numberOfLines={1}>
              by {author}
            </Text>
          </View>

          <View className="flex flex-row items-center gap-2">
            {currentStatus === "Pending" ? (
              <>
                <TouchableOpacity
                  className="bg-[#1b7e23] rounded-3xl px-3 py-2"
                  onPress={() => handleStatusUpdate("Borrowed")}
                  disabled={isLoading}
                >
                  <Text className="text-white">
                    {isLoading ? "Processing..." : "Accept"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-[#F44336] rounded-3xl px-3 py-2"
                  onPress={() => handleStatusUpdate("Refused")}
                  disabled={isLoading}
                >
                  <Text className="text-white">
                    {isLoading ? "Processing..." : "Reject"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <View
                className={`px-3 py-2 rounded-3xl ${
                  currentStatus === "Borrowed" ? "bg-[#1b7e23]" : "bg-[#F44336]"
                }`}
              >
                <Text className="text-white">{currentStatus}</Text>
              </View>
            )}
          </View>
        </View>

        <View>
          <Text className="text-[12px] text-[#F96D41] opacity-70">
            Borrow_date:
          </Text>
          <Text style={styles.borrowTime}>{formatDate(borrow_time)}</Text>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[12px] text-[#F96D41] opacity-70">
                user_id:
              </Text>
              <Text style={styles.borrowTime}>{user_id}</Text>
            </View>
            <View
              style={styles.pageInfo}
              className="flex-row items-center gap-2"
            >
              <Image
                source={require("../assets/icons/page_icon.png")}
                className="size-5 opacity-70"
                tintColor={"white"}
              />
              <Text style={styles.pageCount}>{page_no} pages</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
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

export default PendingCard;

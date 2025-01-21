import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from "react-native";

import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { Profile } from "@/types/book";
import BookCard from "@/components/BookCard";
import { fetchAPI } from "@/lib/fetch";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";

function calculateReadingTime(pageCount: number): string {
  const WORDS_PER_PAGE = 250;
  const WORDS_PER_HOUR = 12000; // 200 words per minute * 60 minutes

  const totalWords = pageCount * WORDS_PER_PAGE;
  const totalHours = Math.ceil(totalWords / WORDS_PER_HOUR);

  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  return `${hours}h`;
}
type BorrowStatus = "Borrowed" | "Pending" | "Refused";
type MyBook = {
  id: number;
  book_cover: string;
  book_name: string;
  author: string;
  page_no: number;
  borrow_time: Date | string;
  status: BorrowStatus;
  return_time: Date | string;
};

type MyBorrowedBook = {
  id: number;
  user_id: number;
  book_id: number;
  book_cover: string;
  book_name: string;
  author: string;
  page_no: number;
  borrow_time: string;
  return_time: string;
  status: BorrowStatus;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    clerkId: string;
  };
};

type HomeProps = {
  navigation: any;
};

// Component for line divider
const LineDivider: React.FC = () => {
  return (
    <View style={{ width: 1, paddingVertical: 18 }}>
      <View style={styles.lineDivider}></View>
    </View>
  );
};

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const profileData: Profile = {
    name: "Admin",
    point: 200,
  };

  const [profile, setProfile] = useState<Profile>(profileData);
  const [myBooks, setMyBooks] = useState<MyBook[]>([]);
  const [myBorrowedBooks, setMyBorrowedBooks] = useState<MyBorrowedBook[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { signOut } = useAuth();
  const { user } = useUser();
  const handleLogout = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const data = await fetchAPI("/(api)/book");
        setMyBooks(data.data as MyBook[]);
      } catch (err: any) {
        console.error("Error fetching books:", err.message);
        setError("Unable to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchBorrowedBooks = async () => {
      if (!user) {
        setError("User not found. Please log in again.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await fetchAPI(`/(api)/booking/${user.id}`, {
          method: "GET",
        });
        setMyBorrowedBooks(data as MyBorrowedBook[]);
      } catch (err: any) {
        console.error("Error fetching borrowed books:", err.message);
        setError("Unable to load borrowed books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
    fetchBorrowedBooks();
  }, [refreshing]);

  const renderHeader = (profile: Profile) => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTextContainer}>
        <Text style={styles.greetingText}>Good Morning</Text>
        <Text style={styles.profileName} className="text-[#F96D41]">
          {user?.username}
        </Text>
      </View>

      <TouchableOpacity style={styles.pointButton} onPress={handleLogout}>
        <View className="flex-row items-center justify-center py-2 px-2 ">
          <View className="size-[27px]  rounded-3xl bg-[#00000080] flex items-center justify-center">
            <Image
              source={require("../../assets/icons/out.png")}
              style={styles.pointIcon}
              tintColor={"white"}
              className="p-2"
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderMyBookSection = (myBooks: MyBook[]) => {
    const renderItem = ({ item, index }: { item: MyBook; index: number }) => (
      <TouchableOpacity
        style={{
          flex: 1,
          marginLeft: index === 0 ? SIZES.padding : 0,
          marginRight: SIZES.radius,
        }}
        onPress={() =>
          /* router.replace("BookDetail"
            ) */
          navigation.navigate("BookDetail", {
            book: item,
          })
        }
      >
        <Image
          source={{ uri: item.book_cover }}
          style={styles.bookCover}
          resizeMode="cover"
        />
        <View style={styles.bookInfo}>
          <Image
            source={require("../../assets/icons/clock_icon.png")}
            style={styles.icon}
          />
          <Text style={styles.iconText}>
            {calculateReadingTime(item.page_no)}
          </Text>
          <Image
            source={require("../../assets/icons/page_icon.png")}
            style={[styles.icon, styles.iconPad]}
          />
          <Text style={styles.iconText}>{item.page_no}</Text>
        </View>
      </TouchableOpacity>
    );

    const renderItemBorrowed = ({
      item,
    }: {
      item: MyBorrowedBook;
      index: number;
    }) => (
      <BookCard
        id={item.book_id}
        book_cover={item.book_cover}
        book_name={item.book_name}
        author={item.author}
        page_no={item.page_no}
        borrow_time={item.borrow_time}
        status={item.status}
        return_time={item.return_time}
      />
    );

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.myBookHeader} className="py-[12px]">
          <Text style={styles.myBookTitle}>Books Available</Text>
          <TouchableOpacity onPress={() => setRefreshing(!refreshing)}>
            <Text style={styles.seeMore}>refresh</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={myBooks}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        <View style={styles.myBookHeader} className="mt-8 py-[12px]">
          <Text style={styles.myBookTitle}>
            Books <Text className="text-[#F96D41]">Borrowed</Text>
          </Text>
          <TouchableOpacity onPress={() => setRefreshing(!refreshing)}>
            <Text style={styles.seeMore}>refresh</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={myBorrowedBooks}
          renderItem={renderItemBorrowed}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="flex flex-col items-center justify-center">
              <View>
                <Image
                  source={require("../../assets/images/no-result.png")}
                  className="w-40 h-40"
                  alt="No recent rides found"
                  resizeMode="contain"
                />
                <Text className="text-sm text-[#F96D41] opacity-65">
                  No Books borrowed yet
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View className="mt-4">{renderHeader(profile)}</View>
        }
        data={[{ key: "MyBooksSection" }]}
        renderItem={() => renderMyBookSection(myBooks)}
        keyExtractor={(item, index) => `section-${index}`}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  lineDivider: {
    flex: 1,
    borderLeftColor: COLORS.lightGray,
    borderLeftWidth: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.padding,
  },
  headerTextContainer: { flex: 1, marginRight: SIZES.padding },
  greetingText: { ...FONTS.h2, color: COLORS.white },
  profileName: { ...FONTS.h2 },
  pointButton: {
    backgroundColor: COLORS.primary,
    height: 40,
    borderRadius: 20,
  },
  pointButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.radius,
  },
  pointIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pointIcon: { width: 20, height: 20 },
  pointText: { marginLeft: SIZES.base, color: COLORS.white, ...FONTS.body3 },
  bookCover: { width: 180, height: 250, borderRadius: 20 },
  bookInfo: {
    flexDirection: "row",
    marginTop: SIZES.radius,
    alignItems: "center",
  },
  icon: { width: 20, height: 20, tintColor: COLORS.lightGray },
  iconPad: { marginLeft: SIZES.radius },
  iconText: { marginLeft: 5, color: COLORS.lightGray, ...FONTS.body3 },
  myBookHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  myBookTitle: { ...FONTS.h2, color: COLORS.white },
  seeMore: {
    ...FONTS.body3,
    color: COLORS.lightGray,
    textDecorationLine: "underline",
  },
});

export default Home;

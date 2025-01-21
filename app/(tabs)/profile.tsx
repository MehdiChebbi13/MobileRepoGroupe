/* import React, { useState, useEffect } from "react";
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
import { fetchAPI } from "@/lib/fetch";
import { useUser } from "@clerk/clerk-expo";

type ProfileStats = {
  totalBorrowed: number;
  currentlyBorrowed: number;
  booksReturned: number;
  readingTimeHours: number;
};

type ProfileProps = {
  navigation: any;
};

const ProfilePage: React.FC<ProfileProps> = ({ navigation }) => {
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile>({
    name: "Username",
    point: 200,
  });
  const [stats, setStats] = useState<ProfileStats>({
    totalBorrowed: 0,
    currentlyBorrowed: 0,
    booksReturned: 0,
    readingTimeHours: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setError("User not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchAPI(`/(api)/profile/${user.id}`);
        setProfile(data.profile);
        setStats(data.stats);
      } catch (err: any) {
        console.error("Error fetching profile:", err.message);
        setError("Unable to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTextContainer}>
        <Text style={styles.profileTitle}>Profile</Text>
        <Text style={styles.profileName} className="text-[#F96D41]">
          {profile.name}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <View className="flex-row items-center justify-center py-2 px-2">
          <View className="size-[27px] rounded-3xl bg-[#00000080] flex items-center justify-center">
            <Image
              source={require("../../assets/icons/edit.png")}
              style={styles.editIcon}
              tintColor={"white"}
              className="p-2"
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderProfileStats = () => {
    const statsItems = [
      {
        label: "Total Borrowed",
        value: stats.totalBorrowed,
        icon: require("../../assets/icons/book_icon.png"),
      },
      {
        label: "Currently Reading",
        value: stats.currentlyBorrowed,
        icon: require("../../assets/icons/read_icon.png"),
      },
      {
        label: "Books Returned",
        value: stats.booksReturned,
        icon: require("../../assets/icons/return_icon.png"),
      },
      {
        label: "Reading Hours",
        value: `${stats.readingTimeHours}h`,
        icon: require("../../assets/icons/clock_icon.png"),
      },
    ];

    return (
      <View style={styles.statsContainer}>
        {statsItems.map((item, index) => (
          <View key={index} style={styles.statItem}>
            <Image source={item.icon} style={styles.statIcon} />
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderSettings = () => {
    const settingsItems = [
      { label: "Personal Information", icon: "person" },
      { label: "Notification Settings", icon: "notifications" },
      { label: "Reading Preferences", icon: "book" },
      { label: "Privacy & Security", icon: "lock" },
    ];

    return (
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {settingsItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.settingItem}
            onPress={() => navigation.navigate(item.label.replace(/\s+/g, ""))}
          >
            <View style={styles.settingContent}>
              <Image
                // source={require(`../../assets/icons/${item.icon}.png`)}
                style={styles.settingIcon}
              />
              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>
            <Image
              source={require("../../assets/icons/right_arrow.png")}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[{ key: "profile" }]}
        renderItem={() => (
          <View>
            {renderHeader()}
            {renderProfileStats()}
            {renderSettings()}
          </View>
        )}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.padding,
    marginTop: 16,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: SIZES.padding,
  },
  profileTitle: {
    ...FONTS.h2,
    color: COLORS.white,
  },
  profileName: {
    ...FONTS.h2,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    height: 40,
    borderRadius: 20,
  },
  editIcon: {
    width: 20,
    height: 20,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: SIZES.padding,
    justifyContent: "space-between",
  },
  statItem: {
    width: "48%",
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    alignItems: "center",
  },
  statIcon: {
    width: 30,
    height: 30,
    tintColor: COLORS.primary,
  },
  statValue: {
    ...FONTS.h2,
    color: COLORS.white,
    marginVertical: SIZES.base,
  },
  statLabel: {
    ...FONTS.body4,
    color: COLORS.lightGray,
  },
  settingsContainer: {
    padding: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.white,
    marginBottom: SIZES.padding,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
    marginRight: SIZES.base,
  },
  settingLabel: {
    ...FONTS.body3,
    color: COLORS.white,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.lightGray,
  },
});

export default ProfilePage;
 */

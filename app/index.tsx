import { Redirect } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/fetch";

const Home = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        if (user?.id) {
          const response = await fetchAPI(`/(api)/user?clerkId=${user.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          console.log("Fetched user role:", response.role);
          setUserRole(response.role); // Expect `response.role` to exist
        }
      } catch (error) {
        console.error("Error fetching user role:", error.message || error);
        setUserRole("user"); // Default to "user" on error
      }
    };

    if (isSignedIn) {
      fetchUserRole();
    }
  }, [isSignedIn, user]);

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (userRole === null) {
    // Show a loading state while fetching
    return null; // Or replace with a loading spinner
  }

  if (userRole === "admin") {
    return <Redirect href="/(tabsAdmin)/home" />;
  }

  return <Redirect href="/(tabs)/home" />;
};

export default Home;

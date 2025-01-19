import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import "../global.css";
const Home = () => {
  const { isSignedIn } = useAuth();

  /*   if (isSignedIn) {
  
    return <Redirect href="/(tabs)" />;
  } */
  return <Redirect href="/(tabs)/home" />;
  /* return <Redirect href="./(auth)/sign-in" />; */
};
export default Home;

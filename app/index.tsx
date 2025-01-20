import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import "../global.css";
const Home = () => {
  const { isSignedIn } = useAuth();
  console.log("I am signed in ?", isSignedIn);
   if (isSignedIn) {
    return <Redirect href="/(tabs)/home" />;
   }
  return <Redirect href="/(auth)/sign-in" />;
    //return <Redirect href="/(tabsAdmin)/home" />; 
};
export default Home;

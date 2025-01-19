import { createStackNavigator } from "@react-navigation/stack";
import Home from "../(tabs)/home";
import BookDetail from "../(tabs)/bookDetail";

const Stack = createStackNavigator();

const App = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookDetail"
        component={BookDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default App;

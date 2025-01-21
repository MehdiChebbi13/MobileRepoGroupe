import { createStackNavigator } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";
import Home from "../(tabsAdmin)/home";
import BookDetail from "../(tabsAdmin)/bookDetail";
import AddBook from "../(tabsAdmin)/addBook";

import ModifyBook from "../(tabsAdmin)/ModifyBook";

export type RootStackParamList = {
  Home: undefined;
  BookDetail: { bookId: string };
  addBook: undefined;
  ModifyBook: { bookId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

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
      <Stack.Screen
        name="addBook"
        component={AddBook}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ModifyBook"
        component={ModifyBook}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default App;

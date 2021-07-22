import React, { useEffect, useState, useContext } from "react";
import {
  Pressable,
  FlatList,
  Text,
  View,
  Alert,
  NativeModules,
} from "react-native";
import { Badge } from "react-native-elements";

import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialCommunityIcons } from "react-native-vector-icons";

import Login from "../pages/Login";
import Join from "../pages/Join";
import Register from "../pages/Register";
import Index from "../pages/Index";
import History from "../pages/History";
import ActivityCreator from "../pages/ActivityCreator";
import Map from "../pages/Map";
import Chat from "../pages/Chat";

import { UsersContext } from "../Contexts/UserContext";
import { ChatContext } from "../Contexts/ChatContext";

import { socket, Response, getuserDataFromLocalStorage } from "../helpers/";

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const createTwoButtonAlert = async () =>
  new Promise((resolve) => {
    Alert.alert("Logout", "Are you sure to exit ? ", [
      {
        text: "No",
        onPress: () => resolve(false),
        style: "cancel",
      },
      { text: "Yes", onPress: () => resolve(true) },
    ]);
  });

const ActivityDisconnet = async (navigation, activityNumberStore) => {
  const localData = await getuserDataFromLocalStorage();
  //const { token, payload: { publicId } } = !!localData

  const answer = await createTwoButtonAlert();
  if (!answer) return null;
  console.log(localData?.payload?.publicId, activityNumberStore);
  if (activityNumberStore === localData?.payload?.publicId) {
    const urlParams = `token=${encodeURIComponent(localData?.token)}`;
    const responseData = await Response(
      "POST",
      `api/activity/complate`,
      urlParams
    );

    if (!responseData) return;
    socket.emit("compateEvent", localData?.payload?.publicId);
  }
  navigation.goBack(null);
  socket.disconnect();
  NativeModules.DevSettings.reload();
  if (!localData?.token) {
    return navigation.push("Join");
  }
  navigation.push("Index");
};
const mapPageTopBar = (navigation, newMessageCount, activityNumberStore) => ({
  headerShown: true,
  headerTitleAlign: "center",
  headerLeft: () => (
    <Pressable
      style={{ padding: 10 }}
      onPress={() => navigation.navigate("Chat")}
    >
      <MaterialCommunityIcons name="message-text" size={30} color="black" />
      {newMessageCount > 0 && (
        <Badge
          value={`${newMessageCount}`}
          status="error"
          containerStyle={{ position: "absolute", left: 30, bottom: 30 }}
        />
      )}
    </Pressable>
  ),
  headerRight: () => (
    <Pressable
      style={{ padding: 10 }}
      onPress={() => ActivityDisconnet(navigation, activityNumberStore)}
    >
      <MaterialCommunityIcons name="door-closed" size={30} color="black" />
    </Pressable>
  ),
});

const returnToMap = (navigation, messageList, setlastKey) => {
  navigation.goBack();
  findLastMessageIndex(messageList, setlastKey);
};

const findLastMessageIndex = (messageList, setlastKey) => {
  const lastIndex = messageList.length;
  setlastKey(lastIndex);
};

const Item = ({ title, color }) => (
  <View style={{ justifyContent: "center" }}>
    <Text
      style={{
        textAlign: "center",
        color: "black",
        padding: 10,
        backgroundColor: color,
        borderBottomWidth: 1,
      }}
    >
      {title}
    </Text>
  </View>
);

const renderItem = ({ item }) =>
  item.status && <Item title={item.username} color={item.color} />;

const chatPageTopBar = (
  navigation,
  users,
  showList,
  setShowList,
  messageList,
  setlastKey,
  lastKey
) => ({
  headerShown: true,
  headerTitleAlign: "center",
  headerTintColor: "white",
  headerStyle: { backgroundColor: "#0080FF" },
  headerRight: () => (
    <Pressable style={{ padding: 10 }} onPress={() => setShowList(!showList)}>
      <MaterialCommunityIcons name="account-multiple" size={30} color="white" />
      {showList && (
        <FlatList
          style={{
            flex: 1,
            right: 5,
            top: 55,
            width: 100,
            borderWidth: 0,
            position: "absolute",
          }}
          data={users}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${index}key`}
        />
      )}
    </Pressable>
  ),
  headerLeft: () => (
    <Pressable
      style={{ padding: 10 }}
      onPress={() => returnToMap(navigation, messageList, setlastKey)}
    >
      <MaterialCommunityIcons
        name="arrow-left-bold-circle"
        size={45}
        color={"white"}
      />
    </Pressable>
  ),
});

const Router = () => {
  const { users, activityNumberStore } = useContext(UsersContext);
  const { messageList, setlastKey, lastKey } = useContext(ChatContext);
  const [showList, setShowList] = useState(false);
  let newMessageCount = messageList.length - lastKey;
  return (
    <Stack.Navigator initialRouteName="Join">
      <Stack.Screen
        name="Join"
        component={Join}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={MyTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Map"
        component={Map}
        options={({ navigation }) =>
          mapPageTopBar(navigation, newMessageCount, activityNumberStore)
        }
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={({ navigation }) =>
          chatPageTopBar(
            navigation,
            users,
            showList,
            setShowList,
            messageList,
            setlastKey,
            lastKey
          )
        }
      />

      <Stack.Screen
        name="Index"
        component={Index}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="History"
        component={History}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="ActivityCreator"
        component={ActivityCreator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Login" component={Login} />
      <Tab.Screen name="Register" component={Register} />
    </Tab.Navigator>
  );
}

export default Router;

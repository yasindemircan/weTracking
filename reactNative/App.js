import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Router from "./src/components/navigator";

import { ChatProvider } from "./src/Contexts/ChatContext";
import { UsersProvider } from "./src/Contexts/UserContext";

export default function App() {
  return (
    <UsersProvider>
      <ChatProvider>
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </ChatProvider>
    </UsersProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

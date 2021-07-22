import React, { useState, useRef, useContext } from "react";
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Dimensions,
    TextInput,
    Pressable,
    FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";

import { ChatContext } from "../Contexts/ChatContext";

import socket from "../helpers/Socket";
import DeviceInfo from "react-native-device-info";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const deviceId = DeviceInfo.getUniqueId();

export default function chat() {
    const [messageText, SetMessageText] = useState(null);

    const { messageList, setlastKey } = useContext(ChatContext);
    const msgBoxRef = useRef(null);

    const selectSenderType = (id) => {
        if (socket.id !== id) {
            return {
                type: "another",
                bgColor: "white",
                fontColor: "black",
                alignSelf: "flex-start",
            };
        }
        return {
            type: "owned",
            bgColor: "#5999FF",
            fontColor: "white",
            alignSelf: "flex-end",
        };
    };

    const sendMessage = () => {
        if (!messageText) {
            return;
        }
        socket.emit("chat", { deviceId, messageText });
        SetMessageText("");
    };

    const Item = ({ name, color, message, time, id, uniq }) => (
        <View
            style={[
                styles.messageBox,
                {
                    backgroundColor: selectSenderType(id).bgColor,
                    alignSelf: selectSenderType(id).alignSelf,
                },
            ]}
        >
            {selectSenderType(id).type === "another" && (
                <Text style={[{ color: color }, styles.messageBoxNameField]}>
                    {name}
                </Text>
            )}
            <Text
                style={[
                    styles.maintextStyle,
                    { color: selectSenderType(id).fontColor },
                ]}
            >
                {message}
            </Text>
            <Text
                style={{
                    alignSelf: "flex-end",
                    fontSize: 11,
                    color: selectSenderType(id).fontColor,
                }}
            >
                {time}
            </Text>
        </View>
    );

    const renderItem = ({ item }) => (
        <Item
            uniq={item.user.deviceId}
            id={item.user.id}
            name={item.user.username}
            color={item.user.color}
            message={item.data.messageText}
            time={item.data.time}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.textContainer}>
                <FlatList
                    ref={msgBoxRef}
                    onContentSizeChange={() => msgBoxRef.current.scrollToEnd()}
                    onLayout={() => msgBoxRef.current.scrollToEnd()}
                    data={messageList}
                    renderItem={renderItem}
                    keyExtractor={(item, indx) => indx.toString()}
                ></FlatList>
            </View>
            <View style={styles.inputBox}>
                <TextInput
                    style={styles.inputText}
                    value={messageText}
                    onChangeText={SetMessageText}
                    placeholder={"Mesaj Yaz"}
                />
                <Pressable onPress={() => sendMessage()}>
                    <MaterialCommunityIcons
                        name="arrow-right-bold-circle"
                        size={50}
                        color={"#0080FF"}
                    />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: screenWidth,
        height: screenHeight,
        alignItems: "center",
    },
    textContainer: {
        width: screenWidth,
        flex: 1,
    },
    inputBox: {
        width: screenWidth,
        height: screenHeight * 0.09,
        bottom: 0,
        borderTopWidth: 1,
        borderColor: "grey",
        alignItems: "center",
        backgroundColor: "white",
        flexDirection: "row",
    },
    inputText: {
        width: "85%",
        height: "90%",
        backgroundColor: "white",
        borderBottomWidth: 0.8,
        borderColor: "grey",
        paddingLeft: 15,
    },
    maintextStyle: {
        alignSelf: "flex-start",
        paddingHorizontal: 5,
        paddingVertical: 5,
        maxWidth: "85%",
        color: "white",
    },
    messageBox: {
        alignSelf: "flex-end",
        elevation: 2,
        borderWidth: 0,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginVertical: "2%",
        marginHorizontal: "2%",
        backgroundColor: "#5999FF",
    },
    messageBoxNameField: {
        alignSelf: "flex-start",
        fontSize: 13,
        fontWeight: "bold",
    },
});

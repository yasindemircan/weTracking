import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    PermissionsAndroid,
    Alert,
} from "react-native";
import React, { useState, useContext } from "react";

import { MaterialCommunityIcons } from "react-native-vector-icons";

import { ModalComp } from "../components";
import AsyncStorage from "@react-native-async-storage/async-storage";

import DeviceInfo from "react-native-device-info";

import { Response, socket, getuserDataFromLocalStorage } from "../helpers/";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const bg = require("../images/bg4.png");

let routeDetail = null;

const JoinButtonInModal = async (
    navigation,
    SetModalVisible,
    inputText,
    roomId,
    modalVisible
) => {
    let deviceId = DeviceInfo.getUniqueId();
    const {
        payload: { name, surname },
    } = await getuserDataFromLocalStorage();
    let userFullName = `${name} ${surname}`;
    if (!inputText) {
        return Alert.alert("Hatalı Giriş", "lütfen Aktivite Numarası gir");
    }
    inputText = inputText.trim().toUpperCase();
    const responseData = await Response("GET", `location/connect/${inputText}`);
    if (!responseData.success) {
        return Alert.alert("Hata", responseData.message);
    }

    routeDetail = responseData;
    SetModalVisible(!modalVisible);

    socket.emit(
        "login",
        { roomId: inputText, username: userFullName, deviceId },
        (error) => {
            if (error) {
                console.log("errorr:", error);
                return ToastAndroid.show({
                    position: "top",
                    title: "Error",
                    description: error,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    );

    navigation.push("Map", { routeDetail, roomId: inputText });
};

function Index({ navigation }) {
    const [modalVisible, SetModalVisible] = useState(false);
    return (
        <ScrollView
            style={{
                flex: 1,
                borderWidth: 1,
                width: "100%",
                height: "100%",
                backgroundColor: "white",
            }}
            keyboardDismissMode={"on-drag"}
            keyboardShouldPersistTaps={"never"}
        >
            <SafeAreaView style={styles.container}>
                <View>
                    <ImageBackground
                        source={bg}
                        style={{ width: 300, height: 300, borderWidth: 0 }}
                        resizeMethod="auto"
                        resizeMode="center"
                    />
                </View>
                <View style={styles.context}>
                    <View style={styles.contextRow}>
                        <View style={styles.contextRowBox}>
                            <TouchableOpacity
                                style={styles.contextRowBoxContext}
                                onPress={() => navigation.navigate("ActivityCreator")}
                            >
                                <MaterialCommunityIcons
                                    name="map-plus"
                                    size={30}
                                    color="purple"
                                />
                                <Text>Create Activity</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.contextRowBox}>
                            <TouchableOpacity
                                style={styles.contextRowBoxContext}
                                onPress={() => SetModalVisible(!modalVisible)}
                            >
                                <MaterialCommunityIcons
                                    name="map-marker-path"
                                    size={30}
                                    color="purple"
                                />
                                <Text>Join Activity</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.contextRow}>
                        <View style={styles.contextRowBox}>
                            <TouchableOpacity
                                style={styles.contextRowBoxContext}
                                onPress={() => navigation.navigate("History")}
                            >
                                <MaterialCommunityIcons
                                    name="map-clock"
                                    size={30}
                                    color="purple"
                                />
                                <Text>Activity History</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.contextRowBox}>
                            <TouchableOpacity
                                style={styles.contextRowBoxContext}
                                onPress={() => {
                                    AsyncStorage.clear();
                                    navigation.navigate("Join");
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="logout-variant"
                                    size={30}
                                    color="purple"
                                />
                                <Text>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <ModalComp
                    TopContextText={"Lütfen Bağlanmak Istediğin Aktivite Numarasını Gir"}
                    placeholder={"Activity Numarası Giriniz"}
                    SetModalVisible={SetModalVisible}
                    JoinButton={JoinButtonInModal}
                    modalVisible={modalVisible}
                />
            </SafeAreaView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        backgroundColor: "#fff",
        borderWidth: 0,
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        height: screenHeight,
    },
    context: {
        flex: 1,
        borderWidth: 0,
        width: "100%",
    },
    contextRow: {
        flex: 0.5,
        borderWidth: 0,
        marginVertical: "1%",
        flexDirection: "row",
    },
    contextRowBox: {
        flex: 0.5,
        borderWidth: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    contextRowBoxContext: {
        width: "75%",
        height: "75%",
        maxHeight: screenHeight / 4.5,
        borderWidth: 0,
        flex: 1,
        alignItems: "center",
        justifyContent: "space-evenly",
        paddingBottom: "1%",
        backgroundColor: "lightgrey",
        elevation: 10,
        borderRadius: 15,
        shadowRadius: 10,
    },
});

export default Index;

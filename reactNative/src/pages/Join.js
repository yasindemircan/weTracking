import React, { useState } from "react";

import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    ToastAndroid,
} from "react-native";
import DeviceInfo from "react-native-device-info";
import { ModalComp } from "../components/";
import { Response, socket } from "../helpers/";

const bg = require("../images/bg3.jpg");

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

let routeDetail = null;

const JoinButtonInModal = (navigation, SetModalVisible, inputText, roomId) => {
    let deviceId = DeviceInfo.getUniqueId();
    roomId = roomId.trim().toUpperCase();
    if (!inputText) {
        return Alert.alert("Hatalı Giriş", "lütfen isim gir");
    }
    SetModalVisible(false);
    socket.emit("login", { roomId, username: inputText, deviceId }, (error) => {
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
    });

    navigation.push("Map", { routeDetail, roomId });
};

const JoinActivityButton = async (
    SetModalVisible,
    modalVisible,
    activityNumber,
    SetResponseData
) => {
    if (!activityNumber) {
        return Alert.alert("Hatalı Giriş", "Lütfen Activite Numarasını Girin.");
    }
    activityNumber = activityNumber.trim().toUpperCase();
    const responseData = await Response(
        "GET",
        `location/connect/${activityNumber}`
    );
    if (!responseData.success) {
        return Alert.alert("Hata", responseData.message);
    }
    SetResponseData(responseData);
    routeDetail = responseData;
    SetModalVisible(!modalVisible);
};
export default function join({ navigation }) {
    const [modalVisible, SetModalVisible] = useState(false);
    const [activityNumber, SetActivityNumber] = useState(null);
    const [responseData, SetResponseData] = useState(null);

    return (
        <SafeAreaView style={{ width: screenWidth, height: screenHeight, flex: 1 }}>
            <ScrollView style={styles.container} keyboardDismissMode={"interactive"}>
                <View style={{ flex: 1, borderWidth: 0 }}>
                    <ImageBackground
                        source={bg}
                        style={styles.backgroundImage}
                        blurRadius={2}
                        resizeMethod="auto"
                        resizeMode="cover"
                    />
                    <Image
                        source={require("../images/logo.png")}
                        style={styles.logo}
                        opacity={0.8}
                        resizeMode="cover"
                        resizeMethod="auto"
                    />
                </View>

                <View style={styles.context}>
                    <Text
                        style={styles.welcome}
                        onPress={() => {
                            navigation.navigate("Index");
                        }}
                    >
                        Welcome!
                    </Text>

                    <TextInput
                        style={styles.inputBox}
                        placeholder={"Activity Number"}
                        maxLength={15}
                        onChangeText={SetActivityNumber}
                    />
                    <TouchableOpacity
                        style={styles.joinButton}
                        onPress={() =>
                            JoinActivityButton(
                                SetModalVisible,
                                modalVisible,
                                activityNumber,
                                SetResponseData
                            )
                        }
                    >
                        <Text style={styles.joinButtonText}>Join a Activity</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={styles.loginButtonText}> Sing In & Sing Up </Text>
                    </TouchableOpacity>
                </View>
                <ModalComp
                    TopContextText={`${responseData?.roomCreator
                        } Aktivitesine Katılmak Üzeresin ${"\n"} Lütfen İsim Gir`}
                    placeholder={"Isim Giriniz"}
                    SetModalVisible={SetModalVisible}
                    modalVisible={modalVisible}
                    //setInputText={setInputText}
                    JoinButton={JoinButtonInModal}
                    roomId={activityNumber}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    backgroundImage: {
        width: screenWidth,
        height: screenHeight,
        borderWidth: 0,
        flex: 1,
        position: "absolute",
        opacity: 0.6,
    },
    logo: {
        width: "100%",
        height: screenHeight / 3,
        marginTop: "17%",
    },
    context: {
        flex: 1,
        width: "100%",
        height: screenHeight - 350,
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20%",
    },
    welcome: {
        fontSize: 22,
        fontWeight: "400",
        color: "black",
        marginBottom: "5%",
    },
    inputBox: {
        width: "95%",
        height: 40,
        borderWidth: 0.5,
        borderColor: "#BAC0C4",
        textAlign: "center",
        opacity: 0.8,
        backgroundColor: "#DDDFE1",
    },
    joinButton: {
        width: "95%",
        height: 40,
        marginTop: "4%",
        borderColor: "#BAC0C4",
        backgroundColor: "#6165D9",
        justifyContent: "center",
        alignItems: "center",
    },
    joinButtonText: {
        color: "white",
    },
    loginButton: {
        width: "95%",
        height: 40,
        borderWidth: 0.9,
        marginVertical: "4%",
        borderColor: "#6165D9",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.0)",
    },
    loginButtonText: {
        color: "#6165D9",
    },
});

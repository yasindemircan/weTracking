import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    Image,
    ScrollView,
    SafeAreaView,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Response } from "../helpers/";

const bg = require("../images/bg3.jpg");
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const SetLocalStore = async (responseData) => {
    const { name, token } = responseData;
    console.log(name, token);
    try {
        const jsonValue = await JSON.stringify({ name, token });
        await AsyncStorage.setItem("@UserData_key", jsonValue);
    } catch (error) {
        return error;
    }
};

const LoginButton = async (navigation, email, password) => {
    if (!email && !password) {
        Alert.alert("Hatalı Giriş", "Lütfen Tüm Alanları Doldur.");
        return;
    }
    const responseData = await Response(
        "POST",
        "login",
        `email=${encodeURIComponent(email)}&password=${encodeURIComponent(
            password
        )}`
    );
    if (!responseData.token) {
        Alert.alert("Hatalı Giriş", "Hesap Bilgileri Eşleşmiyor.");
        return;
    }
    SetLocalStore(responseData);
    navigation.navigate("Index");
};
function login({ navigation }) {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollBox}>
                <View style={styles.container}>
                    <ImageBackground
                        source={bg}
                        style={styles.backgroundImage}
                        blurRadius={2}
                        resizeMethod="auto"
                        resizeMode="cover"
                    />
                    <View style={styles.logoContainer}>
                        <Image
                            source={require("../images/logo.png")}
                            style={styles.logo}
                            opacity={0.8}
                            resizeMode="cover"
                            resizeMethod="auto"
                        />
                    </View>
                    <View style={styles.emailView}>
                        <TextInput
                            placeholder="E-mail"
                            style={styles.UserNameInput}
                            keyboardType={"email-address"}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View style={styles.passView}>
                        <TextInput
                            placeholder="Password"
                            secureTextEntry={true}
                            style={styles.passwordInput}
                            onChangeText={setPassword}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => LoginButton(navigation, email, password)}
                    >
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: screenHeight,
        backgroundColor: "white",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    safeArea: {
        width: screenWidth,
        height: screenHeight,
        flex: 1,
    },
    scrollBox: {
        width: "100%",
        height: screenHeight - 75,
    },
    backgroundImage: {
        width: screenWidth,
        height: screenHeight,
        flex: 1,
        position: "absolute",
        opacity: 0.6,
    },
    logoContainer: {
        flex: 0.4,
        width: "100%",
        marginTop: "17%",
    },
    logo: {
        width: "100%",
        height: screenHeight / 3,
        position: "relative",
    },
    emailView: {
        width: "95%",
        flex: 0.15,
        justifyContent: "center",
        alignItems: "center",
    },
    UserNameInput: {
        width: "95%",
        borderBottomWidth: 0.6,
        marginBottom: "3%",
    },
    passView: {
        width: "95%",
        flex: 0.15,
        alignItems: "baseline",
        justifyContent: "center",
        flexDirection: "row",
    },
    passwordInput: {
        width: "95%",
        borderBottomWidth: 0.6,
    },
    inputIcon: {
        width: 25,
        height: 25,
        marginLeft: 15,
        position: "relative",
        opacity: 0.6,
    },
    loginButton: {
        width: "90%",
        height: "8%",
        marginTop: "5%",
        elevation: 20,
        backgroundColor: "#6165D9",
        justifyContent: "center",
        alignItems: "center",
    },
    loginButtonText: {
        color: "white",
        fontSize: 17,
    },
});
export default login;

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

import Response from "../helpers/response";

const bg = require("../images/bg3.jpg");

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const RegisterButton = async (navigation, nameSurname, email, password) => {
    if (!nameSurname && !email && !password) {
        Alert.alert("Hatalı Giriş", "Lütfen Tüm Alanları Doldur.");
        return;
    }
    let splitSurname = nameSurname.trim().split(" ");
    if (splitSurname.length < 1 || nameSurname.length < 5) {
        Alert.alert("Hatalı Giriş", "Isim ve Soyisim Gereklidir.");
        return;
    }
    const urlParams = `email=${encodeURIComponent(
        email
    )}&password=${encodeURIComponent(password)}&name=${encodeURIComponent(
        splitSurname[0]
    )}&surname=${encodeURIComponent(splitSurname[splitSurname.length - 1])}`;
    const responseData = await Response("POST", "register", urlParams);
    if (!responseData?.success && responseData?.code !== 201) {
        Alert.alert("Hatalı Giriş", `${responseData?.message}`);
        return;
    }
    Alert.alert("Kayıt Başarılı", "Kayıt işlemi Başarılı Giriş Yapabilirsin.");
    navigation.navigate("Login");
};

export default function register({ navigation }) {
    const [nameSurname, setNameSurmane] = useState(null);
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
                    <View style={styles.inputView}>
                        <TextInput
                            placeholder="Name & Surname"
                            style={styles.UserNameInput}
                            onChangeText={setNameSurmane}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            placeholder="E-mail"
                            style={styles.UserNameInput}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            placeholder="Password"
                            secureTextEntry={true}
                            style={styles.passwordInput}
                            onChangeText={setPassword}
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() =>
                            RegisterButton(navigation, nameSurname, email, password)
                        }
                    >
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        width: screenWidth,
        height: screenHeight,
        flex: 1,
    },
    scrollBox: {
        width: "100%",
        height: screenHeight - 75,
    },
    container: {
        width: "100%",
        height: screenHeight,
        backgroundColor: "white",
        justifyContent: "flex-start",
        alignItems: "center",
        flex: 1,
    },
    logoContainer: {
        flex: 0.4,
        width: "100%",
        marginTop: "17%",
    },
    backgroundImage: {
        width: screenWidth,
        height: screenHeight,
        borderWidth: 1,
        flex: 1,
        position: "absolute",
        opacity: 0.6,
    },
    logo: {
        width: "100%",
        height: screenHeight / 3,
        position: "relative",
    },
    inputView: {
        width: "100%",
        borderWidth: 0,
        flex: 0.15,
        justifyContent: "center",
        alignItems: "center",
    },
    UserNameInput: {
        width: "90%",
        borderBottomColor: "grey",
        borderBottomWidth: 0.7,
        marginBottom: "3%",
    },
    passwordInput: {
        width: "90%",
        borderBottomColor: "grey",
        borderBottomWidth: 0.7,
    },
    registerButton: {
        width: "90%",
        height: "8%",
        marginTop: "5%",
        borderWidth: 0,
        elevation: 20,
        backgroundColor: "#6165D9",
        justifyContent: "center",
        alignItems: "center",
    },
    registerButtonText: {
        color: "white",
        fontSize: 17,
    },
});

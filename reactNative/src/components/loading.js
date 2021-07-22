import React from "react";
import { View, ActivityIndicator, Dimensions, StyleSheet } from "react-native";
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const loading = (color = "#0080FF") => {
    return (
        <View style={styles.loadingView}>
            <ActivityIndicator size={screenWidth / 8} color={"white"} />
        </View>
    );
};

const styles = StyleSheet.create({
    loadingView: {
        width: screenWidth / 3,
        height: screenHeight / 5,
        marginTop: "auto",
        marginBottom: "auto",
        borderRadius: screenWidth / 25,
        opacity: 0.9,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default loading;

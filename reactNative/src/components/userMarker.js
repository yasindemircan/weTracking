import React from "react";
import { View, Dimensions, StyleSheet, Text } from "react-native";
import { Marker } from "react-native-maps";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const nameCutter = (name) => {
    let namearry = name.split(" ");
    if (namearry.length < 2) {
        return name.toUpperCase().split("", 1);
    }
    return (
        name.split("", 1) + namearry[namearry.length - 1].split("", 1)
    ).toUpperCase();
};

const UserMarker = (props) => {
    const {
        address: {
            data: address,
            user: { id: userID },
        },
        MarkerColor,
        pointName,
    } = props;
    return (
        <Marker
            coordinate={{
                latitude: address.latitude,
                longitude: address.longitude,
            }}
            radius={15}
            pinColor={MarkerColor}
            flat={true}
            key={pointName}
            title={address.mainText || pointName}
            description={`${Math.floor(address.speed)}` || " "}
        >
            <View style={{ justifyContent: "center" }}>
                <Text style={[styles.userCard, { backgroundColor: MarkerColor }]}>
                    {nameCutter(pointName)}
                </Text>
            </View>
        </Marker>
    );
};

export default React.memo(UserMarker);

const styles = StyleSheet.create({
    userCard: {
        borderWidth: 1,
        borderColor: "lightgrey",
        width: screenWidth * 0.1,
        height: screenWidth * 0.1,
        borderRadius: Math.floor(screenWidth + screenHeight) / 2,
        textAlign: "center",
        textAlignVertical: "center",
        margin: 5,
        color: "white",
        fontSize: Math.floor(screenWidth + screenHeight) / 60,
        marginHorizontal: 5,
    },
});

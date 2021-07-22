import React, { useState, useRef, useEffect, useContext } from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    FlatList,
    Share,
} from "react-native";

import { MaterialCommunityIcons } from "react-native-vector-icons";

import {
    Map,
    RouteMarkers,
    WaypointMarker,
    Route,
    UserMarker,
} from "../components";

import { UsersContext } from "../Contexts/UserContext";

import { socket } from "../helpers/";
import DeviceInfo from "react-native-device-info";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const ASPECT_RATIO = screenWidth / screenHeight;

const nameCutter = (name) => {
    let namearry = name.split(" ");
    if (namearry.length < 2) {
        return name.toUpperCase().split("", 1);
    }
    return (
        name.split("", 1) + namearry[namearry.length - 1].split("", 1)
    ).toUpperCase();
};

export default function map({ navigation, route }) {
    const [userPoints, setUserPoints] = useState([]);
    const [userLocation, setUserLocation] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [routeDetails, setRouteDetails] = useState();

    const [showMode, setShowMode] = useState(0);

    const deviceId = DeviceInfo.getUniqueId();

    const { users, activityNumberStore, setActivityNumberStore } =
        useContext(UsersContext);
    const userList = [...users];
    let newUSERLIST = [];
    const mapRef = useRef();
    let { routeDetail, roomId } = route.params;
    const { startAddress, finishAddress, waypoints } = routeDetail;

    const getCamera = (coord) => {
        let LATITUDEDELT = 0.0026;
        setShowMode(0);
        mapRef.current.animateToRegion(
            {
                latitude: coord.latitude,
                longitude: coord.longitude,
                latitudeDelta: LATITUDEDELT,
                longitudeDelta: LATITUDEDELT * ASPECT_RATIO,
            },
            1000
        );
    };
    const userListFromContext = (prev) => {
        return prev.filter((e) => userList.some((n) => e.user.id === n.id));
    };

    const onShare = async (roomNumber = "activityNumberStore") => {
        try {
            const result = await Share.share({
                message: roomNumber,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    newUSERLIST = userListFromContext(userPoints);

    useEffect(() => {
        userLocation && socket.emit("coord", { userLocation, deviceId });
        setUserLocation(null);
        userLocation &&
            showMode < 3 &&
            showMode !== 0 &&
            coordinateFit(userLocation, showMode);
    }, [userLocation]);

    const changeState = (prev, next) => {
        let existingData = prev.find((e) => e.user.id === next.user.id);
        if (!existingData) {
            return [...prev, next];
        } else if (existingData) {
            return prev.map((item) => {
                if (item.user.id === next.user.id) {
                    return { ...item, data: next.data };
                }
                return item;
            });
        }
        return prev;
    };

    useEffect(() => {
        setActivityNumberStore(roomId);
    }, []);
    useEffect(() => {
        socket.on("Scoord", (msg) => {
            setUserPoints((prev) =>
                changeState(prev, { data: msg.data.userLocation, user: msg.user })
            );
        });
    }, [socket]);

    const coordinateFit = (coord, mode) => {
        const modeSelector = (num) => {
            if (num === 0) return null;
            if (num === 1) return 0.001;
            if (num === 2) return 0.006;
        };
        let LATITUDEDELT = modeSelector(mode);
        if (mode !== 0) {
            mapRef.current.animateToRegion(
                {
                    latitude: coord.latitude,
                    longitude: coord.longitude,
                    latitudeDelta: LATITUDEDELT,
                    longitudeDelta: LATITUDEDELT * ASPECT_RATIO,
                },
                2000
            );
        }
    };

    const Item = ({ title, color, coord }) => (
        <TouchableOpacity onPress={() => getCamera(coord)}>
            <View style={{ justifyContent: "center" }}>
                <Text style={[styles.userCard, { backgroundColor: color }]}>
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) =>
        item.user.status && (
            <Item
                title={nameCutter(item.user.username)}
                color={item.user.color}
                coord={item.data}
            />
        ); //
    const headerItem = () => (
        <TouchableOpacity onPress={() => onShare(activityNumberStore || "")}>
            <View style={{ justifyContent: "center" }}>
                <Text style={[styles.userCard, { backgroundColor: "green" }]}>Add</Text>
            </View>
        </TouchableOpacity>
    );
    return (
        <SafeAreaView style={styles.safeAreaView}>
            <Map
                onLongPressFunc={false}
                CustomStyles={{ height: "90%" }}
                mapRef={mapRef}
                setUserLocationChange={setUserLocation}
                setIsLoading={setIsLoading}
            >
                <RouteMarkers
                    address={startAddress}
                    MarkerColor={"green"}
                    pointName={"Baslangıc"}
                />

                <RouteMarkers address={finishAddress} pointName={"Bitis"} />
                {waypoints &&
                    waypoints.map((waypoint, index) => (
                        <WaypointMarker
                            waypoint={waypoint}
                            waypoints={waypoints}
                            key={index}
                            index={index}
                            MarkerColor={"orange"}
                            draggable={false}
                        />
                    ))}

                {startAddress && finishAddress && (
                    <Route
                        startAddress={startAddress}
                        finishAddress={finishAddress}
                        // selectedMode={"WALKING"}  // add mode selector *************
                        waypoints={waypoints}
                        setIsLoading={setIsLoading}
                        setRouteDetails={setRouteDetails}
                        mapRef={mapRef}
                    />
                )}

                {newUSERLIST &&
                    newUSERLIST.map((marker) => (
                        <UserMarker
                            key={marker.user.id}
                            address={marker}
                            MarkerColor={marker.user.color}
                            pointName={marker.user.username}
                        />
                    ))}
            </Map>
            <TouchableOpacity
                style={styles.currentLocationButton}
                onPress={() => {
                    if (showMode < 2) {
                        setShowMode(showMode + 1);
                    } else if (showMode > 1) {
                        setShowMode(0);
                    }
                }}
            >
                {!showMode && (
                    <MaterialCommunityIcons
                        name="crosshairs-gps"
                        size={24}
                        color={"grey"}
                    />
                )}
                {showMode === 1 && (
                    <MaterialCommunityIcons
                        name="crosshairs-gps"
                        size={24}
                        color={"black"}
                    />
                )}
                {showMode === 2 && (
                    <MaterialCommunityIcons
                        name="account-supervisor"
                        size={24}
                        color={"black"}
                    />
                )}
            </TouchableOpacity>
            <View style={styles.buttomBar}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ListFooterComponent={headerItem}
                    pagingEnabled
                    data={newUSERLIST}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.user.id}
                ></FlatList>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        width: screenWidth,
        height: screenHeight,
    },
    buttomBar: {
        width: screenWidth,
        height: screenHeight * 0.1,
        borderWidth: 0,
        borderColor: "white",
        position: "absolute",
        bottom: 0,
        flex: 1,
        justifyContent: "center",
    },
    userCard: {
        borderWidth: 1,
        borderColor: "lightgrey",
        width: screenWidth * 0.13,
        height: screenWidth * 0.13,
        borderRadius: Math.floor(screenWidth + screenHeight) / 2,
        textAlign: "center",
        textAlignVertical: "center",
        margin: 5,
        color: "white",
        fontSize: 20,
        marginHorizontal: 5,
    },
    currentLocationButton: {
        flex: 1,
        width: screenWidth * 0.12,
        height: screenWidth * 0.12,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        backgroundColor: "lightgrey",
        bottom: "13%",
        right: "5%",
        position: "absolute",
        elevation: 15,
        opacity: 0.8,
    },
});

import React from "react";
import { Dimensions, StyleSheet, Alert } from "react-native";

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const ASPECT_RATIO = screenWidth / screenHeight;
let LATITUDEDELTA = 20;

const Map = ({
    children,
    mapRef,
    CustomStyles = { height: "100%" },
    isActiveCurrentLocation = true,
    waypoints = {},
    setWayPoints = {},
    onLongPressFunc = true,
    setUserLocationChange,
    liteMode = false,
    setIsLoading,
}) => {
    return (
        <>
            <MapView
                style={[styles.map, CustomStyles]}
                ref={mapRef}
                mapType={Platform.OS === "android" ? "standard" : "none"}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: 38.963745,
                    longitude: 35.243322,
                    latitudeDelta: LATITUDEDELTA,
                    longitudeDelta: LATITUDEDELTA * ASPECT_RATIO,
                }}
                // showsTraffic={true}
                liteMode={liteMode}
                showsMyLocationButton={false}
                showsCompass={true}
                toolbarEnabled={false}
                moveOnMarkerPress
                //loadingEnabled={true}
                //showsBuildings={false}
                onMapReady={(ready) => setIsLoading(false)}
                userLocationPriority={"high"}
                userLocationFastestInterval={5000}
                userLocationUpdateInterval={5000}
                onUserLocationChange={
                    setUserLocationChange
                        ? (locaData) =>
                            setUserLocationChange(locaData.nativeEvent.coordinate)
                        : null
                }
                showsUserLocation={!liteMode && isActiveCurrentLocation}
                onLongPress={
                    !onLongPressFunc
                        ? null
                        : (e) => {
                            waypoints.length > 4
                                ? Alert.alert("Hata", "Daha Fazla Ekleme Yapılamaz...")
                                : setWayPoints([...waypoints, e.nativeEvent.coordinate]);
                        }
                }
            >
                {children}
            </MapView>
        </>
    );
};

const styles = StyleSheet.create({
    map: {
        flex: 1,
        borderWidth: 0,
        position: "absolute", // relative
        width: "100%",
        zIndex: 0,
    },
});
export default React.memo(Map);

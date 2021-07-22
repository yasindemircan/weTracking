import React from "react";
import { Dimensions, Alert } from "react-native";
import Links from "../helpers/links";
import MapViewDirections from "react-native-maps-directions";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const Route = ({
    startAddress,
    finishAddress,
    selectedMode = "DRIVING",
    setIsLoading,
    setRouteDetails,
    waypoints,
    mapRef,
}) => {
    return (
        <>
            <MapViewDirections
                origin={{
                    latitude: startAddress.latitude,
                    longitude: startAddress.longitude,
                }}
                destination={{
                    latitude: finishAddress.latitude,
                    longitude: finishAddress.longitude,
                }}
                mode={selectedMode} // add mode selector *************//
                strokeWidth={5}
                precision="high" // stroke dogruluk
                timePrecision="now" //traffic
                waypoints={waypoints}
                strokeColor="#0080FF"
                // resetOnChange={false}
                // optimizeWaypoints={true}
                // splitWaypoints={true}
                apikey={Links.Google_Api_Keys.route}
                language="tr"
                onStart={() => {
                    setIsLoading(true);
                }}
                onReady={(result) => {
                    setIsLoading(false);
                    setRouteDetails({
                        distance: result.distance,
                        duration: result.duration,
                    });
                    mapRef.current.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                            right: screenWidth / 20,
                            bottom: screenHeight / 5,
                            left: screenWidth / 20,
                            top: screenHeight / 2,
                        },
                    });
                }}
                onError={(errMsj) => {
                    Alert.alert("Upps", "Rota Oluşturulamadı Lütfen Tekrar Deneyin.");
                    setIsLoading(false);
                }}
            />
        </>
    );
};

export default Route;

import React from "react";
import { Dimensions } from "react-native";
import { Marker } from "react-native-maps";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const WaypointMarker = ({
    waypoint,
    waypoints,
    index,
    MarkerColor,
    setIsStartDrag,
    setWayPoints,
    draggable = true,
}) => {
    return (
        <Marker
            coordinate={{
                latitude: waypoint.latitude,
                longitude: waypoint.longitude,
            }}
            pinColor={MarkerColor}
            radius={25}
            flat={true}
            title={`${index + 1}.`}
            description={`Mola`}
            draggable={draggable}
            onDragStart={() => setIsStartDrag(true)}
            onDragEnd={(t) => {
                if (
                    t.nativeEvent.position.x < screenWidth * 0.35 &&
                    t.nativeEvent.position.y > 1.5 * (screenHeight - screenHeight * 0.05)
                ) {
                    let changedWayPointss = waypoints.filter((E) => E !== waypoint);
                    setWayPoints(changedWayPointss);
                } else {
                    let changedWayPoints = [...waypoints];
                    changedWayPoints[index] = t.nativeEvent.coordinate;
                    setWayPoints(changedWayPoints);
                }
                setIsStartDrag(false);
            }}
        />
    );
};
export default WaypointMarker;

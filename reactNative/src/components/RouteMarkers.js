import React from "react";
import { Marker } from "react-native-maps";

const RouteMarkers = ({
    address,
    MarkerColor,
    pointName,
    draggable = false,
    onDragEnd,
}) => {
    return (
        <Marker
            coordinate={{
                latitude: address.latitude,
                longitude: address.longitude,
            }}
            radius={25}
            pinColor={MarkerColor}
            flat={true}
            key={pointName}
            title={address.mainText || pointName}
            description={address.description || ""}
            draggable={draggable}
            onDragEnd={draggable ? onDragEnd : null}
        />
    );
};

export default RouteMarkers;

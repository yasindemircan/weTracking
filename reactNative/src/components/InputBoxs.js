import React, { forwardRef } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Link } from "../helpers/";

const homePlace = {
  description: "Your Location",
  structured_formatting: { main_text: "Your Location" },
  geometry: { location: { lat: 40.174903, lng: 20.609588 } },
};

const InputBox = forwardRef(
  (
    { Location, setSelected, placeholder, iconColor, elevationZ, positionTop },
    ref
  ) => (
    <GooglePlacesAutocomplete
      placeholder={placeholder}
      onPress={async (data, details = null) => {
        setSelected({
          description: data?.description,
          mainText: data?.structured_formatting?.main_text,
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
        });
      }}
      numberOfLines={5}
      isRowScrollable={true}
      listViewDisplayed={"auto"}
      minLength={5}
      fetchDetails
      autoFocus={true}
      ref={ref}
      enableHighAccuracyLocation
      renderRightButton={() => (
        <MaterialCommunityIcons
          name="map-marker-radius"
          size={28}
          color={iconColor}
        />
      )}
      suppressDefaultStyles
      keyboardShouldPersistTaps="always"
      styles={{
        row: { borderWidth: 0, padding: 10 },
        poweredContainer: { display: "none" },
        textInputContainer: {
          width: "100%",
          borderBottomWidth: 1,
          borderColor: "lightgrey",
          flexDirection: "row",
          alignItems: "center",
        },
        container: {
          zIndex: elevationZ,
          backgroundColor: "white",
          width: "90%",
          borderRadius: 7,
          borderColor: "grey",
          marginTop: `${positionTop}%`,
          position: "absolute",
          justifyContent: "center",
        },
        textInput: { backgroundColor: "white", flex: 1, borderRadius: 7 },
        description: { flexShrink: 0 },
      }}
      query={{
        key: Link.Google_Api_Keys.autoComplate,
        language: "tr",
        components: "country:tr",
      }}
      predefinedPlaces={[homePlace]}
    />
  )
);

export default InputBox;

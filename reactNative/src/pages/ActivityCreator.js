import React, { useState, useEffect, useRef, createRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  PermissionsAndroid,
  SafeAreaView,
  Keyboard,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { Response, getuserDataFromLocalStorage, socket } from "../helpers/";
import {
  InputBox,
  Loading,
  Map,
  RouteMarkers,
  WaypointMarker,
  Route,
} from "../components";

import DeviceInfo from "react-native-device-info";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
const deviceId = DeviceInfo.getUniqueId();

let LATITUDEDELTA = 20;
const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "You must to accept this to make it work.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    console.log({ granted });
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
};

const CreateActivityButton = async (
  navigation,
  startAddress,
  finishAddress,
  waypoints = []
) => {
  const {
    token,
    payload: { name, surname, publicId },
  } = await getuserDataFromLocalStorage();

  if (!startAddress && !finishAddress) {
    Alert.alert("Hatalı Giriş", "Lütfen Baslangıc ve Bitis Adreslerini Gir");
    return;
  }
  const responseData = await Response(
    "POST",
    "api/activity/new",
    JSON.stringify({ token, startAddress, finishAddress, waypoints }),
    "application/json; charset=utf-8"
  );
  if (!responseData.success) {
    Alert.alert(
      "Hatalı Giriş",
      `${responseData.message}\n Activite Id:${publicId}`
    );
    return;
  }
  socket.emit(
    "login",
    {
      roomId: responseData.ActivityInviteCode,
      username: `${name} ${surname}`,
      deviceId,
    },
    (error) => {
      if (error) {
        console.log("errorr:", error);
      }
    }
  );
  navigation.push("Map", {
    routeDetail: { startAddress, finishAddress, waypoints },
    roomId: responseData.ActivityInviteCode,
  });
};

export default function activityCreator({ navigation }) {
  const [currentLocation, setCurrentLocation] = useState("");
  const [isActiveCurrentLocation, SetIsActiveCurrentLocation] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [routeDetails, setRouteDetails] = useState();
  const [waypoints, setWayPoints] = useState([]);
  const [startAddress, setStartAddress] = useState(null);
  const [finishAddress, setFinishAddress] = useState(null);

  const [isStartDrag, setIsStartDrag] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const mapRef = useRef();
  const refInputs = createRef();
  const refFinputs = createRef();
  const trashBinAnimation = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.timing(trashBinAnimation, {
      toValue: 1.5 * (screenWidth * 0.1),
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const reverseAnimation = () => {
    Animated.timing(trashBinAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );
    isStartDrag ? startAnimation() : reverseAnimation();
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [isStartDrag]);

  const timeConverter = (time) => {
    let hours = Math.floor(time / 60);
    let minutes = Math.floor(time % 60);
    return hours > 0 ? `${hours} Saat ${minutes} Dakika` : `${minutes} Dakika`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Map
        mapRef={mapRef}
        Setheight={"100%"}
        showsCompass={true}
        isActiveCurrentLocation
        setWayPoints={setWayPoints}
        waypoints={waypoints}
        setIsLoading={setIsLoading}
      >
        {startAddress && finishAddress && (
          <Route
            startAddress={startAddress}
            finishAddress={finishAddress}
            // selectedMode={"WALKING"}
            waypoints={waypoints}
            setIsLoading={setIsLoading}
            setRouteDetails={setRouteDetails}
            mapRef={mapRef}
          />
        )}

        {startAddress && (
          <RouteMarkers
            address={startAddress}
            MarkerColor={"green"}
            pointName={"Baslangıc"}
          />
        )}
        {finishAddress && (
          <RouteMarkers
            address={finishAddress}
            pointName={"Bitis"}
            draggable
            onDragEnd={(t) => {
              setFinishAddress({
                description: "Selected point",
                mainText: "Bitis",
                latitude: t.nativeEvent.coordinate.latitude,
                longitude: t.nativeEvent.coordinate.longitude,
              });
            }}
          />
        )}
        {waypoints &&
          waypoints.map((waypoint, index) => (
            <WaypointMarker
              waypoint={waypoint}
              waypoints={waypoints}
              key={index}
              index={index}
              MarkerColor={"orange"}
              setIsStartDrag={setIsStartDrag}
              setWayPoints={setWayPoints}
            />
          ))}
      </Map>
      <View style={styles.inputs}>
        <InputBox
          ref={refInputs}
          key={"start"}
          setSelected={setStartAddress}
          placeholder="Baslangıc Adresi"
          iconColor="darkgreen"
          elevationZ={5}
          positionTop={5}
        />
        <InputBox
          ref={refFinputs}
          key={"finish"}
          setSelected={setFinishAddress}
          placeholder="Bitis Adresi"
          iconColor="darkred"
          elevationZ={2}
          positionTop={18}
        />
      </View>
      {!isKeyboardVisible && (
        <Animated.View
          style={[
            styles.trashBin,
            {
              transform: [{ translateX: trashBinAnimation }],
            },
          ]}
        >
          <MaterialCommunityIcons
            name="delete-empty"
            size={screenWidth / 15}
            color={"black"}
          />
        </Animated.View>
      )}
      {isLoading && <Loading />}

      {!isKeyboardVisible && (
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={() => {
            requestCameraPermission();
            SetIsActiveCurrentLocation(!isActiveCurrentLocation);

            //getCamera()
            // Geolocation.getCurrentPosition(info => {
            //     getAddress([info.coords.latitude,
            //     info.coords.longitude], setAddress)
            //    // setCurrentLocation(info)
            // },
            //     (err) => console.log(err),
            //     {
            //         accuracy: {
            //             android: 'high',
            //             ios: 'best',
            //         },
            //         enableHighAccuracy: true,
            //         timeout: 15000,
            //         maximumAge: 10000,
            //         distanceFilter: 0,
            //         forceRequestLocation: true,
            //         showLocationDialog: true,
            //     },
            // );
          }}
          onLongPress={() => {
            Geolocation.getCurrentPosition((position) =>
              console.log("coord", position)
            );
          }}
        >
          {currentLocation ? (
            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={24}
              color={"black"}
            />
          ) : (
            <MaterialCommunityIcons
              name="crosshairs-question"
              size={24}
              color={"black"}
            />
          )}
        </TouchableOpacity>
      )}

      {!isKeyboardVisible && (
        <TouchableOpacity
          style={styles.createActivityBox}
          onPress={() =>
            CreateActivityButton(
              navigation,
              startAddress,
              finishAddress,
              waypoints
            )
          }
        >
          <Text style={styles.createActivityButton}>Create Activity</Text>
          {routeDetails && (
            <Text style={{ color: "white" }}>
              <MaterialCommunityIcons
                name="clock-time-four"
                size={screenWidth / 20}
                color="white"
              />
              {timeConverter(routeDetails.duration)}
              <MaterialCommunityIcons
                name="directions"
                size={screenWidth / 20}
                color="white"
              />
              {Math.round(routeDetails.distance)} KM
            </Text>
          )}
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    height: screenHeight,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: screenHeight - 20,
  },
  inputs: {
    width: "100%",
    alignItems: "center",
    position: "relative",
  },
  createActivityBox: {
    width: "85%",
    height: "8%",
    minHeight: screenHeight / 15,
    position: "absolute",
    alignItems: "center",
    elevation: 15,
    zIndex: 5,
    bottom: "7%",
    justifyContent: "center",
    backgroundColor: "green",
    borderRadius: 5,
    flexDirection: "column-reverse",
  },
  createActivityButton: {
    color: "white",
    fontSize: 18,
  },
  currentLocationButton: {
    flex: 1,
    width: screenWidth / 9,
    height: screenHeight / 14,
    maxHeight: screenHeight / 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: screenHeight / 30,
    backgroundColor: "lightgrey",
    bottom: "16%",
    right: "3%",
    position: "absolute",
    elevation: 15,
    opacity: 0.8,
  },
  trashBin: {
    zIndex: 1,
    flex: 1,
    width: screenWidth / 9,
    height: screenHeight / 15,
    maxHeight: screenHeight / 10,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    left: "-11%",
    top: "75%",
    borderWidth: 0.5,
    borderColor: "grey",
    borderRadius: 25,
    fontSize: 22,
    backgroundColor: "lightgrey",
    color: "black",
  },
});

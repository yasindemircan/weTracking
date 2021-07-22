import React, { useState, useEffect, forwardRef, createRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { Map, RouteMarkers, WaypointMarker, Route } from "../components";
import { getuserDataFromLocalStorage, Response } from "../helpers/";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const timeConverter = (time) => {
  let date = new Date(time);
  const format = (number) => {
    if (number < 10) {
      return `0${number}`;
    }
    return number;
  };

  let fullDate = date.toISOString().split("T")[0];
  let hours = format(date.getUTCHours());
  let minutes = format(date.getMinutes());
  return `${fullDate} - ${hours}:${minutes}  `;
};

const History = () => {
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapRefs, setMapRefs] = useState([]);

  const fetchData = async () => {
    const { token } = await getuserDataFromLocalStorage();
    const urlParams = `token=${encodeURIComponent(token)}`;
    const responseData = await Response(
      "POST",
      "api/activity/history/",
      urlParams
    );
    setResponse(responseData.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    response &&
      setMapRefs((mapRef) =>
        Array(response.length)
          .fill()
          .map((_, i) => mapRef[i] || createRef())
      );
  }, [response]);

  const mapCenter = (ref, coord) => {
    setTimeout(() => {
      ref.current.fitToCoordinates(coord, {
        edgePadding: {
          right: screenWidth / 10,
          bottom: screenHeight / 20,
          left: screenWidth / 10,
          top: screenHeight / 20,
        },
      });
    }, 500);
  };

  const listCreator = (item, ref) => {
    const {
      startAddress: { latitude, longitude },
      finishAddress: { latitude: fnsLat, longitude: fnsLng },
      waypoints,
    } = item;
    mapCenter(ref, [
      { latitude, longitude },
      { latitude: fnsLat, longitude: fnsLng },
      ...waypoints,
    ]);
  };

  const Item = forwardRef(({ item }, ref) => (
    <View
      style={{
        borderRadius: 20,
        flex: 1,
        borderWidth: 1,
        borderColor: "grey",
        marginHorizontal: "4%",
        marginVertical: "5%",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          elevation: 1,
          borderRadius: 20,
          flex: 1,
          height: screenHeight / 2,
          overflow: "hidden",
        }}
      >
        <Map
          onLongPressFunc={false}
          CustomStyles={{ height: screenHeight / 2, position: "relative" }}
          mapRef={ref}
          liteMode={true}
          setIsLoading={setIsLoading}
        >
          <RouteMarkers
            address={item.startAddress}
            MarkerColor={"green"}
            pointName={"Baslangıc"}
          />

          <RouteMarkers address={item.finishAddress} pointName={"Bitis"} />

          {!isLoading && listCreator(item, ref)}

          {item.waypoints &&
            item.waypoints.map((waypoint, index) => (
              <WaypointMarker
                waypoint={waypoint}
                waypoints={item.waypoints}
                key={index}
                index={index}
                MarkerColor={"orange"}
                draggable={false}
              />
            ))}
        </Map>
      </View>

      <View style={{ paddingHorizontal: "10%", marginVertical: "1%" }}>
        <Text style={{ paddingHorizontal: "5%", marginTop: "2%" }}>
          {" "}
          Başlama Zamanı: {timeConverter(item.startTime)}{" "}
        </Text>
        <Text
          style={{
            paddingHorizontal: "5%",
            marginTop: "1%",
            textAlign: "left",
          }}
        >
          {" "}
          Bitirme Zamanı: {timeConverter(item.finishTime)}{" "}
        </Text>
      </View>
    </View>
  ));

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {!!response ? (
        <FlatList
          data={response}
          renderItem={({ item, index }) => {
            return <Item ref={mapRefs[index]} item={item} />;
          }}
          keyExtractor={(item, indx) => item._id}
        />
      ) : (
        <Text>Henüz Tamamlanan Aktiviten yok</Text>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default History;

import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt from "react-native-pure-jwt";
import Link from "../helpers/links";
const getuserDataFromLocalStorage = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem("@UserData_key");
        if (jsonValue !== null) {
            const jsonData = JSON.parse(jsonValue);
            const decodeData = await jwt.decode(
                jsonData.token, // the token
                Link.secretKey, // the secret
                { skipValidation: true }
            );
            return { ...jsonData, ...decodeData };
        }
        return { err: "localStorage null" };
    } catch (e) {
        console.log("e", e);
        return { token: e, payload: { publicId: e } };
    }
};
export default getuserDataFromLocalStorage;

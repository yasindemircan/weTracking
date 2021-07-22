import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Modal,
    TextInput,
    SafeAreaView,
} from "react-native";
import React, { useState } from "react";

import { useNavigation } from "@react-navigation/native";
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default function ModalComp(props) {
    const [inputText, setInputText] = useState(null);

    const navigation = useNavigation();
    const {
        TopContextText,
        placeholder,
        SetModalVisible,
        modalVisible,
        JoinButton,
        roomId,
    } = props;
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            presentationStyle="overFullScreen"
            statusBarTranslucent={false}
            onRequestClose={() => {
                SetModalVisible(!modalVisible);
            }}
        >
            <ScrollView style={{}}>
                <SafeAreaView style={styles.modalBlackScreen}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text
                                onPress={() => SetModalVisible(!modalVisible)}
                                style={styles.modalCloseButton}
                            >
                                X
                            </Text>
                        </View>
                        <View style={styles.modalContextContainer}>
                            <View style={styles.modalContextTop}>
                                <Text style={styles.modalContextTopText}>{TopContextText}</Text>
                            </View>
                            <View style={styles.modalContextMid}>
                                <TextInput
                                    style={styles.modalContextMidTextInput}
                                    maxLength={30}
                                    placeholder={`${placeholder}`}
                                    onChangeText={setInputText}
                                />
                            </View>
                            <View style={styles.modalContextBot}>
                                <TouchableOpacity
                                    onPress={() => {
                                        JoinButton(
                                            navigation,
                                            SetModalVisible,
                                            inputText,
                                            roomId,
                                            modalVisible
                                        );
                                    }}
                                    style={styles.modalContextBotButton}
                                >
                                    <Text style={styles.modalContextBotButtonText}>Join</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBlackScreen: {
        flex: 1,
        width: "100%",
        height: screenHeight,
        alignItems: "center",
        justifyContent: "center",
    },
    modalContainer: {
        width: "80%",
        height: "70%",
        maxHeight: 450,
        backgroundColor: "white",
        elevation: 20,
    },
    modalHeader: {
        width: "100%",
        height: "15%",
        elevation: 10,
        backgroundColor: "#6165D9",
        justifyContent: "center",
        paddingRight: "10%",
    },
    modalCloseButton: {
        fontSize: 25,
        color: "white",
        textAlign: "right",
        textAlignVertical: "center",
    },
    modalContextContainer: {
        width: "100%",
        height: "85%",
        borderWidth: 0,
        justifyContent: "center",
    },
    modalContextTop: {
        width: "100%",
        flex: 0.4,
        borderWidth: 0,
    },
    modalContextTopText: {
        textAlign: "center",
        color: "grey",
        fontSize: 20,
        margin: "10%",
    },
    modalContextMid: {
        width: "100%",
        flex: 0.2,
        borderWidth: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContextMidTextInput: {
        borderBottomWidth: 1,
        textAlign: "center",
        width: "90%",
    },
    modalContextBot: {
        width: "100%",
        flex: 0.4,
        borderWidth: 0,
        alignItems: "center",
    },
    modalContextBotButton: {
        width: "90%",
        height: "40%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#6165D9",
    },
    modalContextBotButtonText: {
        color: "white",
        fontSize: 18,
    },
});

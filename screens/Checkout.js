import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, SafeAreaView, LogBox, Image, FlatList, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import { Row, Col, Container, Content } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { openDatabase } from 'react-native-sqlite-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDispatch, useSelector } from 'react-redux';
import { del_all_menu } from "./stores/actions";

LogBox.ignoreAllLogs(true)

export default function Checkout(props) {
    var db = openDatabase({ name: 'ProductDatabase.db' });

    const navigation = useNavigation();
    // const navigation = props.navigation

    const dispatch = useDispatch();
    const dataReducer = useSelector((state) => state.dataReducers);
    console.log("IN STORE dataReducer -->", dataReducer)
    const { menus } = dataReducer;
    console.log("menus", menus)

    const [Total_amount, setTotal_amount] = useState(0);






    useEffect(() => {
        calc_product_price()
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            calc_product_price()
            return () => {

            };
        }, [])
    );




    async function calc_product_price() {
        var amount = 0;
        menus.map((val, key) => {
            amount = amount + (val.itemSelcted * val.itemAmount);
        })
        setTotal_amount(amount)
    };

    async function buy_product() {


        menus.map((val, key) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'UPDATE cart set menu_qty=? where menu_id=?',
                    [val.itemQty - val.itemSelcted, val.itemId],
                    (tx, results) => {
                        console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            Alert.alert('Record Updated Successfully...')
                        } else Alert.alert('Error');
                    }
                );
            });
        })



        await AsyncStorage.removeItem('menus')
            .then(() => {
                dispatch(del_all_menu())
            })
            .then(() => {
                navigation.navigate("Menu_list")
            })

    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Container style={styles.MainContainer}>
                <Row style={{ height: 80, width: "100%" }}>
                    <Col style={styles.header_side}>
                        <Ionicons onPress={() => { navigation.navigate("Cart") }} name="arrow-back" size={30} />
                    </Col>
                    <Col style={styles.header_center}>
                        <Text>Checkout</Text>
                    </Col>
                    <Col style={styles.header_side}>


                    </Col>
                </Row>

                <Content>
                    {
                        menus.length > 0 ?
                            <View>
                                <View style={{ borderBottomColor: "#a3a3a3", borderBottomWidth: 0.3, paddingBottom: 10 }}>
                                    <FlatList
                                        data={menus}
                                        renderItem={({ item }) => {

                                            const checkUsername = obj => obj.itemId === item.menu_id;

                                            console.log("menus.some(checkUsername)", menus.some(checkUsername))
                                            return (
                                                <View style={styles.list_outerview}>
                                                    <View style={styles.list_leftview}>
                                                        <Text >{item.itemName}</Text>
                                                    </View>
                                                    <View style={styles.list_right_view}>
                                                        <Text >{item.itemAmount}(price) X {item.itemSelcted}(qty) = ${item.itemAmount * item.itemSelcted}</Text>
                                                    </View>


                                                </View>
                                            )
                                        }
                                        }
                                    />
                                </View>
                                <View style={{ alignItems: "flex-end" }}>
                                    <Text>Total amount: ${Total_amount}</Text>
                                </View>
                                <View style={{ width: "100%", }}>
                                    <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", height: 40, width: 100, borderRadius: 10, backgroundColor: "#a3a3a3" }}
                                        onPress={() => { buy_product() }}
                                    >
                                        <Text>buy product</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>


                            :
                            <Text>No data</Text>
                    }

                </Content>
            </Container>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    MainContainer:
    {
        // flex: 1,
        // alignItems: 'center',
        paddingLeft: 20, paddingRight: 20,
        // justifyContent: 'center',

    },
    bottomview: {
        width: '100%',
        height: 50,
        paddingLeft: 30,
        paddingRight: 30,
        position: 'absolute',

        bottom: 0,
    },
    logoimg: {
        width: 300,
        height: 300,
        // marginBottom: 30,
        resizeMode: "contain"
        // borderWidth:2,
        // borderColor:'red'
    },

    img_icon: {
        height: 40, width: 80, resizeMode: "contain"
    },
    img_icon_checked: {
        height: 30, width: 80, resizeMode: "contain"
    },

    header_side: {
        width: "15%", justifyContent: "center"
    },

    header_center: {
        width: "70%", justifyContent: "center"
    },

    list_outerview: {
        marginTop: 10, flexDirection: "row",
    },

    list_leftview: {
        width: "50%", marginBottom: 5
    },

    list_right_view: {
        width: "50%", justifyContent: "center", alignItems: "flex-end",
    },
    blade_view: {
        position: 'absolute',
        backgroundColor: 'red',
        width: 18,
        height: 18,
        borderRadius: 18 / 2,
        right: 10,
        top: -6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    blade_txt: {
        alignItems: 'center',
        justifyContent: 'center',
        color: "#FFFFFF",
        fontSize: 10,
    }
});

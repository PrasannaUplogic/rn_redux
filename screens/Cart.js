import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, SafeAreaView, LogBox, Pressable, Image, FlatList, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import { Row, Col, Container, Content } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { openDatabase } from 'react-native-sqlite-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UIStepper from 'react-native-ui-stepper';
import { useDispatch, useSelector } from 'react-redux';
import { update_menu, get_addMenu, del_menu, add_menu } from "./stores/actions";


LogBox.ignoreAllLogs(true)

export default function Cart(props) {
    var db = openDatabase({ name: 'ProductDatabase.db' });

    const navigation = useNavigation();
    // const navigation = props.navigation

    const dispatch = useDispatch();
    const dataReducer = useSelector((state) => state.dataReducers);
    console.log("IN STORE dataReducer -->", dataReducer)
    const { menus } = dataReducer;
    var items_arr = menus
    console.log("menus", menus)


    const [menu_list, setMenu_list] = useState([]);


    const Add_cart_icon = require('../assets/img/add_cart.png')
    const Added_to_cart = require('../assets/img/selected.png')

    // const navigation = props.navigation

    useEffect(() => {
        get_menulist()


    }, []);

    useFocusEffect(
        React.useCallback(() => {
            get_menulist()
            return () => {

            };
        }, [])
    );



    async function get_menulist() {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM cart',
                [],
                (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        console.log("results.rows.item(i)", results.rows.item(i))
                        temp.push(results.rows.item(i));
                    }
                    setMenu_list(temp);

                    if (results.rows.length >= 1) {
                        setEmpty(false);
                    } else {
                        setEmpty(true)
                    }

                }
            );

        });

        AsyncStorage.getItem('menus', (err, menus) => {
            console.log("Get menus from async", menus)
            if (err) {
                alert(err.message);
            }
            else if (menus !== "null" && menus !== null) {
                dispatch(get_addMenu(JSON.parse(menus)));
            }
        });

    };

    async function on_inc_dec(data, index, itemId) {

        if (data != 0) {
            items_arr[index].itemSelcted = data
            console.log("items_arr", data, items_arr)

            dispatch(update_menu(items_arr[index]));

            AsyncStorage.getItem('menus', (err, menus) => {
                console.log("async menu", menus)
                if (err) alert(err.message)
                else {
                    AsyncStorage.setItem('menus', JSON.stringify(items_arr), () => {
                        console.log("async updated")
                    });
                }
            })
        } else {
            dispatch(del_menu(itemId));

            AsyncStorage.getItem('menus', (err, menus) => {
                console.log("async menu", menus)
                if (err) alert(err.message)
                else {
                    menus = JSON.parse(menus)
                    menus.map((val, key) => {
                        if (val.itemId == itemId) {
                            menus.splice(key, 1)
                        }
                    })
                    AsyncStorage.setItem('menus', JSON.stringify(menus), () => {
                        console.log("async updated")
                    });
                }
            })
        }

    }

    const on_change = () => {

    }


    const on_max_reached = (index) => {
        var product_name = '"' + items_arr[index].itemName + '"'
        alert("Maximum Qty of " + product_name + " is " + items_arr[index].itemQty)
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Container style={styles.MainContainer}>
                <Row style={{ height: 80, width: "100%" }}>
                    <Col style={styles.header_side}>
                        <Ionicons onPress={() => { navigation.openDrawer() }} name="menu" size={30} />
                    </Col>
                    <Col style={styles.header_center}>
                        <Text>Cart</Text>
                    </Col>
                    <Col style={styles.header_side}>
                        {/* <Ionicons name="add-circle" size={30} /> */}
                    </Col>
                </Row>

                <Content>
                    {
                        menus.length > 0 ?
                            <FlatList
                                data={menus}
                                renderItem={({ item, index }) =>
                                    <View style={styles.list_outerview}>
                                        <View style={styles.list_leftview}>
                                            <Text >Product Name: {item.itemName}</Text>
                                            <Text >Product price: ${item.itemAmount}</Text>
                                            <Text >Product avail: {item.itemQty}</Text>


                                        </View>
                                        <View style={styles.list_right_view}>

                                            <UIStepper displayValue
                                                height={40}
                                                width={100}
                                                value={item.itemSelcted}
                                                initialValue={item.itemSelcted}
                                                minimumValue={0}
                                                maximumValue={item.itemQty}
                                                fontSize={14}
                                                borderColor={"#999"}
                                                textColor={"#000"}
                                                overrideTintColor
                                                tintColor={"#a3a3a3"}
                                                borderRadius={3}
                                                // fontFamily={colors.font_family}
                                                onValueChange={(text) => { on_change(item) }}
                                                onIncrement={(text) => { on_inc_dec(text, index, item.itemId) }}
                                                onDecrement={(text) => { on_inc_dec(text, index, item.itemId) }}
                                                onMaximumReached={(text) => { on_max_reached(index) }}
                                            />

                                        </View>


                                    </View>
                                }

                            />
                            :
                            <Text>No data</Text>
                    }

                    {
                        menus.length > 0 &&
                        <View style={{ width: "100%", marginTop:20 }}>
                            <TouchableOpacity style={styles.checkout_btn}
                                onPress={() => { navigation.navigate("Checkout") }}
                            >
                                <Text>checkout</Text>
                            </TouchableOpacity>

                        </View>
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

    header_side: {
        width: "10%", justifyContent: "center"
    },

    header_center: {
        width: "80%", justifyContent: "center"
    },

    list_outerview: {
        marginTop: 10, flexDirection: "row", borderBottomWidth: 0.3, borderBottomColor: "#a3a3a3"
    },

    list_leftview: {
        width: "50%", marginBottom: 5
    },

    list_right_view: {
        width: "50%", justifyContent: "center", alignItems: "flex-end",
    },
    checkout_btn: {
        alignItems: "center", justifyContent: "center", height: 40, width: 100, borderRadius: 10, backgroundColor: "#a3a3a3"
    }
});

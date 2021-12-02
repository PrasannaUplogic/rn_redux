import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, SafeAreaView, LogBox, Image, FlatList, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import { Row, Col, Container, Content } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { openDatabase } from 'react-native-sqlite-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDispatch, useSelector } from 'react-redux';
import { get_addQuotes, get_addMenu, del_menu, add_menu } from "./stores/actions";

LogBox.ignoreAllLogs(true)

export default function Menu_list(props) {
    var db = openDatabase({ name: 'ProductDatabase.db' });

    const navigation = useNavigation();
    // const navigation = props.navigation

    const dispatch = useDispatch();
    const dataReducer = useSelector((state) => state.dataReducers);
    console.log("IN STORE dataReducer -->", dataReducer)
    const { menus } = dataReducer;
    console.log("menus", menus)

    const [menu_list, setMenu_list] = useState([]);

    const Add_cart_icon = require('../assets/img/add_cart.png')
    const Added_to_cart = require('../assets/img/selected.png')
    const edit_menu = require('../assets/img/edit.png')





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
        await AsyncStorage.getItem('menus', (err, menus) => {
            console.log("Get menus from async", menus)
            if (err) {
                alert(err.message);
            }
            else if (menus !== "null" && menus !== null) {
                dispatch(get_addMenu(JSON.parse(menus)));
            }
        });

    };

    async function add_cart(item) {


        var details_obj = {
            "itemAmount": item.menu_amount,
            "itemId": item.menu_id,
            "itemName": item.menu_name,
            "itemQty": item.menu_qty,
            "itemStock": item.menu_stock,
            "itemSelcted": 1
        }

        // console.log("details_obj", details_obj)

        var menu_arr = []
        AsyncStorage.getItem('menus', (err, menus) => {
            console.log("async menu", menus)
            if (err) alert(err.message)

            else if (menus !== "null" && menus !== null) {
                menus = JSON.parse(menus)
                console.log("available menus", menus)
                console.log("details_obj------", details_obj)
                menus.unshift(details_obj)

                AsyncStorage.setItem('menus', JSON.stringify(menus), () => {
                    dispatch(add_menu(details_obj));
                });
            } else {
                menu_arr.push(details_obj)
                console.log("menu_arr", menu_arr)
                AsyncStorage.setItem('menus', JSON.stringify(menu_arr), () => {
                    dispatch(add_menu(details_obj));
                });
            }
        })
    }

    async function remove_item(itemId) {
        console.log("remove_item")
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


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Container style={styles.MainContainer}>
                <Row style={{ height: 80, width: "100%" }}>
                    <Col style={styles.header_side}>
                        <Ionicons onPress={() => { navigation.openDrawer() }} name="menu" size={30} />
                    </Col>
                    <Col style={styles.header_center}>
                        <Text>Menu List page</Text>
                    </Col>
                    <Col style={styles.header_side}>
                        <TouchableOpacity style={{ flexDirection: "column" }} onPress={() => { navigation.navigate("Cart") }}>
                            <View style={styles.blade_view}>
                                <Text style={styles.blade_txt}>{menus.length}</Text>
                            </View>
                            <Ionicons name="cart-outline" size={30} />
                        </TouchableOpacity>

                    </Col>
                </Row>

                <Content>
                    {
                        menu_list.length > 0 ?
                            <FlatList
                                data={menu_list}
                                renderItem={({ item }) => {

                                    const checkUsername = obj => obj.itemId === item.menu_id;

                                    console.log("menus.some(checkUsername)", menus.some(checkUsername))
                                    return (
                                        <View style={styles.list_outerview}>
                                            <View style={styles.list_leftview}>
                                                <Text >{item.menu_name}</Text>
                                                <Text >${item.menu_amount}</Text>
                                                <Text >Availabe qty: {item.menu_qty}</Text>

                                            </View>
                                            <View style={styles.list_right_view}>
                                                <TouchableOpacity onPress={() => { navigation.navigate("Menu_edit", { item }) }}>
                                                    <Image source={edit_menu} style={styles.img_icon_checked} />
                                                </TouchableOpacity>

                                                {
                                                    menus.some(checkUsername) == true ?
                                                        <TouchableOpacity onPress={() => { remove_item(item.menu_id) }}>
                                                            <Image source={Added_to_cart} style={styles.img_icon_checked} />
                                                        </TouchableOpacity>
                                                        :
                                                        <TouchableOpacity onPress={() => { add_cart(item) }}>
                                                            <Image source={Add_cart_icon} style={styles.img_icon} />
                                                        </TouchableOpacity>
                                                }

                                            </View>


                                        </View>
                                    )
                                }



                                }
                            // keyExtractor={item => item.id}

                            />
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
        marginTop: 10, flexDirection: "row", borderBottomWidth: 0.3, borderBottomColor: "#a3a3a3"
    },

    list_leftview: {
        width: "50%", marginBottom: 5
    },

    list_right_view: {
        width: "50%", justifyContent: "center", alignItems: "flex-end", flexDirection: "row"
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

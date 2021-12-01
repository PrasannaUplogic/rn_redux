import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, SafeAreaView, LogBox, Image, FlatList, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import { Row, Col, Container, Content } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { openDatabase } from 'react-native-sqlite-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UIStepper from 'react-native-ui-stepper';
import { useDispatch, useSelector } from 'react-redux';
import { get_addQuotes, get_addMenu, deleteQuote, add_menu } from "./stores/actions";

LogBox.ignoreAllLogs(true)

export default function Cart(props) {
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
                                renderItem={({ item }) =>
                                    <View style={styles.list_outerview}>
                                        <View style={styles.list_leftview}>
                                            <Text >{item.itemName}</Text>
                                            <Text >${item.itemAmount}</Text>
                                            

                                        </View>
                                        <View style={styles.list_right_view}>

                                            <TouchableOpacity onPress={() => { add_cart(item) }}>
                                                <Image source={Add_cart_icon} style={styles.img_icon} />
                                            </TouchableOpacity>
                                            {/* <Image source={Added_to_cart} style={styles.img_icon} /> */}

                                        </View>


                                    </View>
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
    }
});

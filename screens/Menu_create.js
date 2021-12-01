import React, { useState, useEffect } from 'react';
import { Platform, Alert, StyleSheet, SafeAreaView, LogBox, Pressable, Text, Image, View, StatusBar, TextInput } from 'react-native';
import { Container, Row, Col, Content } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { openDatabase } from 'react-native-sqlite-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
LogBox.ignoreAllLogs(true)

export default function Menu_create({ navigation }) {
    var db = openDatabase({ name: 'ProductDatabase.db' });

    const [menu_name, setMenu_name] = useState("");
    const [menu_qty, setMenu_qty] = useState(0);
    const [menu_amount, setMenu_amount] = useState(0);

    useEffect(() => {
        // db.transaction(function (txn) {
        //     txn.executeSql(
        //         "SELECT name FROM sqlite_master WHERE type='table' AND name='cart_table'",
        //         [],
        //         function (tx, res) {
        //             console.log('item:', res.rows.length);
        //             if (res.rows.length == 0) {
        //                 txn.executeSql('DROP TABLE IF EXISTS cart_table', []);
        //                 txn.executeSql(
        //                     'CREATE TABLE IF NOT EXISTS cart_table(menu_id INTEGER PRIMARY KEY AUTOINCREMENT, menu_name VARCHAR(30), menu_qty INT(15))',
        //                     []
        //                 );
        //             }
        //         }
        //     );
        // })
        Reset_values();
        db.transaction(function (txn) {

            
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='cart'",
                [],
                function (tx, res) {
                    console.log('items:', res.rows.length);
                    console.log('data:', res.rows);
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS cart', []);
                        tx.executeSql('CREATE TABLE IF NOT EXISTS cart(menu_id INTEGER PRIMARY KEY AUTOINCREMENT, menu_name VARCHAR(30), menu_qty INT(15), menu_amount INT(15) )', []);
                    }
                }
            );
        })

     



        // db.transaction(function (tx) {
        //     console.log("db")
        //     tx.executeSql('CREATE TABLE IF NOT EXISTS cart(menu_id INTEGER PRIMARY KEY AUTOINCREMENT, menu_name VARCHAR(30), menu_qty INT(15))', []);
        //     tx.executeSql("SELECT * FROM cart", [], async function (txn, results) {
        //         console.log("results", results)
        //     })
        // })


    }, []);

    useFocusEffect(
        React.useCallback(() => {
            Reset_values();
            return () => {

            };
        }, [])
    );

    async function Reset_values() {
        setMenu_name("");
        setMenu_qty(0);
        setMenu_amount(0);
    }

    React.useEffect(() => {
        // console.log("hi")
        // // navigation.navigate('Register')
        // const timer = setTimeout(() => {

        //     if (progress < 0.9) {
        //         setProgress(progress + 0.2);
        //     }
        //     else {
        //         retrieveData();
        //     }

        // }, 1000);
        // return () => {
        //     clearTimeout(timer);
        // };
    }, []);


    async function saveMenudata() {
        if (menu_name == '' || menu_qty == 0 || menu_amount == 0) {
            Alert.alert('Please Enter All the Values');
        } else {

            db.transaction(function (tx) {
                tx.executeSql(
                    'INSERT INTO cart (menu_name, menu_qty, menu_amount) VALUES (?,?,?)',
                    [menu_name, menu_qty, menu_amount],
                    (tx, results) => {
                        console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            Alert.alert('Data Inserted Successfully....');
                        } else Alert.alert('Failed....');
                    }
                );
            });

        }

    };




    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Container style={styles.MainContainer}>
                <Row style={{ height: 80, width: "100%" }}>
                    <Col style={{ width: "10%", justifyContent: "center" }}>
                        <Ionicons onPress={() => { navigation.openDrawer() }} name="menu" size={30} />
                    </Col>
                    <Col style={{ width: "80%", justifyContent: "center" }}>
                        <Text>Menu Create</Text>
                    </Col>
                    <Col style={{ width: "10%", justifyContent: "center" }}>
                        {/* <Ionicons name="add-circle" size={30} /> */}
                    </Col>
                </Row>

                <Content style={{ width: "100%" }}>
                    <View style={{ width: "100%", }}>
                        <TextInput

                            placeholder={"Menu name"}

                            onChangeText={text => setMenu_name(text)}
                            value={menu_name}
                            style={{ padding: 10 }}
                        />
                    </View>



                    <View style={{ width: "100%", }}>
                        <TextInput

                            placeholder={"Menu Quantity"}
                            onChangeText={text => setMenu_qty(text)}
                            value={menu_qty}
                            style={{ padding: 10 }}
                        />
                    </View>
                    <View style={{ width: "100%", }}>
                        <TextInput

                            placeholder={"Menu Amount"}
                            onChangeText={text => setMenu_amount(text)}
                            value={menu_amount}
                            style={{ padding: 10 }}
                        />
                    </View>


                    <View style={{ width: "100%", }}>
                        <Pressable style={{ alignItems: "center", justifyContent: "center", height: 40, width: 100, borderRadius: 10, backgroundColor: "#a3a3a3" }}
                            onPress={() => { saveMenudata() }}
                        >
                            <Text>save</Text>
                        </Pressable>

                    </View>



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
        // justifyContent: 'center',
        paddingLeft: 20, paddingRight: 20

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
    }
});

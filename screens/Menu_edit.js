import React, { useState, useEffect } from 'react';
import { Platform, Alert, StyleSheet, SafeAreaView, LogBox, Pressable, Text, Image, View, StatusBar, TextInput, Touchable, TouchableOpacity } from 'react-native';
import { Container, Row, Col, Content } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { openDatabase } from 'react-native-sqlite-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
LogBox.ignoreAllLogs(true)

export default function Menu_create(props) {
    console.log("props -->", props)
    var db = openDatabase({ name: 'ProductDatabase.db' });
    const navigation = useNavigation();
    var menu_detail = props.route.params.item

    const [menu_id, setMenu_id] = useState(0);
    const [menu_name, setMenu_name] = useState("");
    const [menu_qty, setMenu_qty] = useState(0);
    const [menu_amount, setMenu_amount] = useState(0);

    useEffect(() => {

        setData()

    }, []);

    useEffect(() => {
        setData()
    }, [menu_detail]);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                setData()
            };
        }, [])
    );

    async function setData() {
        setMenu_id(menu_detail.menu_id); console.log("menu_id --> ", menu_id)
        setMenu_name(menu_detail.menu_name); console.log("menu_name --> ", menu_name)
        setMenu_qty(menu_detail.menu_qty); console.log("menu_qty --> ", menu_qty)
        setMenu_amount(menu_detail.menu_amount); console.log("menu_amount --> ", menu_amount)
    }

    async function updateMenudata() {
        if (menu_name == '' || menu_qty == 0 || menu_amount == 0) {
            alert('Please Enter All the Values');
        } else {

            db.transaction((tx) => {
                tx.executeSql(
                    'UPDATE cart set menu_name=?, menu_qty=?, menu_amount=? where menu_id=?',
                    [menu_name, menu_qty, menu_amount, menu_id],
                    (tx, results) => {
                        console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            Alert.alert('Record Updated Successfully...')
                        } else Alert.alert('Error');
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
                        <Ionicons onPress={() => { navigation.navigate("Menu_list") }} name="arrow-back" size={30} />
                    </Col>
                    <Col style={{ width: "80%", justifyContent: "center" }}>
                        <Text>Menu Edit</Text>
                    </Col>
                    <Col style={{ width: "10%", justifyContent: "center" }}>
                        {/* <Ionicons name="add-circle" size={30} /> */}
                    </Col>
                </Row>

                <Content style={{ width: "100%" }}>
                    <View style={{ width: "100%", }}>

                        <Text style={{ padding: 10 }}>Menu ID: {menu_id}</Text>
                        <Text style={{ padding: 10 }}>menu_name: {menu_name}</Text>
                        <Text style={{ padding: 10 }}>menu_qty: {menu_qty}</Text>
                        <Text style={{ padding: 10 }}>menu_amount: {menu_amount}</Text>

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
                        <TouchableOpacity style={{ alignItems: "center", justifyContent: "center", height: 40, width: 100, borderRadius: 10, backgroundColor: "#a3a3a3" }}
                            onPress={() => { updateMenudata() }}
                        >
                            <Text>update</Text>
                        </TouchableOpacity>

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

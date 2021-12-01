import React, { Component } from 'react';
import { StyleSheet, Text, Image, Alert, StatusBar, ActivityIndicator, LogBox, Switch, FlatList, View, TouchableHighlight, Dimensions, Platform, Modal, TouchableWithoutFeedback } from 'react-native';
import { Container, Content, Row, Col, Button, Left, Right, Footer, Header, Thumbnail } from 'native-base';

const screenheight = Dimensions.get("window").height
const screenwidth = Dimensions.get("screen").width
export default class LeftSideBar extends React.Component {


  close = async (route) => {
    this.props.navigation.navigate(route, { from: 'Dashboard' });
    this.props.navigation.closeDrawer()
  }




  componentDidMount = async () => {

    await this.retrieveData()

  }




  retrieveData = async () => {

  };


  render() {
    return (
      <Container style={styles.outerview}>

        <Content style={styles.content_view} showsVerticalScrollIndicator={false}>


        </Content>



        {/* <TouchableHighlight style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute', width: '100%',
          height: 40,
          bottom: 0,
        }} onPress={() => this._logOut()}>

          <Col style={{
            width: '100%',
            height: 40,

            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.theme_fg_two,
          }}>
            <Text style={{
              fontSize: 14,
              fontFamily: Constants.font_regular,
              color: Colors.black
            }}>{strings.logout}</Text>
          </Col>

        </TouchableHighlight> */}




      </Container>
    );
  }
}
const styles = StyleSheet.create({
  outerview: {
    flex: 1,
    backgroundColor: "#d3dbc5"
  },
  content_view: {
    marginLeft: "8%",
    marginRight: "8%"
  }

})

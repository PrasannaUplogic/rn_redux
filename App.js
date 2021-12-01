/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { Component } from 'react';
import { createDrawerNavigator, } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Menu_list from './screens/Menu_list';
import Menu_create from './screens/Menu_create';
import store from './screens/stores/store';
import { Provider } from 'react-redux';
import Cart from './screens/Cart';
// import { Dimensions, Image } from 'react-native'
// import { createAppContainer } from 'react-navigation';
// import { createStackNavigator } from 'react-navigation-stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import SideMenu from './screens/SideMenu';
// import SideMenuList from './screens/SideMenuList';


const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Menu_list" screenOptions={{
          headerShown: false,
          drawerStyle: {backgroundColor:"#f0efe1"}
        }}>
          <Drawer.Screen name="Menu list" component={Menu_list} />
          <Drawer.Screen name="Menu create" component={Menu_create} />
          <Drawer.Screen name="Cart" component={Cart} />
          {/* <Drawer.Screen name="SideMenu" component={SideMenu} />
        <Drawer.Screen name="SideMenuList" component={SideMenuList} /> */}
        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

// const AppNavigator = createStackNavigator({

//   Menu_list: { screen: Menu_list },
//   Menu_create: { screen: Menu_create },

//   SideMenu: {
//     screen: SideMenu,
//     navigationOptions: {
//       gesturesEnabled: false,
//     },
//   },
//   SideMenuList: {
//     screen: SideMenuList,
//     navigationOptions: {
//       gesturesEnabled: false,
//     },
//   },

// },
//   {
//     headerMode: 'none',
//     initialRouteName: 'Menu_list',
//   });

// export default createAppContainer(AppNavigator);

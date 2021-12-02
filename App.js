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
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';

import Menu_list from './screens/Menu_list';
import Menu_create from './screens/Menu_create';
import store from './screens/stores/store';
import Cart from './screens/Cart';
import Checkout from './screens/Checkout';

import Menu_edit from './screens/Menu_edit';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


const Home = () => {
  return (
    <Drawer.Navigator initialRouteName="Menu_list" screenOptions={{
      headerShown: false,
      drawerStyle: { backgroundColor: "#f0efe1" }
    }}>
      <Drawer.Screen
        name="Menu_list"
        options={{
          drawerLabel: 'Menu_list',
          activeTintColor: '#e91e63',
        }}
        component={Menu_list}
      />
      <Drawer.Screen
        name="Menu_create"
        options={{
          drawerLabel: 'Menu_create',
          activeTintColor: '#e91e63',
        }}
        component={Menu_create}
      />
      <Drawer.Screen
        name="Cart"
        options={{
          drawerLabel: 'Cart',
          activeTintColor: '#e91e63',
        }}
        component={Cart}
      />

    </Drawer.Navigator>
  );
};


const App = () => {
  return (
    <Provider store={store}>

      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false
        }} >
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Checkout" component={Checkout} />
          <Stack.Screen name="Menu_edit" component={Menu_edit} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;

// export default function App() {
//   return (
//     <Provider store={store}>
//       <NavigationContainer>
//         <Drawer.Navigator initialRouteName="Menu_list" screenOptions={{
//           headerShown: false,
//           drawerStyle: {backgroundColor:"#f0efe1"}
//         }}>
//           <Drawer.Screen name="Menu list" component={Menu_list} />
//           <Drawer.Screen name="Menu create" component={Menu_create} />
//           <Drawer.Screen name="Cart" component={Cart} />
//           {/* <Drawer.Screen name="Checkout" component={Checkout} /> */}
//           {/* <Drawer.Screen name="SideMenu" component={SideMenu} />
//         <Drawer.Screen name="SideMenuList" component={SideMenuList} /> */}
//         </Drawer.Navigator>
//       </NavigationContainer>
//     </Provider>
//   );
// }


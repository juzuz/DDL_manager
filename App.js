
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import type {Node} from 'react';
import moment from 'moment'


import TodayScreen from './src/screens/TodayScreen.js';
import TemplateScreen from './src/screens/TempalteScreen.js';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { create } from 'eslint/lib/rules/*';

const Drawer = createDrawerNavigator();



const App: () => Node = () => {
  

  return (
    <NavigationContainer>
      {MyDrawer()}
    </NavigationContainer>
  );
};

function MyDrawer() {
  let today = moment().format('YYYY-MM-DD')
  return (
    <Drawer.Navigator>
      <Drawer.Screen name ="Today" initialParams = {{'today':today}} component={TodayScreen}/>
      <Drawer.Screen name ="Template" component={TemplateScreen} />
    </Drawer.Navigator>
  )
}

export default App;

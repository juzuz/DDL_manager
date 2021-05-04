
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import type {Node} from 'react';
import moment from 'moment'

import {createStackNavigator} from '@react-navigation/stack';
import TodayScreen from './src/screens/TodayScreen';
import TaskScreen from './src/screens/TaskScreen';
import NewTaskScreen from './src/screens/NewTaskScreen';
import TemplateScreen from './src/screens/TempalteScreen.js';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { create } from 'eslint/lib/rules/*';

const Drawer = createDrawerNavigator();
const HomeStack = createStackNavigator();

// Stack Navigator's navigate like a stack, you go in a layer one at a time, and pop out one at a time.
// This stack is for the Today screen which has a add Task button that navigates to a task creation screen.
function Stack(){
    return(
        <HomeStack.Navigator 
        animation='fade'
        screenOptions={{
        }}
        >
            {/* Stack Navigation puts a header by default, we do not need it. */}
            <HomeStack.Screen name="Today" component={TodayScreen} options={{headerShown: false}}/>
            <HomeStack.Screen name='Task' component={TaskScreen} 
            options={{
              headerTintColor:'#E5E5F3',
              headerStyle: {
                
                shadowColor: 'transparent',
                backgroundColor:'#1e212a',
              },
              headerTitleStyle:{
                color:'#E5E5F3',
                fontSize:24,
              },
            }}/>
            <HomeStack.Screen name='NewTask' component={NewTaskScreen} 
            
            options={{
              headerTitle:"New Task", 
              headerTintColor:'#E5E5F3',
              headerStyle: {
                height:100,
                shadowColor: 'transparent',
                backgroundColor:'#495867',
                
              },
              headerTitleAlign:'center',
              headerTitleStyle:{
                bottom:0,
                color:'#E5E5F3',
                fontSize:24,
              },
            }}/>
        </HomeStack.Navigator>
    );
}



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
      <Drawer.Screen name="Home" component={Stack}/>
      {/* <Drawer.Screen name ="Today" initialParams = {{'today':today}} component={TodayScreen}/> */}
      <Drawer.Screen name ="Template" component={TemplateScreen} />
    </Drawer.Navigator>
  )
}

export default App;

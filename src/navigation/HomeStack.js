import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TodayScreen from '../screens/TodayScreen';
import TaskScreen from '../screens/TaskScreen';
import NewTaskScreen from '../screens/NewTaskScreen';
import Loader from '../components/Loader';

const Stack = createStackNavigator();

export default function HomeStack(props) {

   

    return (
     
        <Stack.Navigator 
        animation='fade'
        screenOptions={{
        }}
        >
            {/* Stack Navigation puts a header by default, we do not need it. */}
            <Stack.Screen name="Today" 
            component={TodayScreen} 
            options={{headerShown: false}}
            initialParams = {{user:props.route.params.user}}
            />
            <Stack.Screen name='Task' component={TaskScreen} 
            initialParams = {{user:props.route.params.user}}
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
            <Stack.Screen name='NewTask' component={NewTaskScreen} 
            
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
        </Stack.Navigator>
    )
}



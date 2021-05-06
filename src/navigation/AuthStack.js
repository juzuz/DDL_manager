import React from 'react'
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TemplateScreen from '../screens/TemplateScreen';

const Stack = createStackNavigator();


export default function AuthStack() {
    return (
        <Stack.Navigator 
        animation='fade'
        screenOptions={{
        }}
        >
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
            <Stack.Screen name='Register' component={RegisterScreen} 
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
          
        </Stack.Navigator>
    )
}



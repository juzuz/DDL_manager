import React, {useState, useContext, useEffect} from 'react';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import {NavigationContainer} from '@react-navigation/native';
import {AuthContext} from './AuthProvider';
import auth from '@react-native-firebase/auth';




export default function Routes() {

    const {user,setUser} = useContext(AuthContext);
    const [initializing, setInitializing] = useState(true);

    const onAuthStateChanged = (user) => {
        setUser(user);
        if(initializing) setInitializing(false);
    }

    useEffect(()=>{
       const subscriber = auth().onAuthStateChanged(onAuthStateChanged) 
    },[])

    if (initializing) return null; 
    
    return (
        <NavigationContainer>
            {user ? <AppStack user={user.uid}/> : <AuthStack />}
        </NavigationContainer>
    )
}

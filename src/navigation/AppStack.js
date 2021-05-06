import React, { useContext, useEffect, useState} from 'react'
import HomeStack from './HomeStack';
import TemplateScreen from '../screens/TemplateScreen';
import firestore from '@react-native-firebase/firestore'
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList} from '@react-navigation/drawer';
import { AuthContext } from './AuthProvider';

const Drawer = createDrawerNavigator();


export default function AppStack(props) {

    const {logout} = useContext(AuthContext);

    const [userTasks, setUserTasks] = useState({});

    function onResult(snapshot){
        console.log(snapshot)
    }

    function onError(error){
        console.log(error)
    }

    const getDoc = async () =>{
        // const doc =  await firestore().collection(props.user).onSnapshot(onResult,onError)
        
    }

    useEffect(()=>{
       getDoc()
    },[])

    return (
    <Drawer.Navigator drawerContent={props => {
        return (
            <DrawerContentScrollView>
            <DrawerItemList {...props}/>
            <DrawerItem label = 'Logout' onPress={()=> logout()}/>
            </DrawerContentScrollView>
        );
    }}>
        <Drawer.Screen name="Home" component={HomeStack} initialParams={{user: props.user}} />
        <Drawer.Screen name ="Template" component={TemplateScreen} />
    </Drawer.Navigator>
    )
}

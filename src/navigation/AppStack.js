import React, { useContext, useEffect, useState} from 'react'
import HomeStack from './HomeStack';
// import TemplateScreen from '../screens/TemplateScreen';
import StatScreen from '../screens/StatScreen';
import firestore from '@react-native-firebase/firestore'
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList} from '@react-navigation/drawer';
import { AuthContext } from './AuthProvider';
import { database } from 'faker';

const Drawer = createDrawerNavigator();


export default function AppStack(props) {

    const {logout} = useContext(AuthContext);
    const [tasks,setTasks] = useState(null)
    const [stats,setStats] = useState(null)

    useEffect(() => {
        let statRef = firestore().collection('stats').doc(props.user);
        statRef.get().then(doc=>{
            if (!doc.exits){
                statRef.set({
                    completeHistory:1,
                    completedTask:0,
                    incompletedTask:0,
                    reward:0
                })
            }
        })
    }, [])

    return (
        <>
      
    <Drawer.Navigator drawerContent={props => {
        return (
            <DrawerContentScrollView>
            <DrawerItemList {...props}/>
            <DrawerItem label = 'Logout' onPress={()=> logout()}/>
            </DrawerContentScrollView>
        );
    }}>
        <Drawer.Screen name="Home" component={HomeStack} initialParams={{user: props.user}} />
        <Drawer.Screen name='Stats' component={StatScreen} initialParams={{user:props.user, stats:stats}} />
    </Drawer.Navigator>


    </>
    )
}

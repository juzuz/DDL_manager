import React, { useContext, useEffect, useState} from 'react'
import HomeStack from './HomeStack';
import TemplateScreen from '../screens/TemplateScreen';
import StatScreen from '../screens/StatScreen';
import firestore from '@react-native-firebase/firestore'
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList} from '@react-navigation/drawer';
import { AuthContext } from './AuthProvider';
import { database } from 'faker';

const Drawer = createDrawerNavigator();


export default function AppStack(props) {

    const {logout} = useContext(AuthContext);
    const [stats,setStats] = useState(null)

    const getUserStats = (user) => {
        return firestore().collection('stats').doc(user);
    }
 
    useEffect(() => {
        const docRef = getUserStats(props.user)
        let exists = false;
        docRef.onSnapshot((snapshot)=> {
            if(snapshot.exists){
                const statDoc = ({
                    ...snapshot.data(),
                })
                setStats(statDoc);
                exists = true;
            }
        })
        if(!exists){
            docRef.set({
                user:props.user,
                completeHistory:1,
                numTask:0,
                reward:0
            })
        }
    }, [])
   
  
    return (
        <>
        {stats?
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
        <Drawer.Screen name ="Template" component={TemplateScreen} />
    </Drawer.Navigator>
    :
    null
}
    </>
    )
}

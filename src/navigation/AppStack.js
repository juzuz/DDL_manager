import React, { useContext, useEffect, useState} from 'react'
import HomeStack from './HomeStack';
// import TemplateScreen from '../screens/TemplateScreen';
import StatScreen from '../screens/StatScreen';
import ShopScreen from '../screens/ShopScreen';
import firestore from '@react-native-firebase/firestore'
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList} from '@react-navigation/drawer';
import { AuthContext } from './AuthProvider';
import moment from 'moment';
const Drawer = createDrawerNavigator();


export default function AppStack(props) {

    const {logout} = useContext(AuthContext);
    const [trackingDate, setTrackingDate] = useState();

    useEffect(() => {
        let statRef = firestore().collection('stats').doc(props.user);
        statRef.get().then(doc=>{
            if (!doc.exists){
                statRef.set({
                    completeHistory:1,
                    completedTask:0,
                    incompletedTask:0,
                    reward:0,
                    trackingDate:firestore.Timestamp.fromDate(moment().toDate())
                })
            }
            else{
                setTrackingDate(doc.data().trackingDate)
            }
        })
    }, [])

    return (
        <>
      {trackingDate?
    <Drawer.Navigator drawerContent={props => {
        return (
            <DrawerContentScrollView>
            <DrawerItemList {...props}/>
            <DrawerItem label = 'Logout' onPress={()=> logout()}/>
            </DrawerContentScrollView>
        );
    }}>
        <Drawer.Screen name="Task Manager" component={HomeStack} initialParams={{user: props.user}} />
        <Drawer.Screen name='Your Stats' component={StatScreen} initialParams={{user:props.user, trackingDate:trackingDate}} />
	<Drawer.Screen name='Shop' component={ShopScreen} initialParams={{user:props.user}} />
    </Drawer.Navigator>
    :null
    }
    </>
    )
}

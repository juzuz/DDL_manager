import React, { useContext } from 'react'
import HomeStack from './HomeStack';
import TemplateScreen from '../screens/TemplateScreen';

import {createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList} from '@react-navigation/drawer';
import { AuthContext } from './AuthProvider';

const Drawer = createDrawerNavigator();


export default function AppStack() {

    const {logout} = useContext(AuthContext);
    return (
    <Drawer.Navigator drawerContent={props => {
        return (
            <DrawerContentScrollView>
            <DrawerItemList {...props}/>
            <DrawerItem label = 'Logout' onPress={()=> logout()}/>
            </DrawerContentScrollView>
        );
    }}>
        <Drawer.Screen name="Home" component={HomeStack}/>
        <Drawer.Screen name ="Template" component={TemplateScreen} />
    </Drawer.Navigator>
    )
}

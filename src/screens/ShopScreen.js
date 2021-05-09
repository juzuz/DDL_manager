import React,{useEffect, useState} from 'react';
import {Text,View,StyleSheet, Dimensions,StatusBar, FlatList} from 'react-native';
import {Icon,Button,Container,Header,Content,Left,Title,Body} from 'native-base';
import {DrawerActions} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function ShopScreen(props) {

    const [stats,setStats] = useState({});
    const getUserStats = (user) => {
        return firestore().collection('stats').doc(user);
    }


    useEffect(() => {
        if(props.route.params.user){

        const docRef = getUserStats(props.route.params.user);
        let exists = false;
        docRef.onSnapshot((snapshot)=> {
            if(snapshot){
                const statDoc = ({
                    ...snapshot.data(),
                })
                setStats(statDoc);
                exists = true;
            }
        })
    }
    }, [])

    return (
        <>
        
        <StatusBar hidden={true}></StatusBar>
        {stats?
        <Container style={styles.container}>
            <Header style={styles.header}>
                <Left>
                    <Button transparent  onPress = {() => props.navigation.dispatch(DrawerActions.openDrawer())}>
                    <Icon name='menu' 
                    />
                    </Button>
                </Left>
                <Body>
                    <Title style ={styles.title}>{props.route.name}</Title>
                </Body>
            </Header>
            <Content contentContainerStyle={{
               
            }}>

            <View style={styles.statContainer}>
            <View>
                <Text>Reward</Text>
            </View>
            <FlatList
                data={[
                {key: 'dummy shop product 1'},
                {key: 'dummy shop product 2'},
                {key: 'dummy shop product 3'},
                {key: 'dummy shop product 4'},
                {key: 'dummy shop product 5'},
                {key: 'dummy shop product 6'},
                {key: 'dummy shop product 7'},
                {key: 'dummy shop product 8'},
                {key: 'dummy shop product 9'},
                {key: 'dummy shop product 10'},
                ]}
                renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
            />
                   </View>

            
            </Content>
        </Container>
        :
        null}
        </>
    )
}

// 1e212a
const styles = StyleSheet.create({
    container:{
        backgroundColor:'#1e212a'
    },
    title:{
        
        fontSize:24,
        fontWeight:'normal'
    },
    header: {
        backgroundColor: "#1e212a"
    },
    statContainer:{
       backgroundColor: "#495867",
       flex:1,
       flexDirection:'column'
    },
    statistic:{
        flex:1
    },
    statBox:{
        flex:1,
        backgroundColor:'#BDD5EA',
        height:windowHeight*0.2,
        borderRadius:5,
        margin:10,
        justifyContent:'center',
        alignItems:'center'
    },
    statName:{
        fontSize:18,
        fontWeight:'bold',
        marginBottom:10,
        borderBottomWidth:1,
        color:'#577399'
    },
    data:{
        fontSize:16,
        color: 'black',
        fontWeight:'bold'
    },
    item: {
    	padding: 10,
    	fontSize: 18,
    	height: 44,
    }


})

import React,{useEffect, useState} from 'react';
import {Text,View,StyleSheet, Dimensions,StatusBar} from 'react-native';
import {Icon,Button,Container,Header,Content,Left,Title,Body} from 'native-base';
import {DrawerActions} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function StatScreen(props) {

    const [stats,setStats] = useState({});
  
    useEffect(() => {
        setStats(props.route.params.stats)
        console.log(props.route.params)
    }, [props.route.params.stats])
  

    return (
        <>
        <StatusBar hidden={true}></StatusBar>
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
                flex:1,
               
            }}>
                <View style={styles.statContainer}>
                    <View style ={styles.statBox}>
                        <Text style={styles.statName}>Total Tasks</Text>
                        <Text style = {styles.data}>{stats.numTask}</Text>
                    </View>
                    <View style ={styles.statBox}>
                        <Text style={styles.statName}>Completion Score</Text>
                        <Text style = {styles.data}>
                            {(stats.completeHistory * 100).toString().substring(0,3)} %
                        </Text>
                    </View>
                </View>
                <View style ={styles.statistic}>

                </View>
            
            </Content>
        </Container>
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
       flexDirection:'row'
    },
    statistic:{
        flex:1
    },
    statBox:{
        flex:1,
        backgroundColor:'#BDD5EA',
        height:windowHeight*0.15,
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
    }


})

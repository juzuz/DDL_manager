import React from 'react';
import {TextInput,View,StyleSheet, SafeAreaView,StatusBar, Dimensions} from 'react-native';
import {Icon,Button,Container,Header,Content,Input,Title,Item} from 'native-base';
import {DrawerActions} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function NewTaskScreen(props) {
    return (
        <>
        <StatusBar hidden={true}></StatusBar>
        <Container style={styles.container}>
          
            <Content contentContainerStyle={{
                
                // justifyContent:'center'
            }}>
            <Container style={styles.card}>
        
                <Item>
                    <Input underlineColorAndroid="transparent" placeholderTextColor='white'  style={styles.input} placeholder='Name your task'/>
                </Item>
            </Container>
            </Content>
        </Container>
        </>
    )
}

// 1e212a
const styles = StyleSheet.create({
    container:{
        backgroundColor:'#1e212a',
        alignItems:'center'
    },
    header: {
        backgroundColor: "#1e212a"
    },
    input:{
        backgroundColor:"#495867",
        marginTop:10,
        borderTopLeftRadius:25,
        borderTopRightRadius:25,
        height:60,
        color:'white',
        textAlign:'center',
        fontWeight:'bold',
        fontSize:20,
        
    },

   
    buttonContent:{
     flex:1,
     flexDirection:'row'
    },
   
    buttonText:{
        fontSize:21,
        fontWeight:'bold',
        color: '#E5E5F3',
    },
    card:{
        backgroundColor:'#1e212a',
        width:windowWidth*0.94,
        marginTop:20,
        alignItems:'center'
    },
    title:{
        
        fontSize:24,
        fontWeight:'normal'
    },
    bodyText:{
        color:'white',
        fontSize:24,
        fontWeight:'normal'
    }
})

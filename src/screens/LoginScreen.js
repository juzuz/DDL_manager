import React, { useContext, useState, useEffect} from 'react';
import {Text,View,StyleSheet,StatusBar, Dimensions, Alert} from 'react-native';
import {Icon,Button,Container,Content,Form,Item,Input, Title} from 'native-base';
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function LoginScreen(props) {

    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const {login} = useContext(AuthContext)

    const emailHandler = (val) => {
        setEmail(val)
    }

    const passwordHandler = (val) => {
        setPassword(val)
    }

    const loginHandler = (event) => {
	var isValid = false;
	if (email === ""){
		Alert.alert('Alert', 'Email address must not be empty');	
	}
	else if (password === ""){
		Alert.alert('Alert', 'Password must not be empty');
	}
	//validate email
	else {	
		firebase.auth().fetchSignInMethodsForEmail(email).then(function(user) {
		}).catch(function(error) {
    			var errorCode = error.code;
    			var errorMessage = error.message;

    			if (errorCode === 'auth/invalid-email') {
        			alert('Invalid email.');
    			} else {
        			alert(errorMessage);         
    			}
    			console.log(error);
		});
		isValid = true;
	}
        event.preventDefault();

        //validate email and password match
        if (isValid){
		firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
   		// user signed in
		}).catch(function(error) {
    			var errorCode = error.code;
    			var errorMessage = error.message;

    			if (errorCode === 'auth/wrong-password') {
        			alert('Wrong password.');
    			} else {
        			alert(errorMessage);         
    			}
    			console.log(error);
		});
	}	    
    }

    const registerHandler = () => {
        props.navigation.navigate("Register")
    }

    return (
        <>
        <StatusBar hidden={true}></StatusBar>
        <Container style={styles.container}>
            
            <Content contentContainerStyle={{
                margin:20,
                justifyContent:'center'
            }}>
                <Form style ={styles.form}>
                    <Title style ={{alignSelf:'center'}}>
                        DDL MANAGER
                    </Title>
                    <Item style={{marginLeft:0, borderBottomWidth:0}}> 
                        <Input 
                            placeholder="Email" 
                            style={styles.input} 
                            onChangeText={emailHandler}
                            />
                    </Item>
                    <Item style={{marginLeft:0,borderBottomWidth:0}}> 
                        <Input 
                            placeholder="Password" 
                            style={styles.input} 
                            onChangeText={passwordHandler}
                            secureTextEntry={true}
                            />
                    </Item>
                    <Item style={{marginLeft:0,borderBottomWidth:0}}>
                        <Button rounded info 
                        style ={styles.button}
                        onPress={loginHandler}
                        >
                            <Text style ={styles.text}>Login</Text>
                        </Button>
                    </Item>
                    <Item style={{marginLeft:0,borderBottomWidth:0}}>
                        <Button rounded warning 
                        style ={styles.button}
                        onPress={registerHandler}
                        >
                            <Text style ={styles.text}>Register</Text>
                        </Button>
                    </Item>
                </Form>
            </Content>
        </Container>
        </>
    )
}

// 1e212a
const styles = StyleSheet.create({
    container:{
        backgroundColor:'#1e212a',
    },
    form:{
        marginTop:windowHeight*0.3,
        backgroundColor:'#1e212a'
    },
    input:{
        backgroundColor:"#e5e5f3",
        marginTop:10,
        borderRadius:5,
        height:60,
        color:'black',
        textAlign:'center',
        fontSize:20,
    }, 
    button:{
        flex:1,
        marginTop:10,
    },
    text: {
        fontSize:18,
        fontWeight:'bold',
        color:'#E5E5F3'
    }
})

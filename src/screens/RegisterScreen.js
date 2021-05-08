import React, { useContext, useState } from 'react';
import {Text,View,StyleSheet,StatusBar, Dimensions, Alert} from 'react-native';
import {Icon,Button,Container,Content,Form,Item,Input, Title} from 'native-base';
import { AuthContext } from '../navigation/AuthProvider';
import firebase from '@react-native-firebase/app'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function RegisterScreen(props) {

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confPass, setConfPass] = useState("")
    
    const {register} = useContext(AuthContext)

    const emailHandler = (val) =>{
        setEmail(val)
    }

    const passwordHandler = (val) =>{
        setPassword(val)
    }

    const passwordConfHandler = (val) =>{
        setConfPass(val)
    }

    const registerHandler = () =>{
	var isValid = false;

	if (email === ""){
		Alert.alert('Alert', 'Email address must not be empty');	
	}
	else if (password === ""){
		Alert.alert('Alert', 'Password must not be empty');
	}

	else if (confPass === "") {
		Alert.alert('Alert', 'Confirm password must not be empty');
	}

	else if (confPass !== password) {
		Alert.alert('Alert', 'Confirm password and password must be the same');
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
	if (isValid){
		firebase.auth().createUserWithEmailAndPassword(email,password).then(function(user) {
		}).catch(function(error) {
    			var errorCode = error.code;
    			var errorMessage = error.message;

    			if (errorCode === 'auth/weak-password') {
        			alert('Password should be at least 6 characters.');
    			} else if (errorCode === 'auth/email-already-in-use') {
        			alert("The email address is already in use by another account.");         
    			}
			else {
        			alert(errorMessage);         
    			}
    			console.log(error);
		});;
	}
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
                    
                    <Item style={{marginLeft:0, borderBottomWidth:0}}> 
                        <Input 
                        placeholder="Type in your email" 
                        style={styles.input} 
                        onChangeText={emailHandler}/>
                    </Item>
                    <Item style={{marginLeft:0,borderBottomWidth:0}}> 
                        <Input 
                            placeholder="Enter your password" 
                            style={styles.input} 
                            onChangeText={passwordHandler}
                            secureTextEntry={true}/>
                    </Item>
                    <Item style={{marginLeft:0,borderBottomWidth:0}}> 
                        <Input 
                            placeholder="Confirm your password" 
                            style={styles.input} 
                            onChangeText={passwordConfHandler}
                            secureTextEntry={true}/>
                    </Item>
                   
                    <Item style={{marginLeft:0,borderBottomWidth:0}}>
                        <Button rounded warning 
                        style ={styles.button}
                        onPress={registerHandler}
                        >
                            <Text style ={styles.text} >Register</Text>
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
        marginTop:windowHeight*0.2,
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

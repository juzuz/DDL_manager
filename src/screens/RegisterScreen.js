import React, { useContext, useState } from 'react';
import {Text,View,StyleSheet,StatusBar, Dimensions,TextInput,TouchableOpacity} from 'react-native';
import {Icon,Button,Container,Content,Form,Item, } from 'native-base';
import { AuthContext } from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import * as Animatable from 'react-native-animatable'
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
        register(email,password);
        
    }
    
    return (
        <>
        <StatusBar hidden={true}></StatusBar>
        <Container style={styles.container}>
        <View style= {{alignItems:'center'}}>
            <Animatable.Image 
            animation="bounceIn"
            source={require('../assets/logo.png')} 
            style={{width:250,height:250}}
            resizeMode = 'stretch'
            />
            </View>
        <Content contentContainerStyle={{
                flex:1,
                marginTop:10
            }}>
                   <View style={styles.form}>
                       <View style={{height:50,marginTop:30,marginLeft:20,paddingRight:25}}>
                           <Text style={{fontSize:16,fontWeight:'bold',color:"#00e8dc"}}>Email</Text>
                           <View style={styles.action}>
                                <FontAwesome 
                                    name="user"
                                    color={'#00e8dc'}
                                    size={26}
                                />
                               <TextInput placeholder="Your Email"
                               placeholderTextColor={'white'}
                               style={styles.textInput}
                               onChangeText={emailHandler}
                               />
                           </View>
                       </View>

                       <View style={{height:50,marginTop:30,marginLeft:20,paddingRight:25}}>
                           <Text style={{fontSize:16,fontWeight:'bold',color:"#00e8dc"}}>Password</Text>
                           <View style={styles.action}>
                           <FontAwesome 
                                    name="lock"
                                    color={'#00e8dc'}
                                    size={30}
                                />
                               <TextInput placeholder="Your Password"
                                placeholderTextColor={'white'}

                               secureTextEntry={true}
                               style={styles.textInput}
                               onChangeText={passwordHandler}
                               />
                           </View>
                       </View>
                       <View style={{height:50,marginTop:30,marginLeft:20,paddingRight:25}}>
                           <Text style={{fontSize:16,fontWeight:'bold',color:"#00e8dc"}}>Confirm Password</Text>
                           <View style={styles.action}>
                           <FontAwesome 
                                    name="lock"
                                    color={'#00e8dc'}
                                    size={30}
                                />
                               <TextInput placeholder="Confirm Your Password"
                                placeholderTextColor={'white'}


                               secureTextEntry={true}
                               style={styles.textInput}
                               onChangeText={passwordConfHandler}
                               />
                           </View>
                       </View>
                   
                    <View style={{marginTop:40,marginLeft:20,marginRight:20}}>
                    

                    <TouchableOpacity
                    style={styles.signIn}
                    onPress={registerHandler}
                     >
                        <LinearGradient
                        colors={['#00e8dc', '#00b3a9']}
                        style={styles.signIn}
                        >
                            <Text style={[styles.textSign, {
                                color:'#fff'
                            }]}>Sign Up</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    </View>
                    
                  
                    </View>
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
        flex:1,
        flexDirection:'column',
        backgroundColor:'white',
        borderRadius:25,
        backgroundColor:'#33353d'
        // alignItems:'center'
    },
    input:{
        // backgroundColor:"#e5e5f3",
        marginTop:20,
        borderRadius:5,
        color:'black',
        textAlign:'left',
        fontSize:18,
        borderBottomWidth:1,
    }, 
    button:{
        flex:1,
        marginTop:10,
    },
    text: {
        fontSize:18,
        fontWeight:'bold',
        color:'#E5E5F3'
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: 'white',
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
})

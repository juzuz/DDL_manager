import React, { useState } from 'react';
import {Text,StyleSheet, SafeAreaView,StatusBar, Dimensions} from 'react-native';
import {Icon,Button,Container,Header,Content,Input,Title,Item} from 'native-base';
import {DrawerActions} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { TapGestureHandler } from 'react-native-gesture-handler';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function NewTaskScreen(props) {
    const [calendarVisable, setCalendarVisible] = useState(false);
    const [dateString, setDateString] = useState("Select your deadline date");
    const [taskName, setTaskName] = useState("");
    const [priority, setPriority] = useState(0);
    const [tag,setTag] = useState("");

    const dateHandler = (e,date) => {
        setCalendarVisible(false)
        setDateString(moment(date).format('YYYY-MM-DD'))
    }

    const taskNameHandler = (val) => {
        setTaskName(val);
    }

    const priorityHandler = (val) => {
        setPriority(parseInt(val))
    }

    const tagHandler = (val) => {
        setTag(val)
    }

    const submitHandler = () =>{
        let data = {
            task: taskName,
            priority: priority,
            ddl: dateString,
            tag: tag,
            type: props.route.params.type
        }
        console.log(data)
    }

    return (
        <>
        <StatusBar hidden={true}></StatusBar>
        <Container style={styles.container}>
            
            <Content contentContainerStyle={{
                
                // justifyContent:'center'
            }}>
            <Container style={styles.card}>
        
                <Item style={{borderBottomWidth:0}}>
                    <Input 
                        onChangeText ={(val) => taskNameHandler(val)} 
                        underlineColorAndroid="transparent" 
                        placeholderTextColor='white'  
                        style={styles.input} 
                        placeholder='Name your task'
                        />
                </Item>
                <Item style={{borderBottomWidth:0}}>
                    <Input 
                        onChangeText = {(val) => priorityHandler(val)}
                        underlineColorAndroid="transparent" 
                        placeholderTextColor='white'  
                        style={styles.input} 
                        placeholder='Type Priority (0-10)'
                        />
                </Item>
                <Item style={{borderBottomWidth:0}}>
                    <Input 
                    onChangeText ={(val) => tagHandler(val)}
                    underlineColorAndroid="transparent" 
                    placeholderTextColor='white'  
                    style={styles.input} 
                    placeholder='Type Tag'
                    />
                </Item>
                <Item style={{borderBottomWidth:0,marginTop:10}}>
                    <Text style={styles.buttonText} onPress={() => setCalendarVisible(true)}>{dateString}</Text>
                </Item>
                
                <Item style={{borderBottomWidth:0,marginTop:10}}>
                    <Button
                        onPress={submitHandler}
                    >
                        <Icon name ='checkmark'/>
                   </Button>
                </Item>
                {
                    calendarVisable && (
                        <DateTimePicker
                        value={new Date()}
                        mode='date'
                        onChange={dateHandler}
                        minimumDate={new Date()}
                        />
                    )
                }
            </Container>
            </Content>

        </Container>
        
    </>
    )
}


const styles = StyleSheet.create({
    container:{
        backgroundColor:'#1e212a',
        alignItems:'center'
    },
    input:{
        backgroundColor:"#495867",
        marginTop:10,
        borderRadius:5,
        // borderTopLeftRadius:25,
        // borderTopRightRadius:25,
        height:60,
        color:'white',
        textAlign:'center',
        fontWeight:'bold',
        fontSize:20,
    }, 
    buttonText:{
        fontSize:21,
        fontWeight:'bold',
        color: '#E5E5F3',
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
})

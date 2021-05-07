import React, { useState } from 'react';
import {Text,View, StyleSheet, SafeAreaView, StatusBar, Dimensions, Alert} from 'react-native';
import {Icon,Button,Container,Header,Content,Input,Item} from 'native-base';

import {DrawerActions} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment-timezone';
import firestore from '@react-native-firebase/firestore';
import NotifService from '../components/notifications/NotifService';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

//function to calculate importanceScore
function score(data){
	//placeholders
	var completeHistory = 0;
	var historyTime = 0;

	if (data.type == 'daily'){
		return 0.02 * data.priority + 0.4 * (1-completeHistory) + 0.4 * historyTime;
	}

	else {
		return 0.025 * data.priority + 0.25 * (1-completeHistory) + 0.5 * historyTime;
		
	}
}

//function to setup notifications
function reminder(notif, importanceScore, data){
	let hour = parseInt(moment().format('HH'));
        let min = parseInt(moment().format('mm'));
        let date = moment().startOf('day').add(hour,'h').add(min,'minute');
	var currTime = moment(date).toDate()
	currTime = firestore.Timestamp.fromDate(currTime)
	console.log(currTime);
	var remainTime = data.ddl - currTime;
	var count = Math.ceil(importanceScore * 10);
	
	//if the ddl is already passed, remind in 5 minutes for once
	if (remainTime <= 0) {
		timeSlice = 300;
		count = 1;
	}
	
	else {
		var timeSlice = remainTime / count;
	}

	//schedule count no. of notif evenly
	for (var i = 1; i <= count; i++){
		notif.scheduleNotif('sample.mp3', timeSlice * i, data);
	}
	
	console.log("timeSlice = " + timeSlice);
}

export default function NewTaskScreen(props) {
    const [registerToken, setRegisterToken] = useState(null);
    const [fcmRegistered, setFcmRegistered] = useState(false);
	
    const onRegister = (token) => {
    	setRegisterToken(token.token);
	setFcmRegistered(true)
    }

    const onNotif = (notif) => {
    	Alert.alert(notif.title, notif.message);
    }

    var notif = new NotifService(onRegister, onNotif);

    const [calendarVisable, setCalendarVisible] = useState(false);
    const [date,setDate] = useState("");
    const [dateString, setDateString] = useState("Select your deadline");
    const [taskName, setTaskName] = useState("");
    const [priority, setPriority] = useState(0);
    const [tag,setTag] = useState("");
    const [mode,setMode] = useState("date");

    const dateHandler = (event,val) => {
        if (mode === 'date') {
            setCalendarVisible(false);
            setDate(moment(val).startOf('day'))
            setDateString(moment(val).format('MMM, DD, YYYY'))
        }
        else{
            setCalendarVisible(false);
            let hour = parseInt(moment(val).format('HH'));
            let min = parseInt(moment(val).format('mm'));
            let newDate = moment(date).startOf('day').add(hour,'h').add(min,'minute');
            setDate(newDate);
            setDateString(newDate.format("MMM, DD, YYYY h:mm a"))
        }
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

    const showDatePicker = () => {
        showMode('date');
    }

    const showTimePicker = () => {
        showMode('time')
    }

    const showMode= (currentMode) => {
        setCalendarVisible(true);
        setMode(currentMode);
    }

    const submitHandler = async() =>{
        let valid = false;
        if (taskName === ""){
            Alert.alert('Alert', 'Task name must not be empty');
        }
    
        else if (!(priority < 11 && priority > 0)){
            Alert.alert('Alert', 'Priority must be within the range of [1,10]');
        }
    
        else if (tag === ""){
            Alert.alert('Alert', 'Tag must not be empty');
        }
    
        else if (dateString === "Select your deadline"){
            Alert.alert('Alert', 'Please choose a date');
        }
        else{
            valid = true;
        }

        if (valid){
            let user = props.route.params.user;
            let dateTime = moment(date).toDate()
            let data = {
                task: taskName,
                priority: priority,
                ddl: firestore.Timestamp.fromDate(dateTime),
                tag: tag,
                type: props.route.params.type,
		startTime: firestore.Timestamp.fromDate(moment().toDate())
            }
    	    
	    
	    var importantScore = score(data)
	    data.importantScore = importantScore;
	    reminder(notif, importantScore, data)

            const res = await firestore().collection(user).doc().set(data)
            props.navigation.popToTop();
        }
    }

    return (
        <>
        <StatusBar hidden={true}></StatusBar>
        <Container style={styles.container}>
            
            <Content contentContainerStyle={{
                
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
              
                <Item style={{borderBottomWidth:0, marginTop:10}}>
                    <View style = {{flex:1, flexDirection:'row'}}>
                        <View style = {{backgroundColor:'#495867', justifyContent:'center'}}>
                            <Text style={{marginRight:10, marginLeft:10, color:'white',fontSize:18,fontWeight:'bold'}}>{dateString}</Text>
                        </View>
                        <Button style ={{marginLeft:10 }} onPress ={showDatePicker}>
                            <Icon name ='calendar' />
                        </Button>
                        <Button style ={{marginLeft:10 }}onPress ={showTimePicker}>
                            <Icon name='time'/>
                        </Button>
                    </View>
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
                        mode={mode}
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

import React, { useState } from 'react';
import {Text,View, StyleSheet, SafeAreaView, StatusBar, Dimensions, Alert } from 'react-native';
import {Icon,Button,Container,Header,Content,Input,Item} from 'native-base';
import {Picker} from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
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
	
	//if the ddl is already passed or is within less than 30 minutes, remind in 5 minutes only for once
	if (remainTime <= 1800) {
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

    const priorityDisplay =() =>{
        if(priority <3)
            return "I can miss it a few times"
        else if (priority <5)
            return "I can see my mama nagging"
        else if(priority ==5)
            return "I can see myself doing this"
        else if(priority < 8)
            return "I need to get somewhat serious"
        else if(priority < 10)
            return "Mama! SOS Alert"
        else
            return "MAYDAY! MAYDAY!"
    }

    const taskNameHandler = (val) => {
	      setTaskName(val); 
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
        let taskType = props.route.params.type;
        if (taskName === ""){
            Alert.alert('Alert', 'Task name must not be empty');
        }
    
        else if (!(priority < 11 && priority > 0)){
            Alert.alert('Alert', 'Priority must be within the range of [1,10]');
        }
    
        else if (tag === ""){
            Alert.alert('Alert', 'Tag must not be empty');
        }
    
        else if (taskType === 'general' && dateString === "Select your deadline"){
            Alert.alert('Alert', 'Please choose a date');
        }
        else{
            valid = true;
        }

        if (valid){
            let user = props.route.params.user;
            let data = {}
            if(taskType === 'daily'){
                data = {
                    task: taskName,
                    priority: priority,
                    ddl: firestore.Timestamp.fromDate(moment().toDate()),
                    tag: tag,
                    type: taskType,
                    startTime: firestore.Timestamp.fromDate(moment().toDate()),
                    complete: false
                }
            }
            else{
                let dateTime = moment(date).toDate()
                data = {
                    task: taskName,
                    priority: priority,
                    ddl: firestore.Timestamp.fromDate(dateTime),
                    tag: tag,
                    type: taskType,
                    startTime: firestore.Timestamp.fromDate(moment().toDate()),
                    complete: false,
                    //used to ensure only marking incompleted task once 
                    markAsIncompleted: false
                }
            }
    	 
            var importantScore = score(data)
            data.importantScore = importantScore;
            var reward = taskType === 'daily' ? Math.floor(10*importantScore): 0;
            reward = reward > 30 ? 30:reward;
            data.reward = reward;
            
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
                <View style ={{width:windowWidth*0.94, borderWidth:1,borderColor:'#232733',borderTopRightRadius:20,borderBottomLeftRadius:20,backgroundColor:'#232733'}}>
                <View style={{ padding:20}}>

                <Item style={{borderBottomWidth:0}}>
                    <Text style = {{color:"white",fontSize:26,flex:1,textAlign:'center',fontWeight:'bold'}}>New Habit</Text>
                </Item>
                <Item style={{borderBottomWidth:0}}>
                    <Input 
                        onChangeText ={(val) => taskNameHandler(val)} 
                        underlineColorAndroid="transparent" 
                        placeholderTextColor='black'  
                        style={styles.input} 
                        placeholder='Name your task'
                        />
                </Item>
                <Item style={{borderBottomWidth:0}}>
                    <View style={{flex:1,flexDirection:'column',marginTop:20}}>
                    <Text style={{paddingLeft:10,color:'white',fontSize:16}}>Priority: {priorityDisplay()} </Text>
                    <Slider 
                     style={{marginTop:20,marginBottom:10}}
                     minimumValue={1}
                     maximumValue={10}
                     onValueChange={(value)=>setPriority(value)}
                     minimumTrackTintColor="orange"
                    maximumTrackTintColor="white"
                     step ={1}
                    />
                    </View>
                 
                </Item>
		        <Item>
                <Picker
                style={styles.picker}
                selectedValue={tag}
                enabled={true}
                mide={'dialog'}
                prompt={'Set Tag'}
                onValueChange={(itemValue, itemIndex) =>
                    setTag(itemValue)
                }>
                    <Picker.Item label="Health" value="Health" />
                    <Picker.Item label="Academic" value="Academic" />
                    <Picker.Item label="Workout" value="Workout" />
                    <Picker.Item label="Project" value="Project" />
                    <Picker.Item label="Work" value="Work" />
                    <Picker.Item label="Habit" value="Habit" />
                </Picker>
      		  
    		    </Item>

                {(props.route.params.type === 'daily') ? null:
                <Item style={{borderBottomWidth:0, marginTop:10}}>
                    <View style = {{flex:1, flexDirection:'row'}}>
                        <View style = {{backgroundColor:'#495867', justifyContent:'center'}}>
                            <Text style={{marginRight:10, marginLeft:10, color:'white',fontSize:18,fontWeight:'bold'}}>{dateString}</Text>
                        </View>
                        <Button style ={{marginLeft:10 ,backgroundColor:'orange'}} onPress ={showDatePicker}>
                            <Icon name ='calendar' />
                        </Button>
                        <Button style ={{marginLeft:10,backgroundColor:'orange' }}onPress ={showTimePicker}>
                            <Icon name='time'/>
                        </Button>
                    </View>
                </Item>
                }
                <Item style={{borderBottomWidth:0,marginTop:10}}>
                    <Button
                        onPress={submitHandler}
                        style={{flex:1,backgroundColor:'orange'}}
                    >
                    <Text style={{flex:1,textAlign:'center',color:'white',fontSize:18,fontWeight:'bold'}}>Create New Task</Text>
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
                </View>
                </View>
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
        backgroundColor:"white",
        marginTop:10,
        borderRadius:5,
        // borderTopLeftRadius:25,
        // borderTopRightRadius:25,
        height:60,
        color:'black',
        textAlign:'center',
        fontSize:16,
    }, 
    buttonText:{
        fontSize:20,
        fontWeight:'bold',
        color: 'black',
    },
  
    card:{
        backgroundColor:'#1e212a',
        width:windowWidth*0.94,
        marginTop:20,
        alignItems:'center'
    },
    item:{
	padding: 20,
    	marginVertical: 8,
    	marginHorizontal: 16,
    },
    title: {
    	fontSize: 32,
    },
    picker:{
        flex:1,
        color:"#E5E5F3"
    }
})

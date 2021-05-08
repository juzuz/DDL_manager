import React,{ useEffect, useState} from 'react';
import { Text, StyleSheet, StatusBar, View } from 'react-native';
import { Icon, Button, Container, Header, Content, Left, Title, Body } from 'native-base';
import { DrawerActions } from '@react-navigation/native';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import Calendar from '../components/calendar/Calendar';
import type Moment from 'moment';
import Events from '../components/events/Events';
import faker from 'faker';
import Loader from '../components/Loader'
import {MenuProvider} from 'react-native-popup-menu';

// export type EventType = {
//     date: Moment,
//     title: string,
//     description: string,
//     image: string,
//   };
export type EventType = {
    ddl: Moment,
    task: string,
    id: string,
    importanceScore: number,
    startTime: Moment,
    tag:string,
    type:string,
    complete: Boolean
  };


//   const filterEvents = (date: Moment): ?Array<EventType> =>
//   FAKE_EVENTS.filter(event => event.date.isSame(date, 'day'));


//function to check for incomplete tasks
//if the ddl is less than current time and not marked as completed, it is incomplete
function checkIncomplete(props) {
    const taskRef = firestore().collection(props.route.params.user).get().then((querySnapshot) => {
    	querySnapshot.forEach((doc) => { //for each task, check ddl
		let hour = parseInt(moment().format('HH'));
        	let min = parseInt(moment().format('mm'));
        	let date = moment().startOf('day').add(hour,'h').add(min,'minute');
		var currTime = moment(date).toDate()
		currTime = firestore.Timestamp.fromDate(currTime)
		//if the ddl is over and it's not completed
		// console.log(doc.data().ddl < currTime && !doc.data().complete && !doc.data().markAsIncompleted);
		if (doc.data().ddl < currTime && !doc.data().complete && !doc.data().markAsIncompleted){
			// console.log("enter if incomplete");
			firestore().collection(props.route.params.user).doc(doc.id).update({markAsIncompleted:true});
			
			const statRef = firestore().collection('stats').doc(props.route.params.user);
			statRef.get().then((doc) => {
				if (doc.exists) {
        				let inNo = doc.data().incompletedTask + 1;
					statRef.update({incompletedTask:inNo});
					// console.log("total incomplete tasks no. = " + inNo);
					// console.log(doc.id, " => ", doc.data().ddl);
    				}
			});
			
		}
    	});
    });;
}
 
export default function TodayScreen(props) {
    // console.log("Entered today screen");
    // checkIncomplete(props)

    const [displayGeneral,setDisplayGeneral] = useState([]);
    const [displayDaily,setDisplayDaily] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tasks,setTasks] = useState([]);
    const [selectedDate,setSelectedDate] = useState(moment());

    const filterGeneralEvents = (taskArray,date: Moment): ?Array<EventType> =>
    taskArray.filter(event => (moment(event.ddl).isSame(date, 'day') && event.type === 'general'));

    const filterDailyEvents = (taskArray,date: Moment): ?Array<EventType> =>
    taskArray.filter(event => (event.type === 'daily'));

    function onSelectDate (date: Moment)  {
        setSelectedDate(date);
        setDisplayGeneral(filterGeneralEvents(tasks,date));
        setDisplayDaily(filterDailyEvents(tasks,date));
      };

    const formatTasks = (tasks) => {
      
        return tasks.map(task => ({
            id: task.id,
            ddl: moment(task.ddl.toDate()),
            task: task.task,
            tag: task.tag,
            type: task.type,
            importanceScore: task.importantScore,
            startTime: moment(task.startTime.toDate()),
            complete: task.complete
          }));
    }

  

    const getTasks = async() => {
        const userRef = firestore().collection(props.route.params.user);
        userRef.onSnapshot((snapshot)=>{
            if(snapshot){
                let newTasks = snapshot.docs.map((doc)=>({
                    id:doc.id,
                    ...doc.data(),
                   
                }))

                // getMiniTasks(newTasks,userRef);
                
                // console.log(newTasks)
                setTasks(formatTasks(newTasks))
                setDisplayGeneral(filterGeneralEvents(formatTasks(newTasks),moment()))
                setDisplayDaily(filterDailyEvents(formatTasks(newTasks),moment()))
            }
        })
    }
  
    useEffect(() => {
        setTimeout(()=>{
            setLoading(false)
        },2000)
       
    }, [props.route.params.user])

    useEffect(()=>{
        setLoading(true);
        checkIncomplete(props)

        if(props.route.params.user){
            getTasks();
        }
    },[])

    const pressHandler = () => {
        props.navigation.navigate("Task");
    }
   
    return (
        <>
        {loading ? <Loader visible ={loading}/>: <>
        <MenuProvider>
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
            <Calendar onSelectDate={(date) =>onSelectDate(date)}/>

            <Container style = {{flex:1}}>
            <Container style={styles.generalEvents}>
                <Container style={styles.generalContainer}>
                    <Title style={styles.taskTitle}>General Tasks</Title>
                    <Content contentContainerStyle={{
                    }}>
                        <Events events={displayGeneral} user = {props.route.params.user} selectedDate={ selectedDate}/>
                    </Content>
                </Container>
            </Container>

            <Container style={styles.dailyEvents}>
                <Container style={styles.dailyContainer}>
                    <Title style={styles.taskTitle}>Daily Tasks</Title>
                    <Content>
                        <Events events={displayDaily} user = {props.route.params.user} selectedDate={selectedDate}/>
                    </Content>
                </Container>
            </Container>
            </Container>
            <Button large rounded info style={styles.taskButton} onPress={pressHandler} >
                        <Icon name='add'></Icon>
                    </Button>
        </Container>
        </MenuProvider>
        </>
    }
    </>
    )
}

// 1e212a
const styles = StyleSheet.create({
    container:{
        backgroundColor:'#1e212a',
    },
    generalContainer:{
        backgroundColor:'#BDD5EA',
        borderRadius:20,
        marginBottom:10
    },
    dailyContainer:{
        backgroundColor:'#FE5F55',
        borderRadius:20,
        marginBottom:10
    },
    generalEvents:{
        backgroundColor:'#1e212a',
    },
    dailyEvents:{
        backgroundColor:'#1e212a',
    },
    taskTitle:{
        textAlign:'center',
        fontSize:20,
        fontWeight:'bold'
    },
    header: {
        backgroundColor: "#1e212a"
    },
    taskButton:{
        position:'absolute',
        bottom:20,
        right:20,
        borderRadius:50,
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

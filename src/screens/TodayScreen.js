import React,{ useEffect, useState} from 'react';
import { Text, StyleSheet, StatusBar, View } from 'react-native';
import { Icon, Button, Container, Header, Content, Left, Title, Body } from 'native-base';
import { DrawerActions } from '@react-navigation/native';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import Calendar from '../components/calendar/Calendar';
import type Moment from 'moment';
import Events from '../components/events/Events';
import Loader from '../components/Loader'
import {MenuProvider} from 'react-native-popup-menu';
import { set } from 'react-native-reanimated';


export type EventType = {
    ddl: Moment,
    task: string,
    id: string,
    importanceScore: number,
    startTime: Moment,
    tag:string,
    type:string,
    complete: Boolean,
    minitask:Object
  };




//function to check for incomplete tasks
function checkIncomplete(props) {
    const taskRef = firestore().collection(props.route.params.user).get().then((querySnapshot) => {
    	querySnapshot.forEach((doc) => { //for each task, check ddl
		
		//for general tasks
		if (doc.data().type === 'general') {
			let hour = parseInt(moment().format('HH'));
        	let min = parseInt(moment().format('mm'));
			let date = moment().startOf('day').add(hour,'h').add(min,'minute');
			var currTime = moment(date).toDate()
			currTime = firestore.Timestamp.fromDate(currTime)
			if (doc.data().ddl < currTime && !doc.data().complete && !doc.data().markAsIncompleted){
				firestore().collection(props.route.params.user).doc(doc.id).update({markAsIncompleted:true});
			
				const statRef = firestore().collection('stats').doc(props.route.params.user);
				statRef.get().then((doc) => {
					if (doc.exists) {
						let comNo = doc.data().completedTask;
						let inNo = doc.data().incompletedTask + 1;
						let history = comNo / (comNo + inNo);
						statRef.update({incompletedTask:inNo, completeHistory:history});
    					}
				});
			
			}
		}
		//for daily tasks
		else {
			var ddl = doc.data().ddl.toDate();
			var d = String(ddl.getDate()).padStart(2, '0');
			var m = String(ddl.getMonth() + 1).padStart(2, '0');
			var y = ddl.getFullYear();

			var ddlDate = m + '/' + d + '/' + y;

			var today = new Date();
			var dd = String(today.getDate()).padStart(2, '0');
			var mm = String(today.getMonth() + 1).padStart(2, '0');
			var yyyy = today.getFullYear();

			var todayDate = mm + '/' + dd + '/' + yyyy;
			var newDdl = firestore.Timestamp.fromDate(moment().toDate());

			//if the ddl is not at the same day
			if (ddlDate !== todayDate){
				// To calculate the time difference of two dates
				var timeDiff = today.getTime() - ddl.getTime();
  
				// To calculate the no. of days between two dates
				var dayDiff = timeDiff / (1000 * 3600 * 24);
				//if the task is completed yesterday
				if (dayDiff == 1 && doc().data.complete) {
					firestore().collection(props.route.params.user).doc(doc.id).update({markAsIncompleted:false, complete:false, ddl:newDdl});
					dayDiff = 0;
				}

				else {
					firestore().collection(props.route.params.user).doc(doc.id).update({markAsIncompleted:false, complete:false, ddl:newDdl});
				}
				
				firestore().collection(props.route.params.user).doc(doc.id).update({markAsIncompleted:false, complete:false, ddl:newDdl});
					const statRef = firestore().collection('stats').doc(props.route.params.user);
						statRef.get().then((doc) => {
							if (doc.exists) {
								let comNo = doc.data().completedTask;
        						let inNo = doc.data().incompletedTask + dayDiff;
								let history = comNo / (comNo + inNo);
								statRef.update({incompletedTask:inNo, completeHistory:history});
    						}
					});
			}
		}
    	});
    });;
}
 
export default function TodayScreen(props) {

    const [displayGeneral,setDisplayGeneral] = useState([]);
    const [displayDaily,setDisplayDaily] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tasks,setTasks] = useState([]);
    const [selectedDate,setSelectedDate] = useState(moment());

    // const filterGeneralEvents = (taskArray,date: Moment): ?Array<EventType> => 
    // taskArray.filter(event => (moment(event.ddl).isSame(date, 'day') && event.type === 'general')).sort((a,b) => {
    //     return a.ddl.toDate().getTime() - b.ddl.toDate().getTime()
    // });


    const filterDailyEvents = (taskArray,date: Moment): ?Array<EventType> =>
    taskArray.filter(event => (event.type === 'daily'));

    function onSelectDate (date: Moment)  {
        setSelectedDate(date);
        // setDisplayGeneral(tasks);
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
            complete: task.complete,
            minitask: task.minitask
          }));
    }

  

    const getTasks = async() => {
        const userRef = firestore().collection(props.route.params.user).orderBy('ddl');
        userRef.onSnapshot((snapshot)=>{
            if(snapshot){
                let newTasks = snapshot.docs.map((doc)=>({
                    id:doc.id,
                    ...doc.data(),
                }))

                newTasks.forEach((task,index)=> {
                    if(task.type ==="general"){
                        const subRef = firestore().collection(props.route.params.user).doc(task.id).collection('subtasks');
                        subRef.onSnapshot((snap) => {
                            if(snap){
                                let minitask = snap.docs.map((doc1)=>({
                                    id: doc1.id,
                                    ...doc1.data()
                                }))
                                newTasks[index].minitask = minitask

                                setTasks(formatTasks(newTasks))
                                setDisplayGeneral((formatTasks(newTasks)))
                                setDisplayDaily(filterDailyEvents(formatTasks(newTasks),selectedDate))
                            }
                        })
                    }
                })


                
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
        {loading   ? <Loader visible ={loading}/>: <>
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
                    <View style = {styles.divider}/>
                    <Content contentContainerStyle={{
                    }}>
                        <Events events={displayGeneral} usage="general" user = {props.route.params.user} selectedDate={selectedDate}/>
                    </Content>
                </Container>
            </Container>

            <Container style={styles.dailyEvents}>
                <Container style={styles.dailyContainer}>
                    <Title style={styles.taskTitle}>Daily Tasks</Title>
                    <View style = {styles.divider}/>

                    <Content>
                        <Events events={displayDaily} usage="daily" user = {props.route.params.user} selectedDate={selectedDate}/>
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
        fontSize:22,
        fontWeight:'bold',
        borderBottomColor:'white',
        borderBottomWidth:2,
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
    },
 
})

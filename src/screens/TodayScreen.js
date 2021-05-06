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


// import Setting from './SettingScreen';


export type EventType = {
    date: Moment,
    title: string,
    description: string,
    image: string,
  };

  const FAKE_EVENTS: Array<EventType> = (() => {
    const startDay = moment().subtract(5, 'days').startOf('day');
    return [...new Array(64)].map(_ => ({
      date: startDay.add(4, 'hours').clone(),
      title: faker.company.companyName(),
      description: faker.lorem.sentence(),
      // use random dimensions to get random urls
      image: faker.image.nightlife(Math.floor(Math.random() * 200) + 100, Math.floor(Math.random() * 200) + 100),
    }));
  })();

  const filterEvents = (date: Moment): ?Array<EventType> =>
  FAKE_EVENTS.filter(event => event.date.isSame(date, 'day'));


 
export default function TodayScreen(props) {

    const [events,setEvents] = useState([]);
    
    const [tasks,setTasks] = useState([]);

    function onSelectDate (date: Moment)  {
         setEvents(filterEvents(date))
      };

    useEffect(()=>{
        setEvents(FAKE_EVENTS);
        // TODO 
        // Here are the new events to work on
        firestore().collection(props.route.params.user).onSnapshot((snapshot)=>{
            const newTasks = snapshot.docs.map((doc)=>({
                id:doc.id,
                ...doc.data()
            }))

            setTasks(newTasks)
        })

        console.log(tasks)
    },[])

    const pressHandler = () => {
        props.navigation.navigate("Task");
    }
   
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
            <Calendar onSelectDate={() =>onSelectDate()}/>
            <Container style={styles.eventCard}>
                <Container style={styles.eventContainer}>
                    <Content contentContainerStyle={{
                        flex:1,
                        margin:20
                    }}>
                <Events events={events} />
                   
                    </Content>
                </Container>
            </Container>
            <Button large rounded style={styles.taskButton} onPress={pressHandler} >
                        <Icon name='add'></Icon>
                    </Button>
        </Container>
        </>
    )
}

// 1e212a
const styles = StyleSheet.create({
    container:{
        backgroundColor:'#1e212a',
    },
    eventContainer:{
        backgroundColor:'#577399',
        marginBottom:200,
        borderRadius:25,
    },
    eventCard:{
        backgroundColor:'#1e212a',
        borderRadius:10
    },
    header: {
        backgroundColor: "#1e212a"
    },
    taskButton:{
        position:'absolute',
        bottom:20,
        right:20,
        borderRadius:50,
        backgroundColor:'#577399',
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

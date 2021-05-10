// @flow

import React, { Component } from 'react';
import Swipeable  from 'react-native-swipeable-row';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Flatlist,
  TouchableHighlight,
  LogBox
} from 'react-native';
import moment from "moment";
import {calcReward} from '../reward/reward';
import { Icon, ListItem } from 'native-base';
import Event from './Event';
import type { EventType } from '../../screens/TodayScreen';
import firestore from '@react-native-firebase/firestore';



export default class Events extends Component {

  props: {
    events: ?Array<EventType>,
  };

  state = {
    leftActionActivated:false,
    rightActionActivated:false,
    stats:{}
  }

  rightSwipeHandler = async(user,event) =>{
    const taskRef = firestore().collection(user).doc(event.id);
    const statRef = firestore().collection('stats').doc(user);

    let completionStatus = event.complete

    if (!completionStatus){
      let reward = 0;
      taskRef.get().then((doc)=>{
        if(doc.exists){ 
          reward = event.type==='daily'?doc.data().reward: Math.floor(calcReward(event));
          reward = reward > 30? 30:reward;
          let sH = this.state.stats;
          let totalComp = sH.completedTask+1;
	  //if it was marked as incomplete, update it
	  if (sH.markAsIncompleted){
		let totalInComp = sH.incompletedTask-1;
		statRef.update({incompletedTask:totalInComp})
	  }
          let cH =totalComp/(totalComp + sH.incompletedTask)
          taskRef.update({complete:!completionStatus,reward:reward, markAsIncompleted: false})
          statRef.update({completedTask:totalComp,reward:sH.reward + reward, completeHistory:cH})
        }
      })
    }
    else{
      let reward = -1;
      taskRef.get().then((doc)=>{
        if(doc.exists){ 
          reward =  doc.data().reward
          let sH = this.state.stats;
          let totalComp = sH.completedTask-1;
          let cH =1
          totalComp === 0 ? ch =1: ch = totalComp/(totalComp + sH.incompletedTask);
         

          statRef.update({completedTask:totalComp,reward:sH.reward - reward, completeHistory:cH})
          if(event.type==='daily'){
            taskRef.update({complete:!completionStatus,reward:reward})
          }
          else{
            taskRef.update({complete:!completionStatus,reward:0})
          }
        }
      })

      taskRef.update({complete:!completionStatus,})

    }


  }

  // GET REAL TIME DATA FROM STATS FOR UPDATE PURPOSES
  componentDidMount =async() =>{
    LogBox.ignoreAllLogs(true);

    let statRef = firestore().collection("stats").doc(this.props.user);
    this.unsubsribe = statRef.onSnapshot((doc)=>{
      if(doc.exists){
        this.setState({stats:doc.data()})
      }
    })
  }





  componentWillUnmount = () => {
    this.unsubsribe();
  }

  render() {
    const { events } = this.props;
    const {user} = this.props;
    const {selectedDate} = this.props;
    const {leftActionActivated,rightActionActivated} = this.state

    const leftContent = <View style={styles.leftSwipeItem}>
                        {
                          leftActionActivated?
                            <Icon name ='close' style={{fontSize:44,fontWeight:'bold',color:'#FE5F55'}}/>
                            :
                            <Text style={styles.swipeText}> Pull to Delete</Text>
                        }
                        </View>
    const rightContent = <View style={styles.rightSwipeItem}>
                          {
                            rightActionActivated?
                            <Icon name ='checkmark' style={{fontSize:44,fontWeight:'bold',color:'#42f542'}}/>
                              :
                              <Text style={styles.swipeText}> Pull to Complete</Text>
                          }
                          </View>


    return (
      <View style={styles.container}>
        <ScrollView>
          {events && events.map((event, index) =>
            <Swipeable 
            disable = {(event.type === 'daily' && !moment().isSame(selectedDate,'day')) ? true:false}
            leftActionActivationDistance ={150}
            rightActionActivationDistance = {150}
            leftContent={leftContent} 
            rightContent={rightContent}
            onLeftActionActivate={()=>{
              this.setState({leftActionActivated:true})
            }}
            onLeftActionRelease={()=> firestore().collection(user).doc(event.id).delete()}
            onLeftActionDeactivate={() => this.setState({leftActionActivated: false})}

            onRightActionActivate={()=>{
              this.setState({rightActionActivated:true})
            }}
            onRightActionRelease={() => this.rightSwipeHandler(user,event)}
            onRightActionDeactivate={() => this.setState({rightActionActivated: false})}
            >
              <Event event={event} key={index} selectedDate = {selectedDate} user = {user}/>
            </Swipeable>)}
        </ScrollView>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swipeText:{
    fontSize:20,
    fontWeight:'bold',
    color:'white'
  },
  leftSwipeItem: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
    borderBottomWidth:1,
    borderBottomColor:'white',
    backgroundColor:'#f5b042'
  },
  rightSwipeItem: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 18,
    backgroundColor:'#9bf542',
    // marginBottom:5,
    borderBottomWidth:1,
    borderBottomColor:'white'
  },
});
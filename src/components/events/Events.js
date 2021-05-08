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
import { Icon, ListItem } from 'native-base';
import Event from './Event';
import type { EventType } from '../../screens/TodayScreen';
import firestore from '@react-native-firebase/firestore';
import { database } from 'faker';

function calcReward(task){
  var a = 5;
  var b = 0.5;

  var completeTime = moment();
  let reward = a * task.importanceScore + b * (-1* completeTime.diff(task.ddl)/((task.ddl).diff(task.startTime)) );
  return reward >=3 ? reward:3
}


export default class Events extends Component {

  props: {
    events: ?Array<EventType>,
  };

  state = {
    leftActionActivated:false,
    rightActionActivated:false,
    stats:{}
  }

  rightSwipeHandler(user,event){
    const taskRef = firestore().collection(user).doc(event.id);
    const statRef = firestore().collection('stats').doc(user);

    //TODO
    
    let completionStatus = event.complete
    if (!completionStatus){
      let reward = calcReward(event);
      let sH = this.state.stats;
      let totalComp = sH.completedTask+1;
      let cH =totalComp/(totalComp + sH.incompletedTask)

      taskRef.update({complete:!completionStatus})
      statRef.update({completedTask:totalComp,reward:sH.reward + reward, completeHistory:cH})
    }
    else{
      taskRef.update({complete:!completionStatus})

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
            disable = {(event.type === 'daily' && moment().isSame(selectedDate,'day')) ? false:true}
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
              <Event event={event} key={index} />
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
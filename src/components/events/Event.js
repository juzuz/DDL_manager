// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import { Button,Icon, Input} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import type { EventType } from '../../screens/TodayScreen';
import MiniEvent from './MiniEvent';

const { Popover } = renderers

const PopMenu = (props) => (

  <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }}>
    <MenuTrigger style={styles.menuTrigger} >
      <Icon name='add' style = {{color:'white'}}/>
    </MenuTrigger>
    <MenuOptions style={styles.menuOptions}>
      <View style = {styles.menuContainer}>
          <Text style ={styles.menuTitle}>Create a Mini-Task</Text>
          <Input 
            style = {styles.menuInput} 
            placeholder="Enter Mini-Task" 
            style={{borderBottomWidth:1}}
            onChangeText = {props.onChange}
            />
          <Button style = {styles.menuButton}
          onPress ={()=>
            firestore().collection(props.user).doc(props.taskID).collection("subtasks").add({
              task:props.taskName,
              complete:false,
              creationDate: firestore.Timestamp.fromDate(moment().toDate())
            })
          }  
          >
            <Text style = {styles.menuButtonText}>Add Mini-Task</Text>
          </Button>
      </View>
    </MenuOptions>
  </Menu>
)


export default class Event extends Component {

  state = {
    toggle :false,
    newtaskname:""
  }
  props: {
    event: EventType,
  }; 

  setTaskName = (val) => {
    this.setState({newtaskname:val})
  }



  render() {
    const { event ,selectedDate} = this.props;
    const {
      ddl,
      task,
      id,
      tag,
      type,
      complete,
      minitask
    } = event;

    const {toggle} = this.state
    const empty = minitask && minitask.length?false:true;
    
    const toggleToShow = () => {
      if (empty){
        return styles.toggleDownOpac
      }
      else if(toggle){
        return  styles.toggleUp
      }
      else{
        return styles.toggleDownBright
      }
    }

    return (
      <View style={(type === 'general' && complete ) || (complete &&selectedDate.isSame(moment(),'day') )?
     styles.containerComplete: styles.containerInComplete}
      >
        <View>
          {type === 'daily'?null:
          <Button transparent 
          onPress={() => this.setState({toggle:!toggle})}
          style ={{justifyContent:'center',alignItems:'flex-start',marginTop:20}}
          >
            <Icon name ='triangle' style = {toggleToShow()}/>
          </Button>
        }
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.text, styles.title]}>{task}</Text>
          {
            type === 'general' &&
          <Text style={styles.text}>{ddl.calendar()}</Text>
          }
            <Text style={styles.text}># {tag}</Text>
          {
            toggle && minitask && 
            minitask.map((mTask, index) => 
              <MiniEvent 
                minitask = {mTask} 
                user ={this.props.user} 
                taskID = {id}
              />)
          }
        </View>
        <View>
          {
            type==='daily'?
            null
            :
            <PopMenu 
              user = {this.props.user} 
              taskID = {id} 
              taskName = {this.state.newtaskname} 
              onChange = {this.setTaskName}
              />
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerComplete: {
    opacity:0.6,
    borderBottomWidth:1,
    borderBottomColor:'#FFFFFF',
    flex: 1,
    flexDirection: 'row',
    padding: 15,
  },
  containerInComplete: {
    borderBottomWidth:1,
    borderBottomColor:'#FFFFFF',
    flex: 1,
    flexDirection: 'row',
    padding: 15,
  },
  menuTrigger: {
    justifyContent:'center',
    alignItems:'center',
    marginTop:15
  },
  menuOptions: {
    padding: 50,
    
  },
  menuContainer:{
    flex:1,
    flexDirection:'column'
  },
  menuTitle:{
    fontSize:20,
    paddingBottom:10
  },
  menuInput:{
    fontSize:18,
  },
 menuButton:{
  marginTop:10,
  width:150
},
menuButtonText:{
  justifyContent:'center',
  alignItems:'center',
  color:'white',
  paddingLeft:24,
  fontSize:16
},
  textContainer: {
    flex: 1,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  toggleDownBright:{
    color:'white',
    fontSize:14,
    transform:[{rotate: "180deg" }]
  }
  ,
  toggleDownOpac:{
    opacity:0.4,
    color:'white',
    fontSize:14,
    transform:[{rotate: "180deg" }]
  },
  toggleUp:{
    color:'white',
    fontSize:14,
  }
});
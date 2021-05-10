// @flow

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
  } from 'react-native-popup-menu';
  const { Popover } = renderers

import { Container, Icon} from 'native-base';
import firestore from '@react-native-firebase/firestore';


const PopMenu = (props) => (

    <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }} onSelect ={value => {
        const subRef = firestore().collection(props.user).doc(props.taskID).collection("subtasks");
        if(value === 0){
            subRef.doc(props.minitaskID).get().then((doc)=>{
                if(doc.exists){
                    let complete = doc.data().complete;
                    subRef.doc(props.minitaskID).update({complete:!complete})
                }
            })
        }
        else{
            subRef.doc(props.minitaskID).delete()
        }
    }}>
      <MenuTrigger style={styles.menuTrigger} >
        <Icon name='ellipsis-horizontal' style = {styles.icon}/>
      </MenuTrigger>
      <MenuOptions customStyles = {{optionText: styles.text}}>
        <MenuOption value ={0} text = "Toggle">
            {/* <Text style={{marginTop:3,marginBottom:3,textAlign:'center',textAlignVertical:'center'}}>Complete</Text> */}
        </MenuOption>
        <View style={styles.divider} />
        <MenuOption value = {1} text ="Delete">
            {/* <Text style={{marginTop:3,marginBottom:3,textAlign:'center',textAlignVertical:'center'}}>Delete</Text> */}
        </MenuOption>        
      </MenuOptions>
      
    </Menu>
  )

export default class MiniEvent extends Component {

  render() {
    const { minitask ,user, taskID} = this.props;
    const {
      task,
      id,
      complete
    } = minitask;
    return (
        <View style = {complete?styles.minitaskContainerComplete:styles.minitaskContainerIncomplete}>
            <Text style= {{color:'white', fontSize:14,textAlignVertical:'center',flex:1}}>
                {minitask.task}
            </Text>
            <PopMenu user = {user} taskID = {taskID} minitaskID = {minitask.id}/>
        </View>
    );
  }

}

const styles = StyleSheet.create({
  minitaskContainerIncomplete:{
      flex:1, 
      flexDirection:'row',
      // height:40,width:280,
      borderBottomWidth:1,
      borderBottomColor:'white'
    },
    minitaskContainerComplete:{
        opacity:0.4,
        flex:1, 
        flexDirection:'row',
        borderBottomWidth:1,
        borderBottomColor:'white'
      },
  icon :{
      fontSize:20,
    //   marginLeft:200,
      color:'white',
      justifyContent:'center'
  },
  textContainer: {
    flex:1,
  },
  menuTrigger: {
    justifyContent:'center',
    alignItems:'center',
    marginTop:8
  },
  
  text: {
    fontSize:15,
    textAlignVertical:'center',
    textAlign:'center'
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 5,
    marginHorizontal: 2,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});
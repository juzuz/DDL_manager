import React from 'react';
import {Text,View,StyleSheet, SafeAreaView,StatusBar, Dimensions} from 'react-native';
import {Icon,Button,Container,Header,Content,Left,Title,Body} from 'native-base';
import {DrawerActions} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('screen').height;

export default function TaskScreen(props) {

    const dailyButtonHandler = () => {
        props.navigation.navigate("NewTask", {type: 'daily', user: props.route.params.user})
    }

    const generalButtonHandler = () => {
        props.navigation.navigate("NewTask", {type:'general',user: props.route.params.user})
    }
    return (
        <>
        <StatusBar hidden={true}></StatusBar>
        <Container style={styles.container}>
          
            <Content contentContainerStyle={{
                
                // justifyContent:'center'
            }}>
            <Container style={styles.buttonGroup}>
                <View>
                <Button large rounded style={styles.taskButton} onPress={dailyButtonHandler}>
                    <View style={styles.buttonContent}>
                        <Icon name='calendar-sharp' style={styles.icon1} />
                        <Text style= {styles.buttonText}>Daily Task</Text>
                    </View>
                </Button>
                <Button large rounded style={styles.taskButton} onPress={generalButtonHandler}>
                    <View style={styles.buttonContent}>
                        <Icon name='calendar' style={styles.icon2}/>
                        <Text style= {styles.buttonText}>One Time Task</Text>
                    </View>
                </Button>
                </View>
                <View>
                    <Text style = {{color:'yellow'}}>
                        OR CHOOSE FROM THESE CATERGORIES
                    </Text>
                </View>
                <View style ={{borderRadius:2,marginTop:20}}>
                <View style={{flex:1,flexDirection:'column',backgroundColor:'#31343a',width:windowWidth*0.9,borderRadius:25}}>
                    <View style={styles.cat}>
                        <Text style= {styles.catText}>Healthy Habits</Text>
                    </View>
                    <View style={{marginTop:30,backgroundColor:'white',height:0.5}}/>

                    <View style={styles.cat}>
                        <Text style= {styles.catText}>Academic Excellence</Text>
                    </View>
                    <View style={{marginTop:30,backgroundColor:'white',height:0.5}}/>
                    
                    <View style={styles.cat}>
                        <Text style= {styles.catText}>Workout Maniac</Text>
                    </View>
                    <View style={{marginTop:30,backgroundColor:'white',height:0.5}}/>
                    <View style={styles.cat}>
                        <Text style= {styles.catText}>Cut Procrastination</Text>
                    </View>
                    <View style={{marginTop:30,backgroundColor:'white',height:0.5}}/>
                    <View style={styles.cat}>
                        <Text style= {styles.catText}>Daily Excercise</Text>
                    </View>
                    <View style={{marginTop:30,backgroundColor:'white',height:0.5}}/><View style={styles.cat}>
                        <Text style= {styles.catText}>Hydration Check</Text>
                    </View>
                    <View style={{marginTop:30,backgroundColor:'white',height:0.5}}/><View style={styles.cat}>
                        <Text style= {styles.catText}>Increase Productivity</Text>
                    </View>
                    <View style={{marginTop:30,backgroundColor:'white',height:0.5}}/>
                </View>
                </View>
            </Container>
           
            </Content>
        </Container>
        </>
    )
}

// 1e212a
const styles = StyleSheet.create({
    container:{
        backgroundColor:'#1e212a',
        alignItems:'center'
    },
  
    buttonContent:{
     flex:1,
     flexDirection:'row'
    },
    cat:{
        marginTop:5,
    },
    catText:{
        marginTop:20,
        textAlign:'center',
        fontSize:22,
        fontWeight:'bold',
        color: '#E5E5F3',
    },
   
    buttonText:{
        fontSize:21,
        fontWeight:'bold',
        color: '#E5E5F3',
    },
    icon1:{
        color:"#FE5F55"
    },
    icon2:{
        color:"#BDD5EA"
    },
    taskButton:{
        alignItems:'flex-start',
        marginBottom:windowHeight*0.01, 
        marginTop:windowHeight*0.01, 
        justifyContent:'center',
        flex:1,
        borderRadius:20,
        backgroundColor:'#495867',
        height:windowHeight*0.094
    },

    buttonGroup:{
        width:windowWidth*0.9,
        alignItems:'center',
        backgroundColor: "#1e212a"
    },

})

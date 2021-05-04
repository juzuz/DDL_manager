import React from 'react';
import {Text,View,StyleSheet, SafeAreaView,StatusBar, Dimensions} from 'react-native';
import {Icon,Button,Container,Header,Content,Left,Title,Body} from 'native-base';
import {DrawerActions} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function TaskScreen(props) {

    const dailyButtonHandler = () => {
        props.navigation.navigate("NewTask")
    }
    return (
        <>
        <StatusBar hidden={true}></StatusBar>
        <Container style={styles.container}>
          
            <Content contentContainerStyle={{
                
                // justifyContent:'center'
            }}>
            <Container style={styles.buttonGroup}>
                <Button large rounded style={styles.taskButton} onPress={dailyButtonHandler}>
                    <View style={styles.buttonContent}>
                        <Icon name='calendar-sharp' style={styles.icon1} />
                        <Text style= {styles.buttonText}>Daily Task</Text>
                    </View>
                </Button>
                <Button large rounded style={styles.taskButton}>
                    <View style={styles.buttonContent}>
                        <Icon name='calendar' style={styles.icon2}/>
                        <Text style= {styles.buttonText}>One Time Task</Text>
                    </View>
                </Button>
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
    header: {
        backgroundColor: "#1e212a"
    },
    buttonContent:{
     flex:1,
     flexDirection:'row'
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

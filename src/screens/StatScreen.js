import React,{useEffect, useState} from 'react';
import {Text,View,StyleSheet, Dimensions,StatusBar, ScrollView} from 'react-native';
import {Icon,Button,Container,Header,Content,Left,Title,Body} from 'native-base';
import {DrawerActions} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function StatScreen(props) {

    const [stats,setStats] = useState({});
    const getUserStats = (user) => {
        return firestore().collection('stats').doc(user);
    }


    useEffect(() => {
        
        if(props.route.params.user){

        const docRef = getUserStats(props.route.params.user);
        docRef.onSnapshot((snapshot)=> {
            if(snapshot){
                const statDoc = ({
                    ...snapshot.data(),
                })
                setStats(statDoc);
            }
        })
    }
    }, [])

    return (
        <>
        
        <StatusBar hidden={true}></StatusBar>
        {stats?
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
            <Content contentContainerStyle={{
                flex:1,
               
            }}>
                <ScrollView>
                <View style={{padding:20}}>
                    <View style={{ backgroundColor: '#232733',borderWidth:1,borderColor:'#232733', borderRadius:10,padding:10}}>
                        <Calendar
                        theme={{
                            backgroundColor: '#232733',
                            calendarBackground: '#232733',
                            textSectionTitleDisabledColor: '#c7c7c7',
                            todayTextColor: '#3ce8a9',
                            dayTextColor: '#e8e8e8',
                            textDisabledColor: '#9e9e9e',
                            disabledArrowColor: '#9e9e9e',
                            monthTextColor: '#e8e8e8',
                            indicatorColor: '#c7c7c7',
                            textDayFontFamily: 'monospace',
                            textMonthFontFamily: 'monospace',
                            textDayHeaderFontFamily: 'monospace',
                            textDayFontWeight: '300',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '300',
                            textDayFontSize: 12,
                            textMonthFontSize: 14,
                            textDayHeaderFontSize: 12
                        }}
                        style = {styles.calendar}
                        minDate={props.route.params.trackingDate}
                        onDayPress={(day) => {console.log('selected day', day)}}
                        monthFormat={'MMM yyyy'}
                        renderArrow={(direction) => 
                            (direction ==='left'?
                            <Icon name="chevron-back" style={{color:"white",fontSize:14}}/>
                            :<Icon name="chevron-forward" style={{color:"white",fontSize:14}}/>)
                        }
                        hideExtraDays={true}
                        firstDay={1}
                        onPressArrowLeft={subtractMonth => subtractMonth()}
                        onPressArrowRight={addMonth => addMonth()}
                        disableAllTouchEventsForDisabledDays={true}
                        enableSwipeMonths={true}
                        />
                    </View>
                </View>
                <View style={{flex:1,alignSelf:'center'}}>
                    <View style={{
                        backgroundColor: "#232733",
                        padding:10,
                        marginLeft: '5%',
                        borderRadius: 5,
                        //marginBottom: 15,
                        marginTop: 5,
                        marginRight: "5%",
                        maxWidth: '150%',
                        alignSelf: 'center',
                        //maxWidth: 500,
                        
                        borderRadius: 20,
                    }}
                    >
                        <Text style={{color:'#9e9e9e', fontSize:14,padding:10}}>The first step is the hardest. No hesitations - you can make it!</Text>
                    <View style={styles.rightArrow}></View>
                      
                    <View style={styles.rightArrowOverlap}></View>
                    </View>

                </View>
                <View style={styles.statContainer}>
                    <View style ={styles.statBox}>
                        <Icon name='checkmark' style={{color:'green'}}/>
                        <Text style = {styles.data}>{stats.completedTask}</Text>
                        <Text style={styles.statName}>Number of Tasks Completed</Text>
                    </View>
                    <View style ={styles.statBox}>
                        <Icon name='analytics' style={{color:'orange'}}/>
                        <Text style = {styles.data}>
                            {(stats.completeHistory * 100).toString().substring(0,3)} %
                        </Text>
                        <Text style={styles.statName}>Completion Score</Text>
                    </View>
                </View>
                <View style={styles.statContainer}>
                    <View style ={styles.statBox}>
                        <Icon name='bonfire' style={{color:'red'}}/>
                        <Text style = {styles.data}>{moment().diff(stats.trackingDate,'days') + 1}</Text>
                        <Text style={styles.statName}>Completion Streak         (days)</Text>
                    </View>
                    <View style ={styles.statBox}>
                        <Icon name='stats-chart' style={{color:'yellow'}}/>
                        <Text style = {styles.data}>
                            {moment().diff(stats.trackingDate,'days') ? ((stats.completedTask / moment().diff(stats.trackingDate,'days')) *100).toString().substr(0,3): stats.completedTask} 
                        </Text>
                        <Text style={styles.statName}>Average Tasks     Completed</Text>
                    </View>
                </View>
                <View style ={styles.statistic}>

                </View>
            </ScrollView>
                
            </Content>
        </Container>
        :
        null}
        </>
    )
}

// 1e212a
const styles = StyleSheet.create({
    container:{
        backgroundColor:'#1e212a'
    },
    calendar:{
        // backgroundColor:'#1e212a'
    },
    title:{
        
        fontSize:24,
        fontWeight:'normal'
    },
    header: {
        backgroundColor: "#1e212a"
    },
    statContainer:{
       flex:1,
       flexDirection:'row'
    },
    statistic:{
        flex:1
    },
    statBox:{
        flex:1,
        backgroundColor:'#232733',
        height:windowHeight*0.15,
        borderRadius:20,
        margin:10,
        justifyContent:'center',
        alignItems:'flex-start',
        paddingLeft:30,
        paddingTop:10,
        paddingBottom:5,
    },
    statName:{
        fontSize:12,
        fontWeight:'bold',
        marginBottom:10,
        color:'#e8e8e8'
    },
    data:{
        fontSize:26,
        color: '#e8e8e8',
        fontWeight:'bold'
    },
    rightArrow: {
        position: "absolute",
        backgroundColor: "#232733",
        //backgroundColor:"red",
        width: 20,
        height: 25,
        bottom: 0,
        borderBottomLeftRadius: 25,
        right: -10
      },
      
      rightArrowOverlap: {
        position: "absolute",
        backgroundColor: "#1e212a",
        //backgroundColor:"green",
        width: 20,
        height: 35,
        bottom: -6,
        borderBottomLeftRadius: 18,
        right: -20
      
      },

})

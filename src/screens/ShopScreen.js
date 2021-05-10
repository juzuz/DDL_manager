import React,{useEffect, useState} from 'react';
import {Text,View,StyleSheet, Dimensions,StatusBar, ScrollView, Image, TouchableOpacity, ViewComponent} from 'react-native';
import {Icon,Button,Container,Header,Content,Left,Title,Body} from 'native-base';
import {DrawerActions} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';



// function Item({ item }) {
//   return (
//     <View style={styles.listItem}>
//       //<Image source={{uri:item.photo}}  style={{width:60, height:60,borderRadius:30}} />
//       <View style={{alignItems:"center",flex:1}}>
//         <Text style={{fontWeight:"bold"}}>{item.product}</Text>
//         <Text>{item.price}</Text>
//       </View>
//       <TouchableOpacity style={{height:50,width:50, justifyContent:"center",alignItems:"center"}}>
//         <Text style={{color:"green"}}>{"Claim"}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const options = [
    {icon:'search',label:"Search"},
    {icon:'heart',label:"Favorites"},
    {icon:'time',label:"Limited Time"},
    {icon:'shuffle',label:"Surprise Me"},
    {icon:'wine', label:'Liquor'},
    {icon:'female',label:'Women Trending'},
    {icon:'male',label:'Male Trending'}
    ]

    
const categories = [
    {icon:'receipt',label:"Retail"},
    {icon:'fast-food',label:'Restaurants'},
    {icon:'cash', label:'Cash cards'},
    {icon:'star-half',label:'Fashion'},
    {icon:'desktop-sharp',label:"Home & office"},
    {icon:'paw',label:'Pets'},
    {icon:'rose',label:"Health & Beauty"},
    {icon:'heart',label:"Charity"},
    {icon:'airplane',label:'Travel'},
    {icon:'musical-note-sharp',label:"Recreation"},
    ]

const logo = [
    {label:"$3 gift card",logo:require("../assets/nike.png")},
    {label:"$3 gift card",logo:require("../assets/qq.png")},
    {label:"$3 gift card",logo:require("../assets/riot.png")},
    {label:"$3 gift card",logo:require("../assets/amazon.png")},
    {label:"$3 gift card",logo:require("../assets/addidas.png")},
    {label:"$3 gift card",logo:require("../assets/hema.png")},
    {label:"$3 gift card",logo:require("../assets/walmart.png")}
]
export default function ShopScreen(props) {

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
        <Container style={styles.container}>
            <Header style={styles.header}>
                <Left>
                    <Button transparent  onPress = {() => props.navigation.dispatch(DrawerActions.openDrawer())}>
                    <Icon name='menu' style={{color:'black'}} 
                    />
                    </Button>
                </Left>
                <Body style={{flex:1,textAlign:'center',paddingLeft:"24%"}}>
                    <Title style ={styles.title}>{props.route.name}</Title>
                </Body>
                <Body style={{flex:1,alignItems:'flex-end', paddingRight:"4%"}}>
                <Text style ={{ fontSize:18}}>{stats.reward} pts</Text>
                </Body>
            </Header>
            <Content contentContainerStyle={{
            }}>
            <ScrollView>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View>
                        <View style={{flex:2,flexDirection:'row', marginTop:20,marginLeft:5}}>
                            {
                                options.map((item) => (
                                    <View style={{margin:8}}>
                                        <Button  transparent style={{color:"white",borderRadius:50,borderWidth:0.3,borderColor:'#bdbdbd',margin:5}}>
                                            <Icon name = {item.icon} style={{color:"#616060"}}/>
                                        </Button>
                                        <Text style={{color:"#808080",flex:1,width:60,marginLeft:5,flexWrap:'wrap',textAlign:'center'}}>{item.label}</Text>
                                    </View>
                                ))
                            }
                        </View>
                    </View>
                </ScrollView>
                <View style= {{marginTop:10,paddingLeft:12,flex:1,flexDirection:'row',width:windowWidth}}>
                    <Text style= {{flex:1,alignItems:'flex-start',fontSize:20,fontWeight:'bold'}}>Featured Rewards</Text>

                    <Text style ={{alignItems:'flex-end',marginRight:'4%',marginTop:5,color:"#5174a8"}}>View All</Text>
                </View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View>
                        <View style={{flex:2,flexDirection:'row', paddingTop:20}}>
                            {
                                logo.map((item) => (
                                    <View style ={{flex:2}}>
                                    <View style ={{borderWidth:0.3 ,borderColor:"#616060",margin:5,padding:5}}>
                                    <Image source={item.logo}  style={{width:150, height:150}} />
                                    </View>
                                    <Text style={{color:"#808080",flex:1,marginLeft:5,textAlign:'center'}}>
                                        {item.label}
                                    </Text>
                                    </View>
                                ))
                            }
                        </View>
                    </View>
                </ScrollView>
                <View style= {{marginTop:20,paddingLeft:12,flex:1,flexDirection:'row',width:windowWidth}}>
                    <Text style= {{flex:1,alignItems:'flex-start',fontSize:20,fontWeight:'bold'}}>Categories</Text>

                    <Text style ={{alignItems:'flex-end',marginRight:'4%',marginTop:5,color:"#5174a8"}}>View All</Text>
                </View>
                <View  style={{flex:1,marginTop:10}}>
                {
                    categories.map((cat)=> (
                        <>
                        <View style ={{marginBottom:10}}/>
                        <View style={{flex:1,flexDirection:'row'}}>
                            <Icon name ={cat.icon} style= {{marginLeft:10,color:'#6e5494'}}/>
                            <Text style={{marginLeft:10,marginTop:5,fontSize:16}}>{cat.label}</Text>
                        </View>
                        <View style ={{marginTop:10,flex:1,height:1,opacity:0.1,backgroundColor:'black'}}/>
                        </>
                    ))
                }
                </View>
            </ScrollView>
            </Content>
        </Container>
        </>
    )
}

const styles = StyleSheet.create({
    rewardTitle:{
	textAlign: "center",
	padding: 10,
    	fontSize: 18,
    	height: 44,
	fontWeight:'bold'
    },
    container:{
        backgroundColor:'white',
        flex:1
    },
    title:{
        fontSize:22,
        fontWeight:'bold',
        color:"black",
    },
    header: {
        backgroundColor: "white",
    },
    statContainer:{
       backgroundColor: "#495867",
       flex:1,
       flexDirection:'column'
    },
    statistic:{
        flex:1
    },
    statBox:{
        flex:1,
        backgroundColor:'#BDD5EA',
        height:windowHeight*0.2,
        borderRadius:5,
        margin:10,
        justifyContent:'center',
        alignItems:'center'
    },
    statName:{
        fontSize:18,
        fontWeight:'bold',
        marginBottom:10,
        borderBottomWidth:1,
        color:'#577399'
    },
    data:{
        fontSize:16,
        color: 'black',
        fontWeight:'bold'
    },
    item: {
    	padding: 10,
    	fontSize: 18,
    	height: 44,
	textAlign: "center",
    },
    listItem:{
    	margin:10,
    padding:10,
    backgroundColor:"#FFF",
    width:"80%",
    flex:1,
    alignSelf:"center",
    flexDirection:"row",
    borderRadius:5
  }

})

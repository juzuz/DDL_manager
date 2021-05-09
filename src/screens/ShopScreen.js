import React,{useEffect, useState} from 'react';
import {Text,View,StyleSheet, Dimensions,StatusBar, FlatList, Image, TouchableOpacity} from 'react-native';
import {Icon,Button,Container,Header,Content,Left,Title,Body} from 'native-base';
import {DrawerActions} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';



function Item({ item }) {
  return (
    <View style={styles.listItem}>
      //<Image source={{uri:item.photo}}  style={{width:60, height:60,borderRadius:30}} />
      <View style={{alignItems:"center",flex:1}}>
        <Text style={{fontWeight:"bold"}}>{item.product}</Text>
        <Text>{item.price}</Text>
      </View>
      <TouchableOpacity style={{height:50,width:50, justifyContent:"center",alignItems:"center"}}>
        <Text style={{color:"green"}}>{"Claim"}</Text>
      </TouchableOpacity>
    </View>
  );
}


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function ShopScreen(props) {

    const [stats,setStats] = useState({});
    const getUserStats = (user) => {
        return firestore().collection('stats').doc(user);
    }


    useEffect(() => {
        if(props.route.params.user){

        const docRef = getUserStats(props.route.params.user);
        let exists = false;
        docRef.onSnapshot((snapshot)=> {
            if(snapshot){
                const statDoc = ({
                    ...snapshot.data(),
                })
                setStats(statDoc);
                exists = true;
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
               
            }}>

                <View style={styles.statContainer}>
<View>
<Text style = {styles.rewardTitle}> {"You have " + stats.reward + " reward points left."} </Text>
</View>

<FlatList
        data = {[
          {product: 'dummy shop product 1', price: '100', photo: "./src/assets/dummy.jpg"},
          {product: 'dummy shop product 2', price: '100'},
          {product: 'dummy shop product 3', price: '100'},
          {product: 'dummy shop product 4', price: '100'},
          {product: 'dummy shop product 5', price: '100'},
          {product: 'dummy shop product 6', price: '100'},
          {product: 'dummy shop product 7', price: '100'},
          {product: 'dummy shop product 8', price: '100'},
          {product: 'dummy shop product 9', price: '100'},
          {product: 'dummy shop product 10', price: '100'},
        ]}
        //renderItem={({item}) => 
//

renderItem={({item}) => <View style={styles.listItem}>

<View style={{alignItems:"center",flex:1}}>
<Image source={require("../assets/dummy.jpg")}  style={{width:60, height:60,borderRadius:30}} />
        <Text style={{fontWeight:"bold"}}>{item.product}</Text>
        <Text>{"Price: " + item.price + " reward points"}</Text>
<TouchableOpacity style={{height:50,width:50, justifyContent:"center",alignItems:"center"}}>
        <Text style={{color:"green"}}>{"Claim"}</Text>
      </TouchableOpacity>

      </View></View>}
      />
                   </View>
            
            </Content>
        </Container>
        :
        null}
        </>
    )
}

// 1e212a
const styles = StyleSheet.create({
    rewardTitle:{
	textAlign: "center",
	padding: 10,
    	fontSize: 18,
    	height: 44,
	fontWeight:'bold'
    },
    container:{
        backgroundColor:'#1e212a'
    },
    title:{
        fontSize:24,
        fontWeight:'normal'
    },
    header: {
        backgroundColor: "#1e212a"
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

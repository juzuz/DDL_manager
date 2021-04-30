import React from 'react';
import {Text,View,StyleSheet, SafeAreaView,StatusBar} from 'react-native';
import {Icon,Button,Container,Header,Content,Left,Title,Body} from 'native-base';
import {DrawerActions} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
export default function TemplateScreen(props) {
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
            <Content contentContainerStyle={{
                flex:1,
                alignItems:"center",
                justifyContent:'center'
            }}>
            <Text style={styles.bodyText}>
                TODAY SCREEN
            </Text>
            <Button large rounded style={styles.taskButton}>
                <Icon name='add'></Icon>
            </Button>
            </Content>
        </Container>
        </>
    )
}

// 1e212a
const styles = StyleSheet.create({
    container:{
        backgroundColor:'#1e212a'
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

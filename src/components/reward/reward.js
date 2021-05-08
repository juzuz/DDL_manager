import moment from 'moment-timezone';
import firestore from '@react-native-firebase/firestore';

//function to calculate reward
//input: completed task from database
export function calcReward(task){
	var a = 5;
	var b = 0.5;
  
	var completeTime = moment();
	let reward = a * task.importanceScore + b * (-1* completeTime.diff(task.ddl)/((task.ddl).diff(task.startTime)) );
	return reward >=3 ? reward:3
  }

//code below is to store the reward into the DB
// let user = props.route.params.user;
// let data = {
//                 reward: reward,
//             }
// const res = await firestore().collection("stats").doc(user).set(data)
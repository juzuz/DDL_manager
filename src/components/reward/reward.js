import moment from 'moment-timezone';
import firestore from '@react-native-firebase/firestore';

//function to calculate reward
//input: completed task from database
function reward(data){
	//placeholders
	var a = 0.5;
	var b = 0.5;

	var completeTime = firestore.Timestamp.fromDate(moment().toDate());
	return a * data.importanceScore + b * (completeTime - data.startTime) / (data.ddl - data.startTime);
}

//code below is to store the reward into the DB
let user = props.route.params.user;
let data = {
                reward: reward,
            }
const res = await firestore().collection("stats").doc(user).set(data)
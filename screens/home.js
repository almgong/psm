 import React from "react";
 import {
 	Button,
 	Text,
 	View
 } from "react-native";

 // subcomponents
 import AmountForm from '../subcomponents/form/amount_form';

 /**
  * Home screen of the app. Contains at minimum a form to enter
  * a US dollar amount and custom category.
 **/
 class HomeScreen extends React.Component {
 	static navigationOptions = {
 		title: 'Welcome'
 	};

 	// returns a time-dependent greeting
 	getGreeting() {
 		let date = new Date();
 		let hour = date.getHours();
 		let greeting = 'Hello!';

 		if (hour < 12) {
 			greeting = 'Good morning! What would you like to log for today?';
 		} else if (hour < 16) {
 			greeting = 'Good afternoon! What would you like to log for today?';
 		} else {
 			greeting = 'Good evening! What would you like to log for tonight?';
 		}

 		return greeting;
 	}

 	render() {
 		return(
 			<View style={{
 					flex: 1, 
 					flexDirection: 'column',
 					alignItems: 'center'
	 			}}>
	 			<Text style={{
	 				fontSize: 20,
	 				marginBottom: 15
	 			}}>Personal Spending Manager</Text>
 				<Text>{ this.getGreeting() }</Text>
 				<AmountForm 
 					textInputPlaceholder='e.g. 20.50' 
 					buttonTitle='Save'
 					buttonAccessibilityLabel='Submit an expenditure cost'>
 				</AmountForm>
 			</View>
 		);
 	}
 }

 export default HomeScreen;
 import React from "react";
 import {
 	ActivityIndicator,
 	Button,
 	Text,
 	View
 } from "react-native";

 // subcomponents
 import LogSpendingForm from '../subcomponents/form/log_spending_form';
 import PsmStorage from '../modules/storage';

 /**
  * Home screen of the app. Contains at minimum a form to enter
  * a US dollar amount and custom category.
 **/
 class HomeScreen extends React.Component {
 	static navigationOptions = {
 		title: 'Welcome',
 		drawerLabel: 'Welcome'
 	};

 	constructor(props) {
 		super(props);

 		this.state = { loadingData: true };

 		let self = this;
 		PsmStorage.initialize(() => {
 			// loading data complete!
			self.setState({ loadingData: false });
		});
 	}

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
	 			{ (this.state.loadingData) ? 
	 				<View style={{flex: 1}}>
						<ActivityIndicator
	        	animating={true}
	        	size='large'
	      		/>
	      		<Text>Loading your data...</Text>
	      	</View>  : 

		      <View style={{alignItems:'center', flex: 1}}>
			      <Text style={{
			 				fontSize: 20,
			 				marginBottom: 15
			 			}}>Personal Spending Manager</Text>
		 				<Text>{ this.getGreeting() }</Text>
		 				<LogSpendingForm 
		 					amountInputPlaceholder='e.g. 5.50'
		 					categoryInputPlaceholder='e.g. Food' />
	 				</View>
 				}
 				</View>
 		);
 	}
 }

 export default HomeScreen;
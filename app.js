/**
 * Main App Registration location. Acts as the entry point
 * for both iOS and Android builds.
**/
import {
  AppRegistry
} from 'react-native';
import { 
	StackNavigator, 
	DrawerNavigator 
} from 'react-navigation';

// screens
import HomeScreen from './screens/home';
import SpendingsScreen from './screens/spendings';

const stackNavigator = StackNavigator({
	Home: {
		screen: HomeScreen
	},
	SpendingHistory: {
		screen: SpendingsScreen
	}
});

const PersonalSpendingManager = DrawerNavigator({
	Home: { screen: stackNavigator },
	SpendingHistory: { screen: SpendingsScreen }
})

AppRegistry.registerComponent('PersonalSpendingManager', 
	() => PersonalSpendingManager);
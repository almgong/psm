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
import SettingsScreen from './screens/settings';

const stackNavigator = StackNavigator({
	Home: {
		screen: HomeScreen
	},
	SpendingHistory: {
		screen: SpendingsScreen
	},
	Settings: {
		screen: SettingsScreen
	}
});

const PersonalSpendingManager = DrawerNavigator({
	Home: { screen: stackNavigator },
	SpendingHistory: { screen: SpendingsScreen },
	Settings: { screen: SettingsScreen }
})

AppRegistry.registerComponent('PersonalSpendingManager', 
	() => PersonalSpendingManager);
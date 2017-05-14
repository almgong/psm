/**
 * Main App Registration location. Acts as the entry point
 * for both iOS and Android builds.
**/
import {
  AppRegistry
} from 'react-native';
import { StackNavigator } from 'react-navigation';

// screens
import HomeScreen from './screens/home';
import SpendingsScreen from './screens/spendings';

const PersonalSpendingManager = StackNavigator({
	Home: { screen: HomeScreen },
	Spendings: { screen: SpendingsScreen }
})

AppRegistry.registerComponent('PersonalSpendingManager', 
	() => PersonalSpendingManager);
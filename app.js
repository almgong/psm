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

const PersonalSpendingManager = StackNavigator({
	Home: { screen: HomeScreen }
})

AppRegistry.registerComponent('PersonalSpendingManager', 
	() => PersonalSpendingManager);
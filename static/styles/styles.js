import { StyleSheet } from 'react-native';

/* Contains the core syles shared across the app. */

var darkBlue = '#01161E';
var blue = '#124559';
var lightBlue = '#598392';
var green = '#AEC3B0';
var lightGreen = '#EFF6E0';

var styles = StyleSheet.create({
	error: {
		color: 'red'
	},
	fontColorDarkBlue: {
		color: darkBlue
	},
	fontColorBlue: {
		color: blue
	},
	fontColorLightBlue: {
		color: lightBlue
	},
	fontColorGreen: {
		color: green
	},
	fontColorLightGreen: {
		color: lightGreen
	},
	textInput: {
		width: 100, 
		height: 40, 
		borderColor: 'gray', 
		borderWidth: 2, 
		padding: 2
	}
});

export default styles;
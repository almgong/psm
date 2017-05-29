import React from 'react';
import {
	Button,
	ScrollView,
	Text,
	View
} from 'react-native';

// styles
import styles from '../static/styles/styles';

// modules
import PsmStorage from '../modules/storage';

/**
 * Settings screen. Affords clearing all data, ...
**/
class SettingsScreen extends React.Component {
	static navigationOptions = {
 		title: 'Settings',
 		drawerLabel: 'Settings'
 	};

	constructor(props) {
		super(props);

		this.state = {
			alert: '',
			alertType: ''
		};
	}

	clearDataOnPress() {
		let self = this;
		PsmStorage.clearData((err) => {
			let msg = 'Successfully cleared all data.';
			let type = 'success';
			if (err) {
				msg = 'Unable to clear data, reason: ' + err.message;
				type = 'danger';
			}

			self.setState({ 
				alert: msg,
				alertType: type
			});
		});
	}

	getAlert() {
		let alertColor = 'black';
		if (this.state.alertType == 'success') {
			alertColor = 'green';
		} else if (this.state.alertType == 'danger') {
			alertColor = 'red';
		}

		return (
			<Text style={{color: alertColor}}>{this.state.alert}</Text>
		)
	}

	render() {
		return(
			<ScrollView style={{padding: 15}}>
				<View>
					{this.getAlert()}
				</View>
				<View>
					<Button 
						title="Clear data"
						accessbilityLabel="Clear data"
						onPress={this.clearDataOnPress.bind(this)} />
				</View>
			</ScrollView>
		)
	}
}

export default SettingsScreen;
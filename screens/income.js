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

// subcomponents
import DataByPeriodPicker from '../subcomponents/picker/data_by_period_picker';

/**
 * Income screen. Allows users to set, view, and compare their income to
 * expenditures.
**/
class IncomeScreen extends React.Component {
	static navigationOptions = {
 		title: 'Income',
 		drawerLabel: 'Income'
 	};

	constructor(props) {
		super(props);
	}

	_onPick(data) {
		console.log('wooo')
		console.log(data)
	}

	render() {
		return (
			<View>
				<DataByPeriodPicker defaultPeriod={DataByPeriodPicker.currentMonth} onPick={this._onPick} />
			</View>
		);
	}

}

export default IncomeScreen;
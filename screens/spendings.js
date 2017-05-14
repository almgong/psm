import React from 'react';
import {
	ScrollView,
	Text,
	View
} from 'react-native';

// modules
import PsmStorage from '../modules/storage';

class SpendingsScreen extends React.Component {
	static navigationOptions = {
 		title: 'Spending History'
 	};

	constructor(props) {
		super(props);

		this.date = new Date();
		this._expenditureData = PsmStorage.getExpenditures();

		// try to show this month's spending data
		this.state = {
			period: (this.date.getMonth()+1) + '/' + (this.date.getFullYear()),	// TODO reconsider how to represent this
			data: (this._expenditureData[this.date.getFullYear()][this.date.getMonth()+1] || {})
		}
	}

	// generates a certain type of view to display spending data
	generateView(type) {
		type = type || 'text';
		let view = null;
		if (type == 'text') {
			view = this._generateTextView();
		}
		// TODO other view types (e.g. graphs, charts) can go here

		return view;
	}

	// generates a textual representation of spending data
	_generateTextView() {
		return(
			<ScrollView>
				<Text>Spending history for: {this.state.period}</Text>
				<Text>Total spent: {this._getCurrentTotalSpendingAmount()}</Text>
				{this._generateTextPercentageView()}
			</ScrollView>
		);
	}

	// generates a textual list of expenditures by category, and as percentages
	_generateTextPercentageView() {
		let categoriesWithPercents = [];		// will be an array of tuples [ ['food', #percentage], ... ]
		let total = this._getCurrentTotalSpendingAmount();

		return(
			<View>
				{[1,2,3].map((num) => { <Text>{num}</Text> } }
			</View>
		);
	}


	// helper methods to aid computation
	// note that all of these should utilize `this.state` and not be passed in any custom data

	// returns the total amount spent in the current period
	_getCurrentTotalSpendingAmount() {
		let total = 0;
		Object.keys(this.state.data).forEach ((key) => {	// key should be the day of the month, e.g. 14

			// each date is then organized as an array of spendings
			this.state.data[key].forEach((expenditure) => {
				total += (+expenditure.amount);
			});
		});

		return total;
	}

	render() {
		return (
			<View>
				{this.generateView()}
			</View>
		);
	}
}

export default SpendingsScreen;
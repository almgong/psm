import React from 'react';
import {
	ScrollView,
	Text,
	View
} from 'react-native';

// styles
import styles from '../static/styles/styles';

// modules
import PsmStorage from '../modules/storage';

class SpendingsScreen extends React.Component {
	static navigationOptions = {
 		title: 'Spending History',
 		drawerLabel: 'Spending History'
 	};

	constructor(props) {
		super(props);

		this._expenditureData = PsmStorage.getExpenditures();
		this._categoryData = PsmStorage.getCategories();

		this.date = new Date();

		// try to show this month's spending data
		this.state = {
			period: (this.date.getMonth()+1) + '/' + (this.date.getFullYear()),	// TODO reconsider how to represent this
			data: (this._expenditureData[this.date.getFullYear()][this.date.getMonth()+1] || {}),
			viewType: 'text'
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
		let totalAmountSpent = this._getCurrentTotalSpendingAmount();
		let averagePerDaySpent = (totalAmountSpent/(this.date.getDate())).toFixed(2);

		return(
			<ScrollView>
				<Text style={styles.header2}>Spending history for: {this.state.period}</Text>
				<Text style={styles.header3}>Total spent: ${totalAmountSpent}</Text>
				<Text style={styles.header3}>
					Average per day (as of {(this.date.getMonth()+1) + '/' + this.date.getDate()}): ${averagePerDaySpent}
				</Text>
				{this._generateTextPercentageView()}
			</ScrollView>
		);
	}

	// generates a textual list of expenditures by category, and as percentages
	_generateTextPercentageView() {
		let categoriesWithPercents = [];		// will be an array of tuples [ ['food', #percentage], ... ]
		
		let totalAmountSpent = this._getCurrentTotalSpendingAmount();
		let amountByCategory = this._getSpendingsByCategory();	// { 'food': amountSpentForCategory }

		Object.keys(amountByCategory).forEach((key) => {
			categoriesWithPercents.push([key, parseFloat((amountByCategory[key]/totalAmountSpent*100).toFixed(3))]);
		});


		return(
			<View style={{marginVertical: 15}}>
				<Text style={styles.header3}>Breakdown by Percent:</Text>
				{categoriesWithPercents.map((tuple) => {
					return (
						<View key={tuple[0]} style={{flexDirection: 'row', paddingVertical: 5}}>
							<Text style={[{fontSize: 16}, styles.fontColorBlue]}>{tuple[0] + ': '}</Text>
							<Text>{tuple[1] + '%' }</Text>
							<Text style={{color:'red'}}>{'($' + amountByCategory[tuple[0]] + ')'}</Text>
						</View>
					);
				})}
			</View>
		);
	}


	// helper methods to aid computation
	// note that all of these should utilize `this.state` and not be passed in any custom data
	// lastly, for now, we assume only monthly view (these methods will need to be modified in the future)

	// returns the total amount spent in the current period
	_getCurrentTotalSpendingAmount() {
		let total = 0;
		Object.keys(this.state.data).forEach((key) => {	// key should be the day of the month, e.g. 14

			// each date is then organized as an array of spendings
			this.state.data[key].forEach((expenditure) => {
				total += (+expenditure.amount);
			});
		});

		return total;
	}

	// returns the total amount spent per category in the current period
	// e.g. { 'food': 350.65 }
	_getSpendingsByCategory() {
		let spendingsByCategory = {};

		// for each day (key = day of month)
		Object.keys(this.state.data).forEach((key) => {
			let expenditures = this.state.data[key];

			// accumulate each expenditure amount by category
			expenditures.forEach((expenditure) => {
				let categoryTitle = this._categoryData[expenditure.category].title;

				if (spendingsByCategory[categoryTitle]) {
					spendingsByCategory[categoryTitle] += (+expenditure.amount);
				} else {
					spendingsByCategory[categoryTitle] = (+expenditure.amount);
				}
				});
		});

		return spendingsByCategory;
	}

	render() {
		return (
			<View style={{padding: 15}}>
				{this.generateView(this.state.viewType)}
			</View>
		);
	}
}

export default SpendingsScreen;
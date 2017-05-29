import React from 'react';
import {
	ScrollView,
	Text,
	View
} from 'react-native';
import SimplePicker from 'react-native-simple-picker';

// styles
import styles from '../static/styles/styles';

// modules
import PsmStorage from '../modules/storage';

/**
 * Spending history screen. Affords viewing expenditures in different formats.
**/
class SpendingsScreen extends React.Component {
	static navigationOptions = {
 		title: 'Spending History',
 		drawerLabel: 'Spending History'
 	};

	constructor(props) {
		super(props);

		this._expenditureData = PsmStorage.getExpenditures();
		this._categoryData = PsmStorage.getCategories();

		// orderings
		this._orderByPriceAsc = 1		// Price ASC
	 	this._orderByPriceDsc = 2 	// Price DESC
	 	this._orderByAlphaAsc = 3		// alphabetical by category name ASC
	 	this._orderByAlphaDsc = 4 	// alphabetical by category name DESC
		this._orderings = {
			'Price Ascending': this._orderByPriceAsc,
			'Price Descending': this._orderByPriceDsc,
			'Alphabetical Ascending': this._orderByAlphaAsc,
			'Alphabetical Descending': this._orderByAlphaDsc
		};

		this.date = new Date();

		// try to show this month's spending data
		this.state = {
			period: (this.date.getMonth()+1) + '/' + (this.date.getFullYear()),	// TODO reconsider how to represent this
			data: (this._expenditureData[this.date.getFullYear()][this.date.getMonth()+1] || {}),
			viewType: 'text',
			orderBy: this._orderByAlphaAsc,
			orderByTitle: 'Alphabetical Ascending',
			orderings: Object.keys(this._orderings)
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
	// allows for ordering since this shows a list of items
	_generateTextView() {
		let totalAmountSpent = this._getCurrentTotalSpendingAmount();
		let averagePerDaySpent = (totalAmountSpent/(this.date.getDate())).toFixed(2);

		return(
			<View>
				<View>
					<Text 
						style={{
							color: 'blue'
						}}
						onPress={() => {
		          this.refs.orderByPicker.show();
		        }}>Order by: {this.state.orderByTitle}
		      </Text>
					<SimplePicker 
						style={{alignItems: 'center'}} 
						ref='orderByPicker' 
						options={this.state.orderings}
						onSubmit={this.onOrderByPickerSubmit.bind(this)} />
				</View>
				<ScrollView>
					<Text style={styles.header2}>Spending history for: {this.state.period}</Text>
					<Text style={styles.header3}>Total spent: ${totalAmountSpent}</Text>
					<Text style={styles.header3}>
						Average per day (as of {(this.date.getMonth()+1) + '/' + this.date.getDate()}): ${averagePerDaySpent}
					</Text>
					{this._generateTextPercentageView()}
				</ScrollView>
			</View>
		);
	}

	// Picker events
	onOrderByPickerSubmit(option) {
		if (option) {
			this.setState({
				orderBy: this._orderings[option],
				orderByTitle: option
			});
		}
	}

	// Private

	// generates a textual list of expenditures by category, and as percentages
	_generateTextPercentageView() {
		let categoriesWithPercents = [];		// will be an array of tuples [ ['food', #percentage], ... ]
		
		let totalAmountSpent = this._getCurrentTotalSpendingAmount();
		let amountByCategory = this._getSpendingsByCategory();	// { 'food': amountSpentForCategory }

		Object.keys(amountByCategory).forEach((key) => {
			categoriesWithPercents.push([key, parseFloat((amountByCategory[key]/totalAmountSpent*100).toFixed(3))]);
		});

		// order the results by the current orderBy state
		this._orderBy(categoriesWithPercents, this.state.orderBy);

		return(
			<View style={{marginVertical: 15}}>
				<Text style={styles.header3}>Breakdown by Percent:</Text>
				{categoriesWithPercents.map((tuple) => {
					return (
						<View key={tuple[0]} style={{flexDirection: 'row', paddingVertical: 5}}>
							<Text style={[{fontSize: 16}, styles.fontColorBlue]}>{tuple[0] + ': '}</Text>
							<Text>{tuple[1] + '%' }</Text>
							<Text style={{color:'red'}}>{'($' + amountByCategory[tuple[0]].toFixed(2) + ')'}</Text>
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

	/**
	 * Orders array of tuples depending on the specified parameters.
	 * Note that this function modifies the specified array.
	 *
	 * @param arrayOfTuples an array of tuples to order
	 * @param orderBy a value found in _orderBy*** to order the tuples by
	**/
	_orderBy(arrayOfTuples, orderBy) {
		let compareTo;

		// enumerate all possibilites, this is the easier to read
		if (orderBy == this._orderByAlphaAsc) {
	
			compareTo = (a,b) => {
				return a[0].localeCompare(b[0]);
			};
		} else if (orderBy == this._orderByAlphaDsc) {
	
			compareTo = (a,b) => {
				return 0 - a[0].localeCompare(b[0]);
			};
		} else if (orderBy == this._orderByPriceAsc) {
	
			compareTo = (a,b) => {
				return a[1] - b[1];
			};
		} else if (orderBy == this._orderByPriceDsc) {
	
			compareTo = (a,b) => {
				return b[1] - a[1]
			};
		} else {
			// invalid option, do nothing
			return;
		}

		arrayOfTuples.sort(compareTo);
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
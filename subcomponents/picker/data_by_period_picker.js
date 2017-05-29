import React from 'react';
import {
	Text,
	View
} from 'react-native';
import SimplePicker from 'react-native-simple-picker';

// modules
import PsmStorage from '../../modules/storage';

/**
 * Represents a picker for users to select a date period range. This should
 * be used wherever one wants users to be able to customize the date range
 * of data. Currently, this supports past month and past week views. This is the official representation
 * of data by period range.
 *
 * There are two possible props:
 *
 * defaultPeriod - the initial period range of the data (use static variables from this class)
 * onPick - callback function with one arg that will be called when user makes a selection with the picker
 *					Of form: (data) => {}
**/
class DataByPeriodPicker extends React.Component {
	static currentMonth = 'Month';
	static currentWeek = 'Week';

	constructor(props) {
		super(props);

		this.date = new Date();
		this._expenditureData = PsmStorage.getExpenditures();
		this.state = { 
			text: DataByPeriodPicker.currentMonth + ' view', 
			periods: [DataByPeriodPicker.currentMonth, DataByPeriodPicker.currentWeek]
		};

		console.log(this.state)
	}

	_onPick(option) {
		if (this.props.onPick) {
			this.props.onPick(this._getDataByRange(option));
			this.setState({ text: option + ' view' });
		}
	}

	// will always return something in the form: { '#dayOfMonth': [expenditure1, ...] }
	_getDataByRange(period) {
		let dataForCurrentMonth = this._expenditureData[this.date.getFullYear()][this.date.getMonth()+1];
		let data;

		if (period == DataByPeriodPicker.currentMonth) {
			data = dataForCurrentMonth;
		} else if (period == DataByPeriodPicker.currentWeek) {
			let currentDate = this.date.getDate();
			let firstDateOfWeek = this._getFirstDayOfWeek(this.date);
			let firstDayOfWeek = firstDateOfWeek.getDate();
			let daysInCurrentMonth = this._getNumberOfDaysForMonth(
				this.date.getMonth(), 
				this.date.getFullYear()
			);
			
			// if the days for this week is within the same month
			if (firstDayOfWeek + 6 <= daysInCurrentMonth && firstDayOfWeek <= currentDate) {
				let lastDateOfWeek = firstDateOfWeek + 6;
				data = {};

				for (let day = firstDateOfWeek; day <= lastDateOfWeek; day++) {
					if (dataForCurrentMonth[day]) {
						data[day] = dataForCurrentMonth[day];
					}
				}
			} else {
				// this means the days of this week span month boundaries

				// reset data
				data = {};

				// if week spans previous month
				if (firstDateOfWeek > currentDate) {					
					// include previous month's data
					let previousMonth = firstDateOfWeek.getMonth();
					let previousMonthYear = firstDateOfWeek.getFullYear();
					let previousMonthData = this._expenditureData[previousMonthYear][previousMonth];
					let numDaysInPreviousMonth = this._getNumberOfDaysForMonth(previousMonth, previousMonthYear);

					// include previous month's data if applicable
					if (previousMonthData) {
						for (let day = firstDateOfWeek; day <= numDaysInPreviousMonth; days++) {
							if (previousMonthData[day]) {
								data[day] = previousMonthData[day];
							}
						}
					}

					// lastDayOfWeek = -(numDaysIncludedAlready) + numDaysInAWeek
					let remainingDaysInPrevMonth = firstDateOfWeek.getDate() - numDaysInPreviousMonth + 6;

					// include current month's data
					for (let day = 1; day <= remainingDaysInPrevMonth; days++) {
						if (dataForCurrentMonth[day]) {
							data[day] = dataForCurrentMonth[day];
						}
					}
				} else {		// else week spans the next month
					

					// include current month's data
					for (let day = currentDate; day <= daysInCurrentMonth; days++) {
						if (dataForCurrentMonth[day]) {
							data[day] = dataForCurrentMonth[day];
						}
					}

					// include next month's data
					let remainingDaysInNextMonth = currentDate - daysInCurrentMonth + 6;
					let nextMonth = this.date.getMonth() + 1;
					let nextMonthYear = this.date.getFullYear();

					if (nextMonth > 11) {
						nextMonth = 0;
						nextMonthYear += 1;
					}

					let dataForNextMonth = this._expenditureData[nextMonthYear][nextMonth];

					if (dataForNextMonth) {
						for (let day = 1; day < remainingDaysInNextMonth; day++) {
							if (dataForNextMonth[day]) {
								data[day] = dataForNextMonth[day];
							}
						}
					}
				}
			}
		} else {
			// TODO: add other allowed periods
			data = dataForCurrentMonth;
		}

		return data;
	}

	// expects a 0-based number for month, and returns the number of days
	// in that month - for a given year
	_getNumberOfDaysForMonth(month, year) {
		// passing 0 as the day returns the last day number of the previous month
		return (new Date(year, (this.date.getMonth()+1)%12, 0)).getDay();
	}

	// given a year, mo, and some date in this month, return the Date
	// of the week (note that month boundaries are taken into consideration!)
	// @param date a Date object
	// @return a Date object representing the first date of the week
	_getFirstDayOfWeek(date) {
		let firstDay;
		let firstDayMonth;
		let firstDayYear;

		let currentMonth = date.getMonth();
		let currentDate = date.getDate();
		let currentDayOfWeek = date.getDay();

		let firstDayOfWeek = currentDate - currentDayOfWeek;

		if (firstDayOfWeek > 0) {
			firstDay = firstDayOfWeek;
			firstDayMonth = date.getMonth();
			firstDayYear - date.getFullYear();
		} else {				// spans boundary
			let previousMonth = currentMonth - 1;
			let previousMonthYear = date.getFullYear();

			if (currentMonth == 0) {
				previousMonth = 11;
				previousMonthYear = previousMonthYear - 1;

				firstDayMonth - previousMonth;
				firstDayYear = previousMonthYear;
			}

			firstDay = this._getNumberOfDaysForMonth(previousMonth, previousMonthYear) + firstDayOfWeek;
		}

		return new Date(firstDayYear, firstDayMonth, firstDay);
	}

	render() {
		return (
			<View>
				<Text 
						style={{
							color: 'blue'
						}}
						onPress={() => {
		          this.refs.dataByPeriodPicker.show();
		        }}> {this.state.text}
		      </Text>
					<SimplePicker
						style={{alignItems: 'center'}}
						ref='dataByPeriodPicker'
						options={this.state.periods}
						onSubmit={this._onPick.bind(this)} />
			</View>
		)
	}
}

export default DataByPeriodPicker;
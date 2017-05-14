import React from 'react';
import {
	Button,
	PickerIOS,
	Text,
	TextInput,
	View
} from 'react-native';
import SimplePicker from 'react-native-simple-picker';

// styles
import styles from '../../static/styles/styles';

// modules
import PsmStorage from '../../modules/storage';

class LogSpendingForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			amountInputValue: '',
			amountErrMsg: '',
			categoryInputValue: '',
			categoryErrMsg: '',
			categoryId: null,
			categoryTitles: []
		};
		
		// let's transform data to something that we can use more easily
		let categories = PsmStorage.getCategories();

		this._categoriesInverted = {};		// { 'category-name': categoryId }
		Object.keys(categories).forEach((key) => {
			this._categoriesInverted[categories[key]['title']] = key;
			this.state.categoryTitles.push(categories[key]['title']);
		});

		// sort alphabetically
		this.state.categoryTitles.sort();
	}

	onAmountTextChanged(text) {
		let currState = this.state;
		
		if (isNaN(text)) {
			currState.amountErrMsg = 'Not a valid amount!';
		} else {
			currState.amountErrMsg = '';
		}

		currState.amountInputValue = text.trim();
		this.setState(currState);
	}

	onCategoryTextCHanged(text) {
		// ideally at some point (probably in storage) we should validate that
		// no other category with this text (case insensitive) exists.
		// but we can still enforce it here by setting the categoryId state if we can

		let categoryId = null;
		if (this._categoriesInverted[text]) {
			categoryId = this._categoriesInverted[text];
		}

		this.setState({ 
			categoryInputValue: text.trim(), 
			categoryErrMsg: '', 
			categoryId: categoryId 
		});
	}

	onPickerSubmit(option) {
		if (option) {
			this.setState({
				categoryInputValue: option, 
				categoryId: this._categoriesInverted[option] 
			});
		}
	}

	logSpending() {
		let currState = this.state;
		let amountValueAsNum = +currState.amountInputValue;
		let category = currState.categoryInputValue;
		let self = this;

		if (amountValueAsNum > 0) {
			// get category id
			if (this.state.categoryId) {
				this._storeExpenditureHelper(amountValueAsNum, this.state.categoryId);
			} else if (this.state.categoryInputValue) {
				// else the category is a new one and not blank, store first
				PsmStorage.storeCategory(this.state.categoryInputValue, (err, categoryId) => {
					if (!err) {
						self._storeExpenditureHelper(amountValueAsNum, categoryId);

						// update UI category list and in-memory hash to possess the newly created category
						alert(JSON.stringify(category))
						self.state.categoryTitles.push(category);
						self.state.categoryTitles.sort();

						self.setState({ categoryTitles: self.state.categoryTitles });
						self._categoriesInverted[this.state.categoryInputValue] = categoryId;
					} else {
						// this may not work as intended since it is async
						currState.categoryErrMsg = 'Something went wrong with storing your category.';
					}
				});
			} else {
				currState.categoryErrMsg = 'Please enter or select a category.';
			}
		} else {
			currState.amountErrMsg = 'Please enter a value greater than 0.';
			currState.showLogResultMessage = false;
		}

		// reset form fields and associated state
		currState.amountInputValue = '';
		currState.categoryInputValue = '';
		currState.categoryId = null;

		this.setState(currState);
	}

	_storeExpenditureHelper(amount, categoryId) {
		let self = this;

		// store the record (key, amount, category id, callback)
		PsmStorage.storeExpenditure(new Date(), amount, categoryId, ((err, storedExpenditure) => {
			let msg = 'Successfully logged $' + 
								storedExpenditure.amount +
								' for ' + PsmStorage.getCategories()[storedExpenditure.category].title;
			if (err) {
				msg = 'Could not log this spending of: $' + storedExpenditure.amount +
				'. please try again later.';
			} 

			let currState = {};
			currState.showLogResultMessage = true;
			currState.logResultMessage = msg;

			self.setState(currState);
		}));
	}

	render() {
		return(
			<View style={{
				flex: 1, 
				flexDirection: 'column',
				paddingVertical: 10,
				width: this.props.formWidth
			}}>

				<View style={{
					marginBottom: 10
				}}>
					<Text>Amount</Text>
						<TextInput 
							style={[styles.textInput, {width: this.props.formWidth}]}
							keyboardType='numeric'
							placeholder={this.props.amountInputPlaceholder}
							onChangeText={this.onAmountTextChanged.bind(this)}
							value={this.state.amountInputValue} />
					<Text style={[styles.error]}>{this.state.amountErrMsg}</Text>
				</View>

				<View style={{
					marginBottom: 10
				}}>
					<Text>Category</Text>
					<TextInput 
						style={[styles.textInput, {width: this.props.formWidth}]}
						placeholder={this.props.categoryInputPlaceholder} 
						onChangeText={this.onCategoryTextCHanged.bind(this)}
						value={this.state.categoryInputValue} />

					<Text style={{marginVertical: 10}}>-- OR --</Text>

					<Text 
						style={{
							color: 'blue'
						}}
						onPress={() => {
	            this.refs.categoryPicker.show();
	          }}>Select a category</Text>
					<SimplePicker 
						style={{alignItems: 'center'}} 
						ref='categoryPicker' 
						options={this.state.categoryTitles}
						onSubmit={this.onPickerSubmit.bind(this)} />

					<Text style={styles.error}>{this.state.categoryErrMsg}</Text>
				</View>
				
				<Button 
		 			onPress={this.logSpending.bind(this)}
		 			title='Save' 
		 			accessibilityLabel='Save' />

	 			{(this.state.showLogResultMessage) ? (<Text>{this.state.logResultMessage}</Text>) : null}
			</View>
		)
	}

}

export default LogSpendingForm;
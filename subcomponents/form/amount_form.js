import React from 'react';
import {
	Button,
	StyleSheet,
	Text,
	TextInput,
	View
} from 'react-native';
import styles from '../../static/styles/styles';

// modules
import PsmStorage from '../../modules/storage';

/**
 * The amount form for logging user spending.
**/
class AmountForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			errorMsg: '',
			value: '0'
		};
	}

	onTextChanged(text) {
		let currState = this.state;
		
		if (isNaN(text)) {
			currState.errorMsg = 'Not a valid amount!';
		} else {
			currState.errorMsg = '';
		}

		currState.value = text;
		this.setState(currState);
	}

	logSpending() {
		let currState = this.state;
		let valueAsNum = +currState.value;
		if (valueAsNum > 0) {
			// store the record (key, amount, category id)
			PsmStorage.storeExpenditure(''+ new Date(), valueAsNum, 0);
		} else {
			currState.errorMsg = 'Please enter a value greater than 0.';
		}

		this.setState(currState);
	}

	render() {
		return(
			<View style={{
				flex: 1,
				flexDirection: 'column',
				alignItems: 'center'
			}}>
				<View style={{
					flexDirection: 'row',
					padding: 15
				}}>
					<Text style={{fontSize: 30}}>$</Text>

					<TextInput 
						style={{
							width: 100, 
							height: 40, 
							borderColor: 'gray', 
							borderWidth: 2, 
							padding: 2
						}}
						keyboardType='numeric'
						placeholder={this.props.textInputPlaceholder}
						onChangeText={this.onTextChanged.bind(this)} />
				</View>

				<Text style={styles.error}>{this.state.errorMsg}</Text>

				<Button 
		 			onPress={this.logSpending.bind(this)}
		 			title={this.props.buttonTitle} 
		 			accessibilityLabel={this.props.buttonAccessibilityLabel} />
			</View>
		);
	}
}

export default AmountForm;
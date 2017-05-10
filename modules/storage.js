/**
 * Storage module class. Exposes static methods for storing and
 * retrieving any locally stored data for the app.
 *
 * The storage schema is in the form:
 *
 *		'categories': {
 *			0: {										// category id
 *				title: 'Food'					// custom title for the category
 * 			}
 *	 	}		
 *
 *		'expenditures': {
 *			'2017': {
 *				'05': {
 *					'23': [
 *						{ amount: 100.00, category: 0, timestamp: DateString },
 *						...						
 *					]
 *				}
 *			},
 *			...
 *		}
**/
class PsmStorage {
	static loadStorage() {
		this.expenditures = this.expenditures || 'expenditures'; // TODO
		this.categories = this.categories || 'categories'; // TODO
	}

	// key is a Date object, with at least YY/MM/dd set
	static storeExpenditure(key, categoryId, amount) {
		this.loadStorage();

		let entry = {
			amount: amount,
			category: categoryId,
			timestamp: new Date()
		};

		alert('Going to store: ' + key + ", " + JSON.stringify(entry));
	}

	// key is a Date object, with at least YY/MM/dd set
	static getExpenditure(key) {
		this.loadStorage();

		alert('Get: ' + key);
	}
}

export default PsmStorage;
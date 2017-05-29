import { AsyncStorage } from 'react-native';

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
const EXPENDITURES_KEY = 'expenditures';
const CATEGORIES_KEY = 'categories';

class PsmStorage {

	_expenditures: null
	_categories: null

	// for storing items, with optional callback
	// callback is invoked with the stored value
	// throws an error
	_store(key, value, callback) {
		AsyncStorage.setItem(key, value, (error) => {
			if (error) {
				throw new Error('Could not store item with key: ' + key);
			}

			if (callback) {
				callback(value);
			}
		});
	}

	// for retrieving items from storage, with optional callback
	// callback is invoked with the retrieved value
	_get(key, callback) {
		AsyncStorage.getItem(key, (error, result) => {
			if (error) {
				throw new Error('Could not retrieve item with key: ' + key);
			}

			if (callback) {
				callback(JSON.parse(result));
			}
		});
	};
	
	/** 
	 * Unless it already exists, initializes the storage schema and then loads 
	 * storage into main memory.
	 *
	 * Should be called only once - when the entire app starts, though this operation is idempotent.
	 *
	 * @param callback an optional callback function that will be invoked with (error) if there are any
	 * errors. This will be called after ALL operations are complete.
	**/
	initialize(callback) {
		const self = this;

		let generateAsyncStoragePromise = ((key) => {
			let promise = new Promise((resolve, reject) => {
				AsyncStorage.getItem(key, (error, result) => {
					if (error) {
						alert(error.message);
						throw error;
					}
					
					// if result is null, there is no record of expenditures/categories, 
					// create a new one and store
					if (result == null) {
						result = JSON.stringify({});
						AsyncStorage.setItem(key, result, (error) => {
							if (error) {
								alert(error.message);
							}

							resolve(result);	// we are done!
						});
					} else {
						resolve(JSON.parse(result));
					}
				});
			});

			return promise;
		});

		let storageRequestPromises = [];
		storageRequestPromises.push(generateAsyncStoragePromise(EXPENDITURES_KEY));
		storageRequestPromises.push(generateAsyncStoragePromise(CATEGORIES_KEY));

		Promise.all(storageRequestPromises).then((values) => {
			self._expenditures = values[0]['expenditures'] || values[0];	// || 'expenditures' DNE
			self._categories = values[1]['categories'] || values[1];

			if (callback) {
				callback();
			}
		}, (error) => {
			if (callback) {
				callback({ message: 'Could not finish loading your data: ' + error });
			}
		});
	}

	/**
	 * Clears all locally persisted data.
	 *
	 * @param callback optional callback that will be invoked with error if any.
	 *				(err) => {}
	**/
	clearData(callback) {
		let clearCategoriesPromise = new Promise((resolve, reject) => {
			AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify({}), (err) => {
				if (err) {
					reject('There was an issue with clearing category data: ' + err.message);
				}

				resolve(null);
			});
		});

		let clearExpendituresPromise = new Promise((resolve, reject) => {
			AsyncStorage.removeItem(EXPENDITURES_KEY, (err) => {
				if (err) {
					reject('There was an issue with clearing expenditure data: ' + err.message);
				}

				resolve(null);
			});
		});

		Promise.all([clearExpendituresPromise, clearExpendituresPromise]).then(
			(values) => {
				if (callback) {
					callback(null);
					this._categories = {};
					this._expenditures = {};
				}
			}, (reason) => {
				if (callback) {
					callback({ message: reason });
				}
			});
	}

	/**
	 * Stores a new Expenditure.
	 *
	 * @param key a Date object with at least YYYY/dd/MM set
	 * @param amount a Number representing the amount of the expendture
	 * @param categoryId the id of the category for this expenditure
	 * @param callback an optional callback function that will be passed the stored record of
	 * 				the saved expenditure, or nil if error. 
	 *				Expects a function of the form (err, storedExpenditure) => {}
	**/
	storeExpenditure(key, amount, categoryId, callback) {
		if (this._expenditures == null) {
			alert('Uh oh! Your spending data has not been loaded! Please restart the app.');
			return;
		}

		let entry = {
			amount: amount.toFixed(2),
			category: categoryId,
			timestamp: new Date().toJSON()
		};

		let year = key.getFullYear();
		let month = key.getMonth() + 1;	// 0-based
		let dayOfMonth = key.getDate();

		this._expenditures[year] = this._expenditures[year] || {};
		this._expenditures[year][month] = this._expenditures[year][month] || {};
		this._expenditures[year][month][dayOfMonth] = this._expenditures[year][month][dayOfMonth] || [];

		// update in memory!
		this._expenditures[year][month][dayOfMonth].push(entry);

		// do the storing, but let it complete asynchrounously
		try {
			let storeExpenditureCallback = ((value) => {
				if (callback) {
					callback(null, entry);
				}
			});

			this._store(EXPENDITURES_KEY, JSON.stringify(this._expenditures), storeExpenditureCallback);
		} catch(e) {
			if (callback) {
				callback(e, null);
			}
		}
	}

	/**
	 * Stores a new category.
	 *
	 * @param title the title of the category as it appears for the user
	 * @param callback an optional callback function that will be passed the category id of
	 * 				the saved category, or nil if error. 
	 *				Expects a function of the form (err, categoryId) => {}
	**/
	storeCategory(title, callback) {
		if (this._categories == null) {
			alert('Uh oh! Your category data has not been loaded! Please restart the app.');
			return;
		}

		let entry = {
			title: title
		};

		// finds the next id (1 + the largest id so far) to use
		let findNextCategoryId = () => {
			let max = 0;
			let ids = Object.keys(this._categories);

			if (ids.length > 1) {
				max = ids.reduce((a, b) => {
					return Math.max(a, b);
				});
			}

			return max + 1;
		};

		// store in main memory!
		let nextCategoryId = findNextCategoryId();
		this._categories[nextCategoryId] = entry;

		// asynchronously store category
		try {
			let storedCategoryCallback = (() => {
				if (callback) {
					callback(null, nextCategoryId);
				}
			});

			this._store(CATEGORIES_KEY, JSON.stringify(this._categories), storedCategoryCallback);
		} catch(e) {
			if (callback) {
				callback(e, null);
			}
		}
	}

	/* Getters */

	getExpenditures() {
		return this._expenditures;
	}

	getCategories() {
		return this._categories;
	}
}

let psmStorage = new PsmStorage();

export default psmStorage;
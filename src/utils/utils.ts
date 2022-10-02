/***** TYPES ****/
interface IDateStrings {
    fromDate: string;
    toDate: string;
}


/***** FUNCTIONS *****/

/**
 * Adds zero in front of a number if it is lower than 10.
 * @param {number} number to add zero to.
 * @return {string} zerofied-number as string.
 */
export const addZero = (number: number): string => {
	//Returns '0' if number is not number, and also can't be parsed into a number;
	if(typeof number !== 'number') {
		number = parseInt(number);
		if(!number || isNaN(number)) return '0';
	}

	//Ads a '0' if lower then 10.
	return number < 10 && number > 0
		? '0' + Math.floor(number).toString()
		: Math.floor(number).toString();
};


/**
 * Function for getting date-strings for fetching team-matches.
 * @returns {IDateStrings}
 */
export const getDates = (): IDateStrings => {
	const now = new Date();
	const year = now.getFullYear();
	const month = addZero(now.getMonth() + 1);
	const day = addZero(now.getDate());
	const fromDate = `${year}-${month}-${day}`;
	const toDate = `${year + 2}-${month}-${day}`;

	return {fromDate, toDate};
};

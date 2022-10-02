/**
 * Adds zero in front of a number if it is lower than 10.
 * @param {number} number to add zero to.
 * @return {string} zerofied-number as string.
 */
export const addZero = (number: number): string => {
	if(typeof number !== 'number') {
		number = parseInt(number);
		if(!number || isNaN(number)) return '0';
	}

	return number < 10 && number > -1
		? '0' + Math.floor(number).toString()
		: Math.floor(number).toString();
};
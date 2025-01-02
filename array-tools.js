/**
 * Sorts an array of objects based on multiple fields with custom sorting logic
 * @param {Array<Object>} arr - Input array of objects to sort
 * @param {Array<{field: string, direction?: 'asc'|'dsc'}>} fields - Sorting criteria. Default: 'asc'
 * @param {{locale?: string}} options - Language setting for sorting
 * @returns {Array<Object>} - New sorted array
 */
function customSort(arr, fields, options = { locale: 'en' }) {
    return [...arr].sort((a, b) => {
        for (const {field, direction = 'asc'} of fields) {
            const compareResult = typeof a[field] === 'string'
                ? a[field].localeCompare(b[field], options.locale)
                : a[field] - b[field];

            if (compareResult !== 0){
                return direction === 'asc' ? compareResult: -compareResult;
            }
        }
        return 0;
    });
}

/**
 * @param {Array<{}>} arr 
 * @param {Array<{field: string, direction?: 'asc'|'dsc'}>} sortOrder Default: 'asc'
 * @param {Object} entryDetails 
 */
function addEntry(arr, sortOrder, entryDetails){
    if (lookupFns.lookupEntry(arr, entryDetails)){
        console.log(`Entry: ${JSON.stringify(entryDetails)} already exists`);
    } else {
        const insertIndex = newEntryIndex(arr, sortOrder, entryDetails);
        arr.splice(insertIndex, 0, entryDetails);
    }
}

/**
 * @param {Array<{}>} arr 
 * @param {Array<{field: string, direction?: 'asc'|'dsc'}>} sortOrder Default: 'asc'
 * @param {Object} entryDetails 
 * @returns {number} - Index where the new entry should be inserted
 */
function newEntryIndex(arr, sortOrder, entryDetails) {
    for (let i = 0; i < arr.length; i++) {
        const current = arr[i];
        for (const {field, direction = 'asc'} of sortOrder) {
            const isDescending = direction === 'dsc';
            const comparison = isDescending
            ? current[field] < entryDetails[field]
            : current[field] > entryDetails[field];

            if (comparison) {
                return i;
            }
            else if (current[field] !== entryDetails[field]) {
                break;
            }
        }
    }
    return arr.length;
}

/**
 * Collection of lookup functions for array operations
 * @type {{
*   lookupEntry: (arr: Array<Object>, entryDetails: Object) => Object|undefined,
*   filterBy: (arr: Array<Object>, criteria: Object) => Array<Object>
* }}
*/
const lookupFns = {
    lookupEntry(arr, entryDetails) {
        return arr.find(i => {
            return Object.entries(entryDetails).every(([key, value]) => i[key] === value);
        });
    },

    filterBy(arr, criteria) {
        return arr.filter(i => {
            return Object.entries(criteria).every(([key, value]) => i[key] === value);
        });
    }
    
}


 //Example use:
const people = [
    {name: 'Fred', age: 23, sex: 'M'},
    {name: 'Ola', age: 23, sex: 'M'},
    {name: 'Sara', age: 30, sex: 'F'},
    {name: 'Pia', age: 32, sex: 'F'},
    {name: 'Gregor', age: 45, sex: 'M'},
    {name: 'Janek', age: 14, sex: 'M'},
    {name: 'Åsa', age: 44, sex: 'F'},
];

const sortOrder = [
    { field: 'sex' },
    { field: 'age' , direction: 'dsc' },
    { field: 'name', direction: 'asc' }
];

const sortedPeople = customSort(people, sortOrder, { locale: 'sv' }, valuesCompare);


const entryDetails = {name:'Ola', age: 24, sex: 'M'}
addEntry(sortedPeople, sortOrder, entryDetails);

const olas = lookupFns.filterBy(sortedPeople, {name: 'Ola'});
const women = lookupFns.filterBy(sortedPeople, {sex: 'F'});
console.table(sortedPeople);
console.table(olas);
console.table(men);
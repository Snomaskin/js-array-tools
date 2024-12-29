/**
 * 
 * @param {Array<{}>} arr 
 * @param {Array<{ field: string, direction?: string }>} fields // Sorting hierarchy: {field1: color} -> {field2: shape} etc.
 * @param {{ locale?: string }} options 
 * @param {(a: any, b: any, options: Object) => number} compareFn
 * @returns {Array<{}>} // Sorted array
 */
function customSort(arr, fields, options = { locale: 'en' }, compareFn){
    return [...arr].sort((a, b) => {
        for (const {field, direction = 'asc'} of fields){
            const compareResult = compareFn(a[field], b[field], options)
            if (compareResult !== 0){
                return direction === 'asc' ? compareResult: -compareResult;
            }
        }
        return 0;
    });
}

function compareValues(a, b, options) {
    if (typeof a === 'string' && typeof b === 'string'){
        return a.localeCompare(b, options.locale);
    }
    return a - b;
}

/**
 * @param {Array<{}>} arr 
 * @param {{}} entryDetails 
 * @param {(arr: Array<{}>, entryDetails: {}) => boolean} lookupFn
 * @param {(arr: Array<{}>, entryDetails: {}) => number} compareFn 
 */

function addEntry(arr, entryDetails, lookupFn, compareFn){
    if (lookupFn(arr, entryDetails)){
        console.log(`Entry: ${JSON.stringify(entryDetails)} already exists`);
    } else {
        const insertIndex = compareFn(arr, entryDetails);
        arr.splice(insertIndex, 0, entryDetails);
    }
}
/**
 * @param {Array<{}>} arr 
 * @param {{}} entryDetails 
 * @param {string} name
 */
const peoplesFns = {
    peopleCompare(arr, entryDetails) {
        return arr.findIndex(i => 
            i.sex > entryDetails.sex || 
            (i.sex === entryDetails.sex && i.age > entryDetails.age) || 
            (i.sex === entryDetails.sex && i.age === entryDetails.age && i.name > entryDetails.name)
            );
    },

    peopleLookup(arr, entryDetails) {
        return arr.find(i => {
            return i.name === entryDetails.name && 
            i.age === entryDetails.age && 
            i.sex === entryDetails.sex;
            });
    }
}




const people = [
    {name: 'Fred', age: 23, sex: 'M'},
    {name: 'Ola', age: 23, sex: 'M'},
    {name: 'Sara', age: 30, sex: 'F'},
    {name: 'Pia', age: 32, sex: 'F'},
    {name: 'Gregor', age: 45, sex: 'M'},
    {name: 'Janek', age: 14, sex: 'M'},
    {name: 'Åsa', age: 44, sex: 'F'},
]

const sortedPeople = customSort(people, [
    { field: 'sex' },
    { field: 'age' },
    { field: 'name', direction: 'asc' }
  ], { locale: 'sv' }, compareValues);


const entryDetails = {name:'Ola', age: 23, sex: 'M'}
addEntry(sortedPeople,
        entryDetails,
        peoplesFns.lookupPeople,
        peoplesFns.peopleCompare);
console.table(people);
console.table(sortedPeople)

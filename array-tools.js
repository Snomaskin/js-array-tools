/**
 * @param {Array<{name: string, age: number, sex: string}>} arr 
 * @param {'byAge'|'byName'} how
 */
function sortArr(arr, how = 'byAge'){
    if (how === 'byAge'){
        arr.sort((a, b) => {
            let sexCompare = a.sex.localeCompare(b.sex);
            if (sexCompare !== 0) return sexCompare;

            let ageCompare = a.age - b.age;
            if (ageCompare !== 0) return ageCompare;

            return a.name.localeCompare(b.name, 'sv');
        })
    }
    if (how === 'byName'){
        arr.sort((a, b) =>{
            let sexCompare = a.sex.localeCompare(b.sex);
            if (sexCompare !== 0) return sexCompare;

            let nameCompare = a.name.localeCompare(b.name, 'sv');
            if (nameCompare !== 0) return nameCompare;

            return a.age - b.age;
        })
    }
}

/**
 * 
 * @param {Array<{name: string, age: number, sex: string}>} arr 
 * @param {string} name 
 * @param {int} [age] 
 * @param {string} [sex] 
 */
function addName(arr, name, age, sex){
    if (arr.find(i => {
        return i.name === name && 
        i.age === age && 
        i.sex === sex;
    })){
        console.log('Name already exists');
    } else {
        insertSorted(arr, name, age, sex)
    }
}

function insertSorted(arr, name, age, sex){
    const index = arr.findIndex(i => 
        i.sex > sex || 
        (i.sex === sex && i.age > age) || 
        (i.sex === sex && i.age === age && i.name > name)
    );
    console.log(index)

    arr.splice(index, 0, {name: name, age: age, sex: sex})
}

/**
 * @param {Array<{name: string, age: number, sex: string}>} arr
 * @param {string} name 
 * @returns {{name: string, age: number, sex: string}}
 */
const lookup = (arr, name) => arr.find(i => i.name === name);



const arr = [
    {name: 'Fred', age: 23, sex: 'M'},
    {name: 'Ola', age: 23, sex: 'M'},
    {name: 'Sara', age: 30, sex: 'F'},
    {name: 'Pia', age: 32, sex: 'F'},
    {name: 'Gregor', age: 45, sex: 'M'},
    {name: 'Janek', age: 14, sex: 'M'},
    {name: 'Åsa', age: 44, sex: 'F'},
]

sortArr(arr, 'byName')
addName(arr, 'Ola', 23, 'M')
console.table(arr)

lookup(arr, 'Ola')
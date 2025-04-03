interface CompareValues<T> {
  objectA: T;
  objectB: T;
  fields: { field: keyof T, direction?: 'asc' | 'dsc' }[];
  options?: { locale?: string };
};
function compareValues<T>(params: CompareValues<T>): number {
  const { objectA, objectB, fields, options = { locale: 'en' } } = params;
  for (const {field, direction = 'asc'} of fields) {
    const valueA = objectA[field];
    const valueB = objectB[field];

    let compareResult: number;
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      compareResult = valueA.localeCompare(valueB, options.locale)
    } else if (typeof valueA === 'number' && typeof valueB === 'number') {
      return compareResult = valueA - valueB;
    } else {
      return compareResult = String(valueA).localeCompare(String(valueB), options.locale)
    }
    if (compareResult !== 0) {
      return direction === 'asc' ? compareResult : -compareResult;
    }
  }
  return 0;
}

interface CustomSort<T> {
  arr: T[];
  fields: { field: keyof T, direction?: 'asc' | 'dsc' }[];
  options?: { locale?: string }; 
}
function customSort<T>({ arr, fields, options = { locale: 'en' } }: CustomSort<T>): T[] {
  return [...arr].sort((a, b) => {
      return compareValues({objectA: a, objectB: b, fields, options});
    });
}

interface LookupFns<T> {
  lookupEntry: (arr: T[], entryDetails: Partial<T>) => T | undefined;
  filterBy: (arr: T[], criteria: Partial<T>) => T[];
};
function createLookupFns<T>():LookupFns<T> {
  return {
    lookupEntry(arr, entryDetails) {
      return arr.find(i => {
          return Object.entries(entryDetails).every(
            ([key, value]) => i[key as keyof T] === value
          );
      });
    },

    filterBy(arr, criteria) {
        return arr.filter(i => {
            return Object.entries(criteria).every(
              ([key, value]) => i[key as keyof T] === value
            );
        });
    }
  };
}

interface AddEntry<T> {
  arr: T[];
  sortOrder: { field: keyof T, direction?: 'asc' | 'dsc' }[];
  entryDetails: T;
};
function newEntryIndex<T>({ arr, sortOrder, entryDetails }: AddEntry<T>): number {
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const compareResult = compareValues({
      objectA: current, 
      objectB: entryDetails, 
      fields: sortOrder})
      if (compareResult > 0) {
        return i;
      }
  }
  return arr.length;
}

function addEntry<T>({ arr, sortOrder, entryDetails }: AddEntry<T>): void {
  const lookupFns = createLookupFns<T>()
  if (lookupFns.lookupEntry(arr, entryDetails)) {
      console.log(`Entry: ${JSON.stringify(entryDetails)} already exists`);
  } else {
      const insertIndex = newEntryIndex({arr, sortOrder, entryDetails});
      arr.splice(insertIndex, 0, entryDetails);
  }
}

interface Person {
  name: string;
  age: number;
  sex: string;
};
const people: Person[] = [
  {name: 'Fred', age: 23, sex: 'M'},
  {name: 'Ola', age: 23, sex: 'M'},
  {name: 'Sara', age: 30, sex: 'F'},
  {name: 'Pia', age: 32, sex: 'F'},
  {name: 'Gregor', age: 45, sex: 'M'},
  {name: 'Janek', age: 14, sex: 'M'},
  {name: 'Åsa', age: 44, sex: 'F'},
];

const sortOrder: AddEntry<Person>['sortOrder'] = [
  { field: 'sex' },
  { field: 'age' , direction: 'dsc' },
  { field: 'name', direction: 'asc' }
];

const sortedPeople = customSort<Person>({arr: people, fields: sortOrder, options: { locale: 'sv' }});


const entryDetails = {name:'Ola', age: 24, sex: 'M'}
addEntry({arr: sortedPeople, sortOrder, entryDetails});

const { lookupEntry, filterBy } = createLookupFns<Person>();

const olas = filterBy(sortedPeople, {name: 'Ola'});
const women = filterBy(sortedPeople, {sex: 'F'});
console.table(sortedPeople);
console.table(olas);
console.table(women);
//p.172
//map : key - value
const family = new Map();

family.set('Dad', 40);
family.set('Mom', 39);
family.set('Son', 12);

console.log(family);
console.log(family.size);

family.forEach((val, key) => console.log(key, val));

for(const [key, val] of family){
    console.log(key, val);
}

//weakMap
let dad = {
    name : 'Daddy',
};

let mom ={
    name : 'Mummy',
};

const myMap = new Map();
const myWeakMap = new WeakMap();

myMap.set(dad, "any Val");
myWeakMap.set(mom, "any Val");

dad = null;
mom = null;

console.log(myMap);
console.log(myWeakMap); //mom이 null이 되어 weakMap에서도 삭제됨
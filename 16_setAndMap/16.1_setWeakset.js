//p.172
//set : 어떠한 자료형의 값이든 각 원소를 고유하게 저장하는 객체 --> 중복X

const family = new Set();
family.add('Dad');
console.log(family);

family.add('Mom');
console.log(family);

family.add('Son');
console.log(family);

family.add('Dad');
console.log(family);

let famFunctions = family.size;
console.log(famFunctions);

famFunctions = family.keys();   //set에는 key가 없기 때문에 .value()와 결과가 같음
console.log(famFunctions);

famFunctions = family.entries();
console.log(famFunctions);

famFunctions = family.values();
console.log(famFunctions);

family.delete("Dad");
console.log(family)

// family.clear();
console.log(family);


//loop for set : .next(), for of
const iterator = family.values();
console.log(iterator.next().value);
console.log(iterator.next().value);
console.log(iterator.next());

for(const person of family){
    console.log(person);
}


//set을 활용해 array에서 중복 제거
const ary = ['dad', 'mom', 'son', 'dad', 'mom', 'daughter'];

const set = new Set(ary);
console.log(set);
const uniqueAry = Array.from(set);
console.log(uniqueAry);

//one line code
const uniqAry = Array.from(new Set(ary));
console.log(uniqAry);


//p.174
//weakSet : set과 유사하지만 객체만 포함 가능
let dad = {name : "Daddy", age : 60};
let mom = {name : "Mummy", age :60};

const family2 = new WeakSet([dad, mom]);
console.log(family2);

dad = null;     //dad 객체가 garbage collector에 의해 삭제되면 해당 객체는 weakSet에서도 자동 삭제된다.
console.log(family2);
//브라우저 콘솔에서 faimly2 확인해보면 dad가 빠진 weakSet을 확인할 수 있다.

// for(const person of family2){
//     console.log(person);
// }
//Uncaught TypeError : family2 is not iterable
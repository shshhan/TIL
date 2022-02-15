//p.126
//Symbol : unique --> 객체 속성의 식별자로 사용 가능
const me = Symbol("Shawn");
console.log(me);

const clone = Symbol("Shawn");
console.log(clone);

//두 Symbol의 값은 동일하지만 Symbol은 항상 고유하므로 다른 Symbol과 겹치지 않는다.
console.log(me == clone);   //false
console.log(me === clone);  //false


//객체 속성에 대한 식별자
const office = {
    "Tom" : "CEO",
    "Mark" : "CTO",
    "Mark" : "CIO",
}

for(person in office){
    console.log(person);
}

//사무실 객체의 세개의 속성 중 두 속성의 이름이 같다.
//이럴 때 Symbol 사용
const off = {
    [Symbol("Tom")] : "CEO",
    [Symbol("Mark")] : "CTO",
    [Symbol("Mark")] : "CIO",
};

const symbols = Object.getOwnPropertySymbols(off);
console.log(symbols);

const value = symbols.map(symbol => off[symbol]);
console.log(value);
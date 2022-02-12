//p.92
//destructuring : 배열의 값 또는 객체의 속성을 풀어서 별개의 변수로 쓸 수 있게 해주는 표현식

//ES5
var person = {
    first : "Shawn",
    last : "Seoul",
};

var first = person.first;
var last = person.last;

console.log(first);
console.log(last);

//ES6
const person2 = {
    name2 : "Shawn",
    city2 : "Seoul",
};

//person2가 가진 속성에 접근함과 동시에 해당 속성 이름으로 변수 선언 가능
const {name2, city2} = person2
console.log(name2);
console.log(city2);

const person3 ={
    name3 : "Shawn3",
    city3 : "Seoul3",
    links : {
        social : {
            facebook : 'https://fb.com/Shawn',
            instagram : 'https://inst.com/Shawn',
        },
        website : 'https://shawn.com',
    }
};

const {name3} = person3;
const {links} = person3;
const {social} = person3.links;
const {facebook : fb} = person3.links.social;
//person3.links.social.facebook 프로퍼티를 찾아 fb라는 변수로 명명
const {line : ln = 'https://line.com/Shawn'} = person3.links.social;
//person3.links.social.line 프로퍼티를 찾아 ln이라는 변수로 명명 + 기본값 전달
console.log(person3);
console.log(name3);
console.log(links);
console.log(social);
console.log(fb);
console.log(ln);

//p.94
//array desctructuring
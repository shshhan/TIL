//p.76

//1. 문자열 삽입
//ES5
var nameVar = "Alberto";
var greetingVar = 'Hello my name is ' + nameVar;
console.log(greetingVar);

//ES6
let myName = "Alberto";
const greeting = `Hello my name is ${myName}`;

console.log(greeting);

//표현식 삽입
//ES5
var a = 1;
var b = 2;
console.log('1 * 2 is ' + (a*b));

//ES6
let c = 3;
let d = 4;
console.log(`3 * 4 is ${c*d}`);


//여러 줄 문자열 생성
//이건 뭔지 잘 이해가 안간다.  복습필요
let elP = document.getElementById('spanText');
console.log(elP);

// //ES5
// var text = "hello, \ 
// my name is Alberto \ 
// how are you?\ ";
// elP.innerHTML= text;

//ES6
const content = `hello,
my name is Shawn.
how are you?`;
elP.innerHTML = content;

//중첩 템플릿
const people = [{
    name : 'Shawn',
    age : 28,
}, {
    name : 'Jack',
    age : 25,
}, {
    name : 'Kim',
    age : 32,
}];

const markup = `
    <ul>
        ${people.map(person => `<li> ${person.name}</li>`)}
    </ul>
    `;

const ulP = document.getElementById('ulP');
ulP.innerHTML=markup;
console.log(markup);


//p.78
//ternary operator (삼항연산자)
const isDiscounted = false;

function getPrice(){
    console.log(isDiscounted ? "$10" : "$20");
}
getPrice(); //$20


//name, age와 함께 artist를 생성
let artist = {
    name : "Bon Jovi",
    age : 56,
};

//artist 객체에 song 프로퍼티가 있을 때만 문장에 추가하고,
//없으면 아무것도 반환하지 않음
// const text = `
// <div>
//     <p> ${artist.name} is ${artist.age} years old ${artist.song ? `and wrote the song ${artist.song}` : ''}
//     </p>
// </div>
//     `;

let div1 = document.createElement('div');
let p1 = document.createElement('p');
let p2 = document.createElement('p');

div1.appendChild(p1);
div1.appendChild(p2);

document.body.appendChild(div1);

p1.innerHTML = `${artist.name} is ${artist.age} years old ${artist.song ? `and wrote the song ${artist.song}` : ''}`;

artist = {
    name : "Trent Reznor",
    age : 53,
    song : 'Hurt',
};

p2.innerHTML = `${artist.name} is ${artist.age} years old ${artist.song ? `and wrote the song ${artist.song}` : ''}`;


//p.80
//필요하다면 템플릿 리터럴 내에 함수를 전달할 수도 있다.
const groceries = {
    meat : "pork chop",
    veggie : "salad",
    fruit : "apple",
    others : ['mushrooms', 'instant noodles', 'instant soup'],
};

function groceryList(others){
    let gList = document.createElement('p');

    others.map(other =>{
        let sp = document.createElement('span');
        sp.innerHTML=`${other} \n`; //개행이 왜 안될까...
        gList.appendChild(sp);
    });

    return gList;
}

let div3 = document.createElement('div');
div3.appendChild(groceryList(groceries.others));

document.body.appendChild(div3);
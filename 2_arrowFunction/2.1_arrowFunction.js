//p.60
//arrow function

const greeting = function(name){
    return "hello " + name;
};

console.log(greeting("shawn"));

// var greetingArrow = () => {       //매개변수가 전혀 없으면 빈 괄호
// var greetingArrow = name => {    //매개변수가 하나면 괄호 생략 가능
var greetingArrow = (name) => {
    // return `hello ${name}`;  //이렇게 쓰는건 어떤 경우지?
    return "hello " + name;
};

console.log(greetingArrow("shawn2"));

//p.61
//암시적 반환
const greet = name => `hello ${name}`;

console.log(greet("shawn3"));

//ES5의 함수 선언 방식과 ArrowFunctino비교
//결과는 모두 같지만 훨씬 간결해진다
const oldFunction = function(name){
    return "hello " + name;
}
const arrowFunction = name => `hello ${name}`;


const race = "100m dash";
const runners = ["Usain Bolt", "Justin Gatlin", "Asafa Powell"];

const results = runners.map((runner,i) => ({name : runner, race, place : i + 1}));

console.log("results : ", results);

//runners.map()함수가 iteration이라고 하는데 어떤 기능인지 자세히 알아봐야겠다.
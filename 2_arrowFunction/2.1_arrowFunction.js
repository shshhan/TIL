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

//p.40

let myInt = 1;

function increase(value){
    return value += 1;
}

console.log(myInt);          //1
console.log(increase(myInt));//2
console.log(myInt);          //1

////////////////////////////////////

let myCar = {
    maker : "bmw",
    color : "red",
};

console.log(myCar);

function changeColor(car){
    car.color = "blue";
}

changeColor(myCar);
console.log(myCar);

//p.41

//function expression
const greeter1 = function greet(name){
    console.log("hello " + name);
};

greeter1("Shawn_greeter");
// greet("Shawn_greet"); //error

//anonymous function
const greeter2 = function(name){
    console.log("hello " + name);
};
greeter2("Shawn2");

//arrow function
const greeter3 = (name) =>{
    console.log("hello " + name);
};
greeter3("Shawn3");
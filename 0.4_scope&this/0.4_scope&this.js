//p.42
//scope var : global scope
//scope let : block scope

var myInt = 1;

if(myInt == 1){
    var mySecondInt = 2;
    let myThirdInt = 3;
    console.log("secondInt : ", mySecondInt);
    console.log("thirdInt : ", myThirdInt);
}

console.log("secondInt : ", mySecondInt);
// console.log("thirdInt : ", myThirdInt);  //error


//p.43
//this

const myCar = {
    color : 'red',
    logColor : function(){
        console.log(this.color);    //this : myCar Object
    },
};
myCar.logColor(); 


//p.44
function logThis(){
    console.log(this);  //this : Window
}

logThis();

const unboundGetColor = myCar.logColor;
console.log(unboundGetColor());   //undefined
const boundGetColor = unboundGetColor.bind(myCar);
console.log(boundGetColor());


//p.45
//.call(param1, param2, ...)
function Car(maker, color){
    this.carMaker = maker,
    this.carColor = color;
}

function MyCar(maker, color){
    Car.call(this, maker, color);
    this.age = 5;
}

const myNewCar = new MyCar('bmw', 'red');
console.log(myNewCar.carMaker);
console.log(myNewCar.carColor);

 //p.46
 //.apply(array[])
function Car2(maker, color){
    this.carMaker = maker,
    this.carColor = color;
}

function MyCar2(maker, color){
    Car2.apply(this, [maker, color]);
    this.age = 5;
}

const myNewCar2 = new MyCar2('ferrari', 'green');
console.log(myNewCar2.carMaker);
console.log(myNewCar2.carColor);



//이 부분은 더 공부필요. 이해가 잘 안됨.
const ourFunction = function(item, method, args){
    method.apply(args);
};

ourFunction(item, method, ['arg1', 'arg2']);
ourFunction(item, method, ['arg1', 'arg2', 'arg3']);
//p.70
//ES6 이전에는 함수 인수의 기본값을 설정하기 위해 로직에서 처리

function getLocation(city, country, continent){
    if(typeof country === 'undefined'){
        country = 'Italy';
    }
    if(typeof contient === 'undefined'){
        continent = 'Europe';
    }
    console.log(continent, country, city);
}

getLocation('Milan');  //Europe Italy Milan
getLocation('Paris', 'France'); //Europe France Paris

//첫번째 인수를 기본값으로 바꾸려면 인수에 undefined 값을 전달해야 했다.
function getLoc(continent, country, city){
    if(typeof country === 'undefined'){
        country = 'Italy';
    }
    if(typeof contient === 'undefined'){
        continent = 'Europe';
    }
    console.log(continent, country, city);
}

getLoc(undefined, undefined, 'Porto');
getLoc(undefined, 'Spain', 'Barcelona');


//ES6부터는 함수 기본값 인수를 쉽게 설정할 수 있다.
function calculaterPrice(total, tax = 0.1, tip = 0.05){ //tax나 tip에 값을 할당하지 않으면 기본값으로 0.1과 0.05가 쓰인다.
    return total + (total*tax) + (total*tip);
}

//두번째 인수를 기본값, 세번째 인수를 적용할 때는 아래와 같이 선언 가능하지만 깔끔한 방법은 아니다.
calculaterPrice(100, undefined, 0.15);

//destructuring
function calPrice({total = 0, tax = 0.1, tip = 0.05,} = {}){    
    return total + (total*tax) + (total*tip);
}
//매개변수를 어떻게 전달하든 상관없이 인수는 객체가 된다.
const bill1 = calPrice({tip : 0.15, total : 150});  //187.5
const bill2 = calPrice();   //0
const bill3 = calPrice({}); //0
const bill4 = calPrice(undefined);  //0
console.log(bill1);
console.log(bill2);
console.log(bill3);
console.log(bill4);


//인수객체를 빈 객체로 설정하지 않고 선언 후, 아무 매개변수 없이 호출하면 오류가 발생한다.
function notEmptyObject({a = 1, b = 2}){
    return a + b;
}

const test = notEmptyObject();  //Uncaught TypeError
console.log(test);
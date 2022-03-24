//p.164
//proxy : 기본 작업(속성 조회, 할당, 열거, 함수 호출 등)에 대해 사용자 지정 동작을 추가로 정의하는데 사용된다.


//원본 객체
const dog = {
    breed : "German Shephard",
    age : 5,
};

//프록시 객체 : new Proxy(target, handler)
//target : 객체, 함수, 다른 프록시 등 무엇이든 가능
//handler : 작업이 수행될 때 프록시의 동작을 정의하는 객체
const dogProxy = new Proxy(dog, {
    get(target, breed){
        return target[breed].toUpperCase();
    },
    set(target, breed, value){
        console.log('changing breed to...');
        target[breed] = value;
    },
});

console.log(dogProxy.breed);    //GERMAN SHEPHARD
console.log(dogProxy.breed = "puppy");      //changing breed to... puppy
console.log(dogProxy.breed);


//프록시 활용
const validateAge = {
    set: function(object, property, value) {
        if(property === 'age'){
            if(value < 18){
                throw new Error('you are too young bro');
            } else{
                object[property] = value;
                return true;
            }
        }
    }
};

const user = new Proxy({}, validateAge);
// user.age = 17;  //Uncaught Error : you are too young bro
user.age = 21;  //21


//without Proxy
const cat = {
    _name : 'nyang',    //_varName : private(javascript convention)
    _age : 7,

    get name(){
        console.log(this._name);
    },
    get age(){
        console.log(this._age);
    },

    set name(newName){
        this._name = newName;
        console.log(this._name);
    },
    set age(newAge){
        this._age = newAge;
        console.log(this._age);
    },
};

cat.name;
cat.age;
console.log(cat.breed); //undefined
cat.name = 'Max';
cat.name;
cat.age = 8;


//with Proxy
//Proxy 객체를 활용하여 더 짧고 간결한 코드 작성 및 사용할 수 없는 속성에 접근할 때 사용자 지정 메시지 출력 가능
const dog2 = {
    name : 'pup',
    age : 7
};

const handler = {
    get: (target, property) => {
        property in target ? console.log(target[property]) : console.log('property not found');
    },
    
    set: (target, property, value) => {
        target[property] = value;
        console.log(target[property]);
    },
};


const dog2Proxy = new Proxy(dog2, handler);

dog2Proxy.name;
dog2Proxy.age;
dog2Proxy.name = 'WalWal';
dog2Proxy.age = 12;
dog2Proxy.breed;


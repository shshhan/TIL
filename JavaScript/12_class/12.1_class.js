//p.132
//prototype(유전자) 상속

function Person_(name, age){
    this.name = name;
    this.age = age;
}

Person_.prototype.greet = function(){
    console.log("Hello, my name is " + this.name);
}

const shawn = new Person_('Shawn', 28);
const mike = new Person_('Mike', 27);

shawn.greet();
mike.greet();

console.log('-----------');

//클래스 선언과 표현식은 호이스팅의 대상이 아니다.
//클래스에 접근하기 전에 클래스를 선언하지 않으면 ReferenceError발생

//클래스 선언
class Person{
    constructor(name, age){ //생성자 메서드는 반드시 하나
        this.name = name;
        this.age = age;
    }
    
    greet(){
        console.log(`Hi, my name is ${this.name} and I'm ${this.age} years old`);
    }
    
    farewell(){
        console.log("Goodbye my friend");
    }
}

const han = new Person("Shawn Han", 28);

han.greet();
han.farewell();

console.log('-----------');


//p.134
//static method. 클래스 자체에서는 접근 가능하지만 인스턴스에서는 접근 불가능
//setter, getter
class Person2 {
    constructor(name, age){
        this.name = name;
        this.age = age;
        // this.nickname = "";
    }
    static info(){
        console.log("I am a Person class.");
    }

    set setNickname(value){
        this.nickname = value;
        console.log('set your nickname as', this.nickname);
    }

    get getNickname(){
        console.log(`your nickname is ${this.nickname}.`);
    }

    set fullName(value){
        [this.name, this.surname] = value.split(" ");
    }

    get fullName(){
        return `${this.name} ${this.surname}`;
    }
}

const sh = new Person2("Shawn Han", 28);
// sh.info();   //Uncaught TypeError
Person2.info();

//getter와 setter는 함수처럼 사용하지 않고 property처럼 사용한다.
sh.setNickname = "gilouso_kirin";
sh.getNickname;
console.log(sh.nickname);

//객체에 property가 없어도 getter/setter의 이름을 통해 가상 property처럼 사용할 수 있다.
sh.fullName ='SeungHyeon Han';      //fullname의 setter를 통해 surname이 생성됨.
console.log(sh);
console.log(sh.fullName);

console.log('-----------');


//클래스 상속
class Adlut extends Person{
    constructor(name, age, work){   //상속 시 반드시 super를 호출해야한다.
        // this.name = name;
        // this.age = age;
        super(name, age);   //Person으로 부터 name과 age를 상속 받음.
        this.work = work;
    }
}

const extendedPerson = new Adlut('shHan', 28, 'fullstack oriented developer');

console.log(extendedPerson);
console.log(extendedPerson.name);
extendedPerson.greet(); //메서드도 상속

console.log('-----------');


//배열 확장하기
class Classroom extends Array{
    //레스트 연산자를 사용해 가변 인수로 입력받은 학생들의 정보를 배열 형태로 students에 할당
    constructor(name, ...students){
        super(...students);
        this.name = name;
    }

    add(student){
        this.push(student);
    }
}

const myClass = new Classroom('1A',
    {name : "Tim", mark : 6},
    {name : "Tom", mark : 3},
    {name : "Jin", mark : 8},
    {name : "Jack", mark : 10},
);

console.log(myClass);

myClass.add({name : "Timmy", mark : 7});

console.log(myClass);

for(const student of myClass){
    console.log(student);
}
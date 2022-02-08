//p.64
//화살표 함수 사용 시 문제가 될 수 있는 상황

// const button = document.querySelector("btn");
// button.addEventListener("click", () => {
//     this.classList.toggle("on");    //여기서 this는 Window 객체 --> Uncaught TypeError
// });

const person1 = {
    age : 10,
    grow : function() {
        this.age++;     //여기서 this는 person1
        console.log(this.age);
    },
};

person1.grow();

const person2 = {
    age : 10,
    grow : () => {
        this.age++;     //여기서 this는 Window 객체 
        console.log(this.age);
    },
};

person2.grow(); //NaN


//arguments 객체는 함수 내부에서 접근할 수 있는 배열 객체
//화살표 함수에서 arguments 객체는 부모 스코프의 값을 상속한다.

function exapmle() {
    console.log(arguments[0]); //arguments 키워드에 배열표기법을 적용하면 인수에 접근할 수 있다.
}

exapmle(1, 2, 3);   //1


// const showWinner = () => {
//     const winner = arguments[0];
//     console.log(`${winner} was the winner`);
// };

// showWinner("Usain Bolt", "Justin Gatlin", "Asafa Powell");  //Uncaught ReferenceError : argument is not defined

//arguments 객체에 접근하기 위해서는 기존 함수 표기법이나 스프레드 문법을 사용해야한다.

const show2nd = function() {
    const second = arguments[1];
    console.log(`${second} was the seconde`);
}
show2nd("Usain Bolt", "Justin Gatlin", "Asafa Powell");

//화살표 함수에 쓰려면 아래와 같이 쓴다.
const showWinner = (...args) => {
    const winner = args[0];
    console.log(`${winner} was the winner`);
};
showWinner("Usain Bolt", "Justin Gatlin", "Asafa Powell");
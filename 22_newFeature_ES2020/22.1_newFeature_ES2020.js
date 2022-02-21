//p.224
//BigInt
let num = Number.MAX_SAFE_INTEGER;  //JS가 처리 가능한 가장 큰 정수
console.log(num);
console.log(num+1);
console.log(num+2);
console.log(num+3);
console.log(num+4);

let bigInt = 9999999999999999n;
// let bigInt = bigInt(9999999999999999);   //책에서는 이방법도 가능하다고 했는데 Uncaught ReferenceError: Cannot access 'bigInt' before initialization
console.log(bigInt + 1n);


//동적으로 가져오기 : 런타임에서 모듈이 필요한지 여부를 판단해서, 필요한 경우에만 async/await을 사용해 해당 모듈을 가져옴
// if(condition1 && condition2){
//     const module = await import('./path/to/module.js');
//     module.doSomthing();
// }


//optional chainning : ?.
const user1 = {
    name : 'Alberto',
    age : 27,
    work : {
        title : 'software developer',
        location : 'Vietnam',
    },
};

const user2 = {
    name : 'Tom',
    age : 27,
};


//work라는 속성이 모든 객체에 있는게 아니므로 접근하기 전에 속성을 갖고있는지 여부파악이 선행되어야 했다.
let jobTitle1;
if(user1.work){
    jobTitle1 = user1.work.title;
}
console.log(jobTitle1);

const jobTitle2 = user2.work ? user1.work.title : '';
console.log(jobTitle2);

//optionalChainning 문법으로 훨씬 간결해진 코드
const jobTitle3 = user1.work?.title;
console.log(jobTitle3);
const jobTitle4 = user2.work?.title;
console.log(jobTitle4);


const elon = {
    name : 'Elon Musk',
    education : {
        primary_school : { /* 초등학교 관련 데이터*/},
        middle_school : { /* 중학교 관련 데이터 */},
        high_school : { /* 고등학교 관련 데이터 */},
        university : {
            name : 'University of Pennsylvania',
            graduation : {
                year : 1995,
            },
        },
    },
};

const mark = {
    name : 'Mark Zuckerberg',
    education : {
        primary_school : { /* 초등학교 관련 데이터*/},
        middle_school : { /* 중학교 관련 데이터 */},
        high_school : { /* 고등학교 관련 데이터 */},
        university : {
            name : 'Havard University',
        },
    },
};

//without optional chainning
let graduationYear;
if (elon.education.university &&
    elon.education.university.graduation &&
    elon.education.university.graduation.year) {
        graduationYear = elon.education.university.graduation.year;
    }
console.log(graduationYear);

//with optional chainning
const elonGraduationYear = elon.education.university?.graduation?.year;
const markGraduationYear = mark.education.university?.graduation?.year;
console.log(elonGraduationYear,markGraduationYear);


//Promise.allSettled() : 모든 promise들이 완료 될 때까지 기다렸다가 성공/실패 여부와 무관하게 각각의 결과를 설명하는 객체 배열을 return
const arrayOfPromises = [
    new Promise((res, rej) => setTimeout(res, 1000)),
    new Promise((res, rej) => setTimeout(rej, 1000)),
    new Promise((res, rej) => setTimeout(res, 1000)),
];

Promise.allSettled(arrayOfPromises).then(data => console.log(data));


//!! 연산자를 사용해 다양한 자료형의 값을 Boolean으로 변환
const str = "";
console.log(!!str); //false
const number = 0;
console.log(!!number); //false
const n = null;
console.log(!!n); //false
const u = undefined;
console.log(!!u); //false

//nullish coalescing operator(??) : 왼쪽 피연산자가 null 계열의 값인 경우 오른쪽 피연산자를 반환
const x = '' ?? 'empty string';
console.log(x); // '' -> not a nullish value
const numm = 0 ?? 'zero';
console.log(numm);  //0 -> not a nullish value
const nu = null ?? "it's null";
console.log(nu); //it's null -> nullish value
const un = undefined ?? "it's undefined";
console.log(un); //it's undefined -> nullish value


//String.prototype.matchAll() : 지정된 정규식에 대해 문자열과 일치하는 모든 결과의 반복자를 반환
const regEx = /[a-d]/g;
const lorem = "Mollit eiusmod pariatur qui incididunt.";
const regExIterator = lorem.matchAll(regEx);

console.log(Array.from(regExIterator));


//p.231
//모듈 네임스페이스 export 문법
//import.meta
//위 두개는 아직 이해가 안돼서 좀 더 공부하고 다시 보기로...

//globalThis
//ES2020전에는 전역 객체(this)에 접근하는 표준화된 방식이 없었다.
//브라우저 -> window, Node -> global, 웹 워커 -> self
//ES2020부터 어떤 환경에서든 항상 전역 객체를 참조하는 globalThis
//브라우저에서는 전역 객체에 직접 접근이 불가능하기 때문에 전역 객체의 프록시를 참조
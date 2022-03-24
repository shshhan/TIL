//p.86
//기본적인 문자열 메서드

const str1 = "this is a short sentence";
console.log(str1.indexOf("short")); //10

const str2 = "pizza, orange, cereals";
console.log(str2.slice(0,5));   //pizza

const str3 = "i ate an apple";
console.log(str3.toUpperCase());

const str4 = "I ATE AN APPLE";
console.log(str4.toLowerCase());


//ES6부터 도입된 문자열 메서드

const code = "ABCDEFG";
console.log(code.startsWith("ABB"));    //false
console.log(code.startsWith("abc"));    //false 대소문자 비교O
console.log(code.startsWith("ABC"));    //true
console.log(code.startsWith("DEF"));    //false
console.log(code.startsWith("DEF", 3));    //true   매개변수를 추가로 전달하면 시작점 지정 가능

console.log(code.endsWith("efg"));  //false
console.log(code.endsWith("EFG"));  //true
console.log(code.endsWith("EF", 6));  //true    첫문자부터 6개만 고려해서 EF로 끝나는지 확인

console.log(code.includes("ABB"));   //false
console.log(code.includes("abc"));   //false
console.log(code.includes("BCD"));   //true


let hello = "hi ";
console.log(hello.repeat(10));
//p.180
//Array.prototype.includes()

let array = [1, 2, 3, 4, 8, 9, 10];

//array.includes(param) : param이 있으면 true, 없으면 false
console.log(array.includes(2)); //true
console.log(array.includes(6)); //false

//array.includes(param1, param2) : param2 인덱스 위치에서 부터 param1을 검색
console.log(array.includes(3, 1));  //true
console.log(array.includes(1, 5));  //false
console.log(array.includes(10, -1));//true
console.log(array.includes(2, -5)); //false


//지수연산자(**)
//ES2016 이전
console.log(Math.pow(2, 2)); // 4
console.log(Math.pow(Math.pow(2, 2), 2));   // 16

//ES2016
console.log(2 ** 2);    //4
console.log(2 ** 2 ** 2);    //16
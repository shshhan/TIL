//p.81
//tagged template literal
//strings : sentnece의 전체 문자열 중 template litera 변수를 제외한 문자열들이 담긴 배열
//          --> template literal을 구분자로 삼아 문자열을 나눈 결과
//other arguments : template literals

let person = "Shawn";
let age = 28;

function myTag(strings, personName, personAge){
    //strings = ['That ', ' is a ', '!'];
    let str = strings[1];
    let ageStr;

    personAge > 50 ? ageStr = "grandpa" : ageStr = "youngster";

    return personName + str + ageStr;
}

let sentence = myTag`That ${person} is a ${age}!`;
console.log(sentence);
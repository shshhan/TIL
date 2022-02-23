//p.247
//인터페이스
interface Car {
    readonly wheels: number;    //생성시 설정하고 이후에는 변경 불가능
    color: string;
    brand: string;
    coupe?: boolean;    //optional property
}

//함수가 가져야할 형태를 인터페이스로 만들고, 해당 인터페이스를 자료형으로 가지는 변수를 정의
interface Greet {
    (greeting: string, name: string): string
}

let greetingFunction: Greet;
greetingFunction = (greeting: string, name: string): string => {
    console.log(`${greeting} ${name}`);
    return `${greeting} ${name}`;
}
greetingFunction('Bye', 'Shawn');

interface Benz extends Car {    //interface extends
    logo: string;
    modelNumber: string;
}
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


//class
//prototype 상속을 수행하여 애플리케이션에서 재사용할수 있는 구성요소를 만들 수 있다
//ES6의 클래스 : 모든 클래스 멤버는 공개
//typescript의 클래스 : 클래스 멤버에 접근하는 권한을 설정 가능
class Animal {
    public eat = () => {
        console.log('nyam nyam');
    };
    sleep = () => {
        console.log('zzzz'); 
    };
}

class Human extends Animal {
    private work = () => {
        console.log('fighting');
    };

    protected watchMovie = () => {
        console.log('LaLa Land');
    };
}

class Adult extends Human {
    public listenToMusic = () => {
        console.log('Rock music');
    };

    public goToTheater = () => {
        console.log('I will watch ');
        this.watchMovie();
    }
}

const me = new Human();
me.eat();
me.sleep();
// me.work();  //Property 'work' is private and only accessible within class 'Human'.  
//me.watchMovie();    //Property 'watchMovie' is protected and only accessible within class 'Human' and its subclasses.

const mom = new Adult();
mom.goToTheater();
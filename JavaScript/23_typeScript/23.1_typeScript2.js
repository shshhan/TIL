var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var greetingFunction;
greetingFunction = function (greeting, name) {
    console.log("".concat(greeting, " ").concat(name));
    return "".concat(greeting, " ").concat(name);
};
greetingFunction('Bye', 'Shawn');
//class
//prototype 상속을 수행하여 애플리케이션에서 재사용할수 있는 구성요소를 만들 수 있다
//ES6의 클래스 : 모든 클래스 멤버는 공개
//typescript의 클래스 : 클래스 멤버에 접근하는 권한을 설정 가능
var Animal = /** @class */ (function () {
    function Animal() {
        this.eat = function () {
            console.log('nyam nyam');
        };
        this.sleep = function () {
            console.log('zzzz');
        };
    }
    return Animal;
}());
var Human = /** @class */ (function (_super) {
    __extends(Human, _super);
    function Human() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.work = function () {
            console.log('fighting');
        };
        _this.watchMovie = function () {
            console.log('LaLa Land');
        };
        return _this;
    }
    return Human;
}(Animal));
var Adult = /** @class */ (function (_super) {
    __extends(Adult, _super);
    function Adult() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.listenToMusic = function () {
            console.log('Rock music');
        };
        _this.goToTheater = function () {
            console.log('I will watch ');
            _this.watchMovie();
        };
        return _this;
    }
    return Adult;
}(Human));
var me = new Human();
me.eat();
me.sleep();
// me.work();  //Property 'work' is private and only accessible within class 'Human'.  
//me.watchMovie();    //Property 'watchMovie' is protected and only accessible within class 'Human' and its subclasses.
var mom = new Adult();
mom.goToTheater();

//p.63
//ArrowFunction and this

//box 클래스를 가진 div를 가져온다.
const box = document.querySelector(".box");
//click 이벤트 핸들러를 등록
box.addEventListener("click", function(){
    //div에 opening 클래스를 토글
    this.classList.toggle("opening");   //여기서 this는 box
    setTimeout(function(){
        //클래스를 다시 토글
        this.classList.toggle("opening");   //여기서 this는 Window객체 --> Uncaught TypeError
    }, 500);
});

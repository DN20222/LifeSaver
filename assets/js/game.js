/* переменные*/
let username; //Имя игрока
let stones = [];//Kamni
let hearts = [];//serdca
let sec = 0;
let timer = null;
let user = {
    row: 0,
    col: 0
};
const ROWS = 10;
const COLS = 20;
let score = 0;

let usernameInput = document.getElementById("usernameInput");
let startButton = document.getElementById("startButton");
let field = document.querySelector(".field");
let hudTime = document.getElementById("hudTime");
let hudHearts = document.getElementById("hudHearts");
let startOver = document.getElementsByClassName("start-over");

/*Обработчик событий*/
usernameInput.addEventListener("input", check);
startButton.addEventListener("click", start);
startOver[0].addEventListener("click", start);
startOver[1].addEventListener("click", start);

/*Проверка ввода имени игрока*/
function check() {
    /**if(this.value){
        document.getElementById("startButton").disablded = false;
    }
    else{
        document.getElementById("startButton").disablded= true;
    }**/
    document.getElementById("startButton").disabled = !this.value;
}
$("#startButton").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#startButton").click();
    }
});
/* Запуск игры */
function start() {
    sec = 0;
    score = 0;
    user.row = 0;
    user.col = 0;
    hudTime.innerText = "00:00";
    hudHearts.innerText = "0/10";
    stones = [];
    document.querySelector("#screenWelcome .box-wrapper").classList.remove("active");
    document.querySelector("#screenRating .box-wrapper").classList.remove("active");
    document.querySelector("#screenLoss .box-wrapper").classList.remove("active");
    document.getElementById("hudUsername").innerText = usernameInput.value;

    fill();
    timer = setInterval(tick, 1000);
    window.addEventListener("keydown", step);
}

function fill() {
    for (let i = 0; i < 200; i++) {
        field.children[i].className = "cell ground";
    }
    field.children[0].className = "cell player";
    let stonesCount = 0;
    while (stonesCount < 10) {
        let num = Math.floor(Math.random() * 200);
        if (field.children[num].classList.contains("ground")) {
            field.children[num].className = "cell stone";
            stonesCount++;
            stones.push(getRowCol(num));
        }
    }
    let heartsCount = 0;
    while (heartsCount < 10) {
        let num = Math.floor(Math.random() * 200);
        if (field.children[num].classList.contains("ground")) {
            field.children[num].className = "cell heart";
            heartsCount++;
            hearts.push(num);
        }
    }
}

function tick() {
    sec++;
    //sposob1
    let s = sec % 60;
    let m = (sec - s) / 60;
    //sposob2
    /*if(sec == 60){
        min++;
        sec = 0;
    }*/
    if (s < 10)
        s = '0' + s;
    m = (m < 10) ? ("0" + m) : m;
    hudTime.innerText = m + ":" + s;
    checkStone();
}
function step(event) {
    switch (event.keyCode) {
        case 37: left(); break;
        case 38: up(); break;
        case 39: right(); break;
        case 40: down(); break;
        case 32: event.preventDefault(); break;
        case 13: event.preventDefault(); break;
    }

}

/*
function space() {
    clearInterval(timer);
    window.removeEventListener("keydown", step);
}

*/
/*
function enter() {
    clearInterval(timer);
    window.removeEventListener("keydown", step);
}*/



function left() {
    if (user.col > 0) {
        let prev = getCell(user.row, user.col);
        let next = getCell(user.row, user.col - 1);
        if (!field.children[next].classList.contains("stone")) {
            user.col--;
            checkScore(prev, next);
            console.log('left');
        }
    }
}

function up() {
    if (user.row > 0) {
        let prev = getCell(user.row, user.col);
        let next = getCell(user.row - 1, user.col);
        if (!field.children[next].classList.contains("stone")) {
            user.row--;
            checkScore(prev, next);
            console.log('up');
        }
    }
}

function right() {
    if (user.col < COLS - 1) {
        let prev = getCell(user.row, user.col);
        let next = getCell(user.row, user.col + 1);
        if (!field.children[next].classList.contains("stone")) {
            user.col++;
            checkScore(prev, next);
            console.log('right');
        }
        
    }    
}

function down() {
    if (user.row < ROWS - 1) {
        let prev = getCell(user.row, user.col)
        let next = getCell(user.row + 1, user.col);
        if (!field.children[next].classList.contains("stone")) {
            user.row++;
            checkScore(prev, next);
            console.log('down');
        }
    }
}


// Функция для нахождения номера ячейки по номеру строки и номеру столбца 
function getCell(row, col) {
    return row * COLS + col;
}

// Функция для нахождения строки и столбца по номеру ячейки 
function getRowCol(index) {
    let col = index % COLS;
    let row = (index - col) / COLS;
    return { row: row, col: col };
}
function checkScore(prev, next) {
    if (field.children[next].classList.contains("heart")) {
        score++;
        hudHearts.innerText = score + "/10";
    }
    field.children[prev].className = "cell ";
    field.children[next].className = "cell player";
    if (score == 10)
        rating();
}

function rating() {
    document.querySelector("#screenRating .box-wrapper").classList.add("active");
    clearInterval(timer);
    window.removeEventListener("keydown", step);
}

//Падение камней
function checkStone() {
    for (let i = 0; i < stones.length; i++) {
        if (stones[i].row < ROWS - 1) {
            let prev = getCell(stones[i].row, stones[i].col);
            let next = getCell(stones[i].row + 1, stones[i].col);
            let isGround = field.children[next].classList.contains("ground");
            let isHeart = field.children[next].classList.contains("heart");
            let isStone = field.children[next].classList.contains("stone");
            let isPlayer = field.children[next].classList.contains("player");
            if (!isGround && !isHeart && !isStone) {
                stones[i].row++;
                field.children[prev].className = "cell";
                field.children[next].className = "cell stone";
                if (isPlayer) {
                    document.querySelector("#screenLoss .box-wrapper").classList.add("active");
                    clearInterval(timer);
                    window.removeEventListener("keydown", step);
                }
            }
        }
    }
}
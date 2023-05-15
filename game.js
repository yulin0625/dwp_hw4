var playerBet;
var splitBet;
var playerMoney;

var playerPoint;
var dealerPoint;
var split1Point;
var split2Point;

var player_has_A;
var player_A_is_11;
var dealer_has_A;
var dealer_A_is_11;

var hideCardNumber;
var split1CardNumber;
var split2CardNumber;

var is_split; // boolean
var split_round; // split時，玩兩個round
var dealerCheat; // boolean
var gamePause; // boolean
var logCount;
var timer;
var timeLeft;

const chipValue = [5, 10, 25, 100];
const deck = Array(53).fill(0); // 0~52 (0不使用)
var chipButton = [];

// function
function assignChips(chipValue){
    displayChip(chipValue);
    playerBet += chipValue;
    playerMoney -= chipValue;
    showBetAndBank();
    $("#deal").attr("disabled", false);
    $("#resetBet").attr("disabled", false);
    $("#prompt").hide();
    checkMoney();
    writeLog(`Add ${chipValue}, Total Bet: ${playerBet}`);
}

function displayChip(chipValue){
    let imgPath = `./img/chip${chipValue}.png`;
    $("#chipArea").append(`<img src=${imgPath} alt=chip${chipValue}></img>`);
}

// 檢查玩家錢是否足夠下注，並停/起用 chip button
function checkMoney(){
    // 若錢不夠禁用chip btn
    let chip100Disabled = false;
    let chip25Disabled = false;
    let chip10Disabled = false;
    let chip5Disabled = false;
    if(playerMoney < 100){
        let btn = $("#chip100");
        btn.css("opacity", 0.5);
        btn.off("click");
        chip100Disabled = true;
    }
    if(playerMoney < 25){
        let btn = $("#chip25");
        btn.css("opacity", 0.5);
        btn.off("click");
        chip25Disabled = true;
    }
    if(playerMoney < 10){
        let btn = $("#chip10");
        btn.css("opacity", 0.5);
        btn.off("click");
        chip10Disabled = true;
    }
    if(playerMoney < 5){
        let btn = $("#chip5");
        btn.css("opacity", 0.5);
        btn.off("click");
        chip5Disabled = true;
    }
    // 啟用
    if(playerMoney >= 100 && chip100Disabled == true){
        let btn = $("#chip100");
        btn.css("opacity", 1);
        btn.click(function(){assignChips(100)});
    }
    if(playerMoney >= 25 && chip25Disabled == true){
        let btn = $("#chip25");
        btn.css("opacity", 1);
        btn.click(function(){assignChips(25)});
    }
    if(playerMoney >= 10 && chip10Disabled == true){
        let btn = $("#chip10");
        btn.css("opacity", 1);
        btn.click(function(){assignChips(10)});
    }
    if(playerMoney >= 5 && chip5Disabled == true){
        let btn = $("#chip5");
        btn.css("opacity", 1);
        btn.click(function(){assignChips(5)});
    }
}

// 重新下注
function resetBet(){
    playerMoney += playerBet;
    playerBet = 0;
    $("#chipArea").text(""); // 清空桌上的chip
    $("#prompt").show();
    $("#resetBet").attr("disabled", true);
    $("#deal").attr("disabled", true);
    showBetAndBank();
    // todo log
}

// 顯示Bet及Bank資訊
function showBetAndBank(){
    $("#bet").text(`BET: ${playerBet}`);
    $("#bank").text(`BANK: ${playerMoney}`);
}

function deal_first(){
    // todo write log
    window.clearTimeout(timer);
    let card1Number;
    let card2Number;
    let card1Value;
    let card2Value;

    // 清空桌面上的chip
    $("#chipArea").hide();
    $("#chip").css("visibility", "hidden");
    $("#resetBet").hide();
    // 顯示卡片及點數
    $("#cardArea").show();
    $("#playerPoint").show();

    // action button
    $("#deal").hide();
    $("#double").show();
    $("#hit").show();
    $("#stand").show();
    $("#surrender").show();
    $("#cheat").show();

    // 莊家抽牌
    drawCard("dealer");
    hideCardNumber = drawCard("dealer", true)[0];
    // 玩家抽牌
    [card1Number, card1Value] = drawCard("player");
    [card2Number, card2Value] = drawCard("player");
    if(card1Value == card2Value){
        split1CardNumber = card1Number;
        split2CardNumber = card2Number;
        $("#split").show();
    }
    setTime(10);
    timer = window.setInterval(autoStand, 1000);
}

// 抽牌 person:"dealer", "player"; hide: true, false
function drawCard(person, hide){ 
    let cardNumber;
    let cardValue;
    let get_A = false;

    // cheat
    if(person == "dealer" &&  dealerCheat && playerPoint > 0){
        // let maxValue = 21 - dealerPoint; // 最多只能抽到max點
        // let minValue = playerPoint - dealerPoint + 1; // 最少要抽到min點
        // if(dealerPoint <= playerPoint){ // min > 0
        //     [cardNumber, cardValue] = findCheatCard(maxValue, minValue);
        // }
        // else{
        //     [cardNumber, cardValue] = findCheatCard(maxValue);
        // }

        // if(cardValue == 1 || cardValue == 1){
        //     writeLog(`莊家抽到A`);
        // }
        // else{
        //     writeLog(`莊家抽到${cardValue}點`);
        // }
    }
    else{
        cardNumber = getCardNumber();
        cardValue = getCardValue(cardNumber);
    
        if(cardValue == 1){ // 玩家抽到A
            get_A = true;
        }
    
        if(person == "dealer"){
            if(get_A){
                dealer_has_A = true;
                if(dealerPoint + 11 <= 21){ // A當11
                    dealerPoint += 11;
                    dealer_A_is_11 = true;
                }
                else{
                    dealerPoint += 1;
                }
                writeLog("莊家抽到A");
            }
            else{ // 這次不是抽到A
                dealerPoint += cardValue;
                if(dealer_has_A){  // 牌堆有A
                    if(dealer_A_is_11 && dealerPoint > 21){
                        dealerPoint -= 10; // A當1
                        dealer_A_is_11 = false;
                    }
                }
                writeLog(`莊家抽到${cardValue}點`);
            }
        }
        else{ // player, split1, split2
            if(get_A){
                player_has_A = true;
                if(playerPoint + 11 <= 21){ // A當11
                    playerPoint += 11;
                    player_A_is_11 = true;
                }
                else{
                    playerPoint += 1;
                }
                writeLog("玩家抽到A");
            }
            else{
                playerPoint += cardValue;
                if(player_has_A){  // 牌堆有A
                    if(player_A_is_11 && playerPoint > 21){
                        playerPoint -= 10; // A當1
                        player_A_is_11 = false;
                    }
                }
                writeLog(`玩家抽到${cardValue}點`);
            }
        }
    }


    if(hide){
        displayCard(person, "cover");
    }
    else{
        displayCard(person, cardNumber);
    }
    renewPoint();
    return [cardNumber, cardValue];

}

// 取得一個random的CardNumber(使用4副牌)
function getCardNumber(){
    let cardnumber = Math.floor(Math.random()*52) + 1;
    while(deck[cardnumber] > 4)
        cardnumber = Math.floor(Math.random()*52) + 1;
    deck[cardnumber] += 1;
    return cardnumber;
}

// 計算卡片的點數
function getCardValue(cardnumber){
    let point = cardnumber % 13;
    if(point==0 || point > 10)
        point = 10;
    return point;
}

function displayCard(person, cardNumber){
    let imgPath = `./img/cards/${cardNumber}.png`;
    let cardArea;
    if(person == "dealer")
        cardArea = $("#dealerCards");
    else if(person == "player")
        cardArea = $("#playerCards");
    else if(person == "split1"){
        cardArea = $("#split1Cards");
    }
    else if(person == "split2"){
        cardArea = $("#split2Cards");
    }

    cardArea.append(`<img src=${imgPath} alt=card${cardNumber}></img>`);
}

function renewPoint() {
    $("#dealerPoint").text(dealerPoint);
    $("#playerPoint").text(playerPoint);

    if(is_split){
        if(split_round == 1){
            $("#split1Point").text(playerPoint);
        }
        else{
            $("#split2Point").text(playerPoint);
        }
    }
}

// 翻開莊家原本覆蓋的卡片
function displayHideCard(){
    let imgPath = `./img/cards/${hideCardNumber}.png`;
    // document.querySelector("#dealerCards img:nth-child(2)").src = imgPath;
    $("#dealerCards img:nth-child(2)").attr("src", imgPath);
    $("#dealerPoint").show();
}


function split(){
    writeLog("Split");
    window.clearInterval(timer);
    splitBet = playerBet;
    playerBet *=2;
    is_split = true;
    playerMoney -= splitBet;
    showBetAndBank();
    $("#split").hide();
    $("#double").hide();
    $("#playerCards").hide();
    $("#playerPoint").hide();

    $("#split1Point").show();
    $("#split2Point").show();
    $("#split1Cards").show();
    $("#split2Cards").show();


    displayCard("split1", split1CardNumber);
    displayCard("split2", split2CardNumber);
    playerPoint = getCardValue(split1CardNumber);
    $("#split1Point").text(playerPoint);
    $("#split2Point").text(playerPoint);

}
//todo
function showResult(result){
    window.clearInterval(timer);
    let textArea = $("#resultText");
    switch(result){
        case "playerBust":
            textArea.html("<h1>BUST!</h1><h2>You Lost!</h2>");
            writeLog("BUST! Player Lost");
            break;
        case "dealerBust":
            textArea.html("<h1>Dealer BUST!</h1><h2>You Win!</h2>");
            writeLog("Dealer BUST! Player Win");
            break;
        case "playerWin":
            textArea.html("<h1>You Wins!</h1>");
            writeLog("Player Win");
            break;
        case "dealerWin":
            textArea.html("<h1>Dealer Wins!</h1><h2>You Lost</h2>");
            writeLog("Player Lost");
            break;
        case "push":
            textArea.html("<h1>PUSH</h1>");
            writeLog("Push");
            break;
        case "surrender":
            textArea.html("<h1>Surrender</h1>");
            writeLog("Player Surrender");
        default:
    }
    
    $("#result").show();
    $("#chip").hide();
    $("#buttonArea").hide();
    showBetAndBank();
}

// 莊家抽牌
function dealerDrawCards(){
    displayHideCard(); // 莊家翻牌
    while(dealerPoint <= 17){
        drawCard("dealer");
    }
}

function isBust(person){
    let point;
    if(person == "dealer")
        point = dealerPoint;
    else if(person == "player")
        point = playerPoint;
    else if(person == "split1"){
        point = split1Point;
    }
    else if(person == "split2"){
        point = split2Point;
    }
    if(point > 21){
        return true;
    }
    return false;
}

// 檢查點數
function checkPoint() {
    dealerDrawCards(); // 莊家抽牌(若點數<17)
    if(is_split){
        if(split_round == 1){
            if(isBust("dealer")){
                playerMoney += 2 * splitBet;
                writeLog("Dealer BUST! Player Win");
            }
            else if(split1Point > dealerPoint){
                playerMoney += 2 * splitBet;
                writeLog("Player Win");
            }
            else if(split1Point < dealerPoint){
                writeLog("Player Lost");
            }
            else{ // 平手
                playerMoney += splitBet;
                writeLog("Push");
            }
            split_round = 2;
        }
        else{
            if(isBust("dealer")){
                playerMoney += 2 * splitBet;
                showResult("dealerBust");
            }
            else if(split2Point > dealerPoint){
                playerMoney += 2 * splitBet;
                showResult("playerWin");
            }
            else if(split2Point < dealerPoint){
                showResult("dealerWin");
            }
            else{ // 平手
                playerMoney += splitBet;
                showResult("push");
            }
        }
    }
    else{
        if(isBust("dealer")){
            playerMoney += 2 * playerBet;
            showResult("dealerBust");
        }
        else if(playerPoint > dealerPoint){
            playerMoney += 2 * playerBet;
            showResult("playerWin");
        }
        else if(playerPoint < dealerPoint){
            showResult("dealerWin");
        }
        else{ // 平手
            playerMoney += playerBet;
            showResult("push");
        }
    }
}


function double(){
    if(playerMoney >= playerBet){ // 可double
        playerMoney -= playerBet;
        playerBet *= 2;
    }
    else{ // 將剩下的錢下注
        playerBet += playerMoney;
        playerMoney = 0;
    }
    showBetAndBank();
    // $("#double")
    // document.getElementById("double").style.display = "none";
    writeLog(`Double, Total Bet: ${playerBet}`);

    drawCard("player"); // 玩家抽一張牌
    if(isBust("player")){
        showResult("playerBust");
    }
    else{
        checkPoint();
    }
}



function hit(){
    window.clearInterval(timer);
    setTime(10);
    timer = window.setInterval(autoStand, 1000);
    
    writeLog("Hit");
    $("#double").hide();
    if(is_split){
        if(split_round == 1){
            drawCard("split1");
            if(isBust("split1")){
                writeLog("BUST! Player Lost");
                split_round = 2;
            }
        }
        else{
            drawCard("split2");
            if(isBust("split2")){
                showResult("playerBust");
                displayHideCard();
            }
        }
    }
    else{
        drawCard("player");
        if(isBust("player")){
            showResult("playerBust");
            displayHideCard();
        }
    }

}

function stand(){
    writeLog("stand");
    window.clearInterval(timer);
    if(is_split){
        if(split_round == 1){
            split_round = 2;
        }
        else if(split_round == 2){
            dealerDrawCards();
            checkPoint();
        }
    }
    else{
        dealerDrawCards();
        checkPoint();
    }
}

function surrender(){
    writeLog("surrender")
    showResult("surrender");
}

function cheat(){
    dealerCheat = !dealerCheat;
    if(dealerCheat){
        $("#cheat").text("CHEAT: ON");
        writeLog("CHEAT: ON");
    }
    else{
        $("#cheat").text("CHEAT: OFF");
        writeLog("CHEAT: OFF");
    }
}

function pause(){
    let btn = $("#pause_icon");
    gamePause = !gamePause;

    if(gamePause){
        btn.attr("src", "./img/play-button.png");
        writeLog("pause game");
    }
    else{
        btn.attr("src", "./img/pause.png");
        writeLog("continue game");
    }

}

function writeLog(msg){
    // document.querySelector("#log > table").innerHTML += 
    // `<tr>
    //     <td>${logCount}</td>
    //     <td>${msg}</td>
    //     <td>${dealerPoint}</td>
    //     <td>${playerPoint}</td>
    //     <td>${playerMoney}</td>
    //     <td>${dealerCheat}</td>
    // </tr>`;
    // ++logCount;
}

function playAgain(){
    reset();
    writeLog("Play Again");
}

function reset(){
    playerBet = 0;
    dealerPoint = 0;
    playerPoint = 0;
    split1Point = 0;
    split2Point = 0;
    
    dealer_has_A = false;
    player_has_A = false;
    dealer_A_is_11 = false;
    player_A_is_11 = false;
    gamePause = false;
    dealerCheat = false;
    $("cheat").text("CHEAT: OFF");
    
    // split
    splitBet = 0;
    split1CardNumber = 0;
    split2CardNumber = 0;
    is_split = false;
    split_round = 1; // split時，玩兩個round
    // 清空桌面
    $("#prompt").show();
    $("#dealerCards").text("");
    $("#playerCards").text("");
    $("#chipArea").text("");

    $("#cardArea").hide();
    $("#chipArea").show();
    $("#resetBet").show();
    
    $("#dealerPoint").hide();
    $("#playerPoint").hide();
    $("#split1Point").hide();
    $("#split2Point").hide();

    $("#split1Cards, #split2Cards").hide();
    $("#result").hide();

    $("#chip").show();
    $("#chip").css("visibility", "visible");
    $("#resetBet").attr("disabled", true);

    $("#buttonArea").show();
    $("#deal").show();
    $("#deal").attr("disabled", true);
    $("#split").hide();
    $("#double").hide();
    $("#hit").hide();
    $("#stand").hide();
    $("#surrender").hide();
    showBetAndBank();

    setTime(10);
    timer = window.setInterval(autoBet, 1000);
}

function start(){
    logCount = 0;
    playerMoney = 1000;
    dealerCheat = false;

    $(".pointInfo").hide();
    $("#cardArea").hide();
    $("#split1Cards, #split2Cards").hide();
    $("#prompt").hide();
    $("#result").hide();
    $("#chip").hide();
    $("#resetBet").hide();
    $("#deal").hide();
    $("#double").hide();
    $("#hit").hide();
    $("#stand").hide();
    $("#split").hide();
    $("#surrender").hide();
    $("#cheat").hide();
    // showBetAndBank();
    writeLog("Game Start");
}

function startGame(){
    reset();
    $("#homePage").hide();
    $("#timeleft").show();
}

function setTime(sec){
    timeLeft = sec;
    updateTimeLeft(); // 更新畫面中的秒數
}

function updateTimeLeft(){
    $("#timeleft").text("Time Left: " + timeLeft); // 更新畫面中的秒數
}

function autoBet(){
    timeLeft -= 1;
    updateTimeLeft(); // 更新畫面中的秒數

    if(timeLeft == 0){
        window.clearInterval(timer);
        assignChips(100);
        deal_first();
    }
}

function autoStand(){
    timeLeft -= 1;
    updateTimeLeft(); // 更新畫面中的秒數

    if(timeLeft == 0){
        window.clearInterval(timer);
        stand();
    }
}

$(document).ready(function(){
    start();
    // tool bar
    // 暫停鍵 todo
    $("#pause_icon").click(function(){
        pause();
    });

    // 主畫面
    // PLAY按鈕
    $("#play_button").click(function(){
        startGame();
    });
    // 籌碼按鈕
    $("#chip5").click(function(){
        assignChips(5);
    });
    $("#chip10").click(function(){
        assignChips(10);
    });
    $("#chip25").click(function(){
        assignChips(25);
    });
    $("#chip100").click(function(){
        assignChips(100);
    });

    $("#resetBet").click(function(){
        resetBet();
    });

    // action button
    $("#deal").click(function(){
        deal_first();
    });
    $("#split").click(function(){
        split();
    });        
    $("#double").click(function(){
        double();
    });
    $("#hit").click(function(){
        hit();
    });
    $("#stand").click(function(){
        stand();
    });
    $("#surrender").click(function(){
        surrender();
    });
    $("#cheat").click(function(){
        cheat();
    });
});
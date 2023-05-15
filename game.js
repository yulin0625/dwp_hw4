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
    // writeLog(`Add ${chipValue}, Total Bet: ${playerBet}`);
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
    // todo write log

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
                // writeLog("莊家抽到A");
            }
            else{ // 這次不是抽到A
                dealerPoint += cardValue;
                if(dealer_has_A){  // 牌堆有A
                    if(dealer_A_is_11 && dealerPoint > 21){
                        dealerPoint -= 10; // A當1
                        dealer_A_is_11 = false;
                    }
                }
                // writeLog(`莊家抽到${cardValue}點`);
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
                // writeLog("玩家抽到A");
            }
            else{
                playerPoint += cardValue;
                if(player_has_A){  // 牌堆有A
                    if(player_A_is_11 && playerPoint > 21){
                        playerPoint -= 10; // A當1
                        player_A_is_11 = false;
                    }
                }
                // writeLog(`玩家抽到${cardValue}點`);
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

}

function double(){

}

function hit(){

}

function stand(){

}

function hit(){

}

function surrender(){

}

function cheat(){

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
    
    $(".pointinfo").hide();
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
    // writeLog("Game Start");
}


function startGame(){
    $("#homePage").hide();
    reset();
}


$(document).ready(function(){
    start();
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
    
    // 暫停鍵 todo
    // $("pause_icon").click(pause());
});




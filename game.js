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
    showBetAndBank();
    // todo log
}

// 顯示Bet及Bank資訊
function showBetAndBank(){
    $("#bet").text(`BET: ${playerBet}`);
    $("#bank").text(`BANK: ${playerMoney}`);
}

function deal_first(){
    // 清空桌面上的chip
    $("#chipArea").hide();

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

    $("#chipArea").show();
    $("#resetBet").show();
    
    $(".pointinfo").hide();
    $("#split1Cards, #split2Cards").hide();
    $("#result").hide();

    $("#chip").show();
    $("#chip").css("visibility", "visible");
    
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

    $("#deal").click(function(){
        deal_first();
    });
    // 暫停鍵 todo
    // $("pause_icon").click(pause());
});




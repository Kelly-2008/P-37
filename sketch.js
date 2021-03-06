var database;
var foodS,foodStock;
var dog,dogImg,happyDog;
var position;
var feed,add,last; 
var foodobject;
var Feedtime;
var Lastfeed;
var milk,milkImg;
var garden, bedroom, washroom;
var readState, gameState;

function preload(){
  dogImg = loadImage("virtual pet images/Dog.png");
  happyDog = loadImage ("virtual pet images/Happy.png");
  milkImg = loadImage("virtual pet images/milk.png");
  garden = loadImage("virtual pet images/Garden.png");
  bedroom = loadImage("virtual pet images/Bed Room.png");
  washroom = loadImage("virtual pet images/Wash Room.png");
}

function setup() {
  createCanvas(1000, 500);
  database = firebase.database();

  readState = database.ref('gameState');
  readState.on("value",function(data){
  gameState = data.val();
  })
  
  milk=new Food();

  background(32,178,170);

  dog = createSprite(550,250,100,100);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  foodStock = database.ref('Food')
  foodStock.on("value",readStock);

  lastFeed = database.ref('FeedTime')
  lastFeed.on("value",readTime)

  var dogo = database.ref('Food');
  dogo.on("value", readPosition, showError);

  feed = createButton("FEED THE DOG")
  feed.position(700,115)
  feed.mousePressed(FeedDog)
  add = createButton("ADD FOOD")
  add.position(600,115)
  add.mousePressed(AddFood)
 
 drawSprites();  
}

function draw(){
  
  currentTime = hour();
  if (currentTime === (lastFeed + 1)) {
    update("Playing");
    milk.Garden();
  } else if(currentTime === (lastFeed + 2)) {
    update("Sleeping");
    milk.Bedroom();
  } else if (currentTime > (lastFeed + 2) && currentTime <= (lastFeed + 4)) {
    update("Bathing");
    milk.Washroom();
  } else {
    update("Hungry");
    milk.display();
  }
  
  
  if (gameState !== "Hungry") {
    feed.hide();
    add.hide();
    dog.remove();
  } else {
    feed.show();
    add.show();
    dog.addImage(dogImg);
  }

  drawSprites();
}

function readPosition(data){
  position = data.val();
  milk.updateFoodStock(position)
}

function showError(){
  console.log("Error in writing to the database");
}

function writePosition(nazo){
  if(nazo>0){
    nazo=nazo-1
  }
  else{
    nazo=0
  }
  database.ref('/').set({
    'Food': nazo
  })

}

function AddFood(){
  position++
  database.ref('/').update({
    Food:position
  })
}

function FeedDog(){

  dog.addImage(happyDog);
  milk.updateFoodStock(milk.getFoodStock()-1)
   database.ref('/').update({
     Food:milk.getFoodStock(),
     FeedTime:hour()
   })
  }

function update(state) {
  database.ref('/').update({
    gameState:state
  })
}

function readTime(time){
  Feedtime = time.val()
}

function readStock(data){
 foodS = data.val();

}

function writeStocks(x){
  if(x<=0){
    x=0;
  }
  else{
    x=x-1
  }

  database.ref('/').update({
    Food:x
  })
}

function setToHour(){
  pasttime = "Undifined"
  if(Feedtime){
    if(Feedtime >=12){
    pasttime = Feedtime- 12 +"PM"
   }
   else {
     pasttime = Feedtime +"AM"
   }
 }
}
var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var feed;
var foodObj;
var lastFed;
var lastFedData;

function preload()
{
  sadDog=loadImage("Dog.png");
  happyDog=loadImage("happy dog.png");
}

function setup()
{
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  lastFedData = database.ref('LastFeed');
  lastFedData.on("value", (data) =>
  {
    lastFed = data.val();
  });
  
  dog=createSprite(800,200,150,150);
  dog.addImage('sad', sadDog);
  dog.addImage('happy', happyDog);
  dog.changeImage('sad');
  dog.scale = 0.15;

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  feed = createButton("Feed");
  feed.position(750, 95);
  feed.mousePressed(feedDog);
}

function draw()
{
  background(46,139,87);
  foodObj.display();

  textSize(15);
  fill('black');
  text("Last fed on\n\n" + lastFed, 400, 80);

  textSize(30);
  text("Amount of Food: " + foodS, 50, 50);

  drawSprites();
}

function readStock(data)
{
  var val = data.val();
  if (val < foodS)
  {
    dog.changeImage('happy');
  }
  if (val > foodS)
  {
    dog.changeImage('sad');
  }
  foodS = val;
  foodObj.updateFoodStock(foodS);
}


function feedDog()
{
  if (!foodS)
    return;
  dog.changeImage('happy');
  foodS--;
  lastFed = getFormattedDate();
  database.ref('/').update(
    {
      Food:foodS,
      LastFeed:lastFed
  });   
}

function addFoods()
{
  if (foodS == undefined)
    return;
  dog.changeImage('sad');
  foodS++;
  database.ref('/').update(
  {
    Food:foodS
  });
}

function getFormattedDate()
{
  var d = new Date();
  var date = d.toDateString();
  var time = d.toLocaleTimeString();
  var formatDate = date + " at " + time.slice(0,time.length-6) + time.slice(time.length-3, time.length) + "\n [" + d.toString().slice(25, d.toString().length) + "]";
  delete d;
  return formatDate;
}
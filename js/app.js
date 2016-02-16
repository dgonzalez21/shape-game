/*
 * This is the first game. It's a standalone game that can be initiated by running shapeMatch.go()
 */

function shapeMatch() {
    /*global Phaser*/
    /*global randomColor*/
    
    
    
    function randomNum(min , max){
        return Math.floor(Math.random() * (max - min + 1)) + min ;
    }
    /*
     * Purpose: To set up game engine and get it going
     * Called: Once by user
     */
    
    this.go = function() {


        //this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;

        //store browser dims at start of game
        this.pW = window.innerWidth;
        this.pH = window.innerHeight;

      
        this.cX = this.pW / 2;
        this.cY = this.pH / 2;


        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'shapeMatch', {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render

        });

   

    }


    /*
     *  Purpose: Preload media assets and game vars
     *  Called: Once on just before game is created.
     */

    this.preload = function() {
        //Assorted varibles
        this.frameInterval = -1;

        //These are just shortcuts. cX,cY mean center x and center y
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.cX = this.w / 2;
        this.cY = this.h / 2;

        this.offset = this.w * .2; //Offset from the center about 20% the width of the screen

        /*
         *   Hold the 4 positions in array with JSON for x,y values for easy swapping
         *   0 = Left
         *   1 = Right
         *   2 = Top
         *   3 = Bottom
         */
        this.positions = [];
        this.positions[0] = {
            x: ((this.cX - 50) + this.offset),
            y: (this.cY - 50)
        };
        this.positions[1] = {
            x: ((this.cX - 50) - this.offset),
            y: this.cY
        };
        this.positions[2] = {
            x: (this.cX - 50),
            y: ((this.cY - 50) + this.offset)
        };
        this.positions[3] = {
            x: (this.cX - 50),
            y: (this.cY - this.offset)
        };


        this.shapeColors = [];
        this.game.stage.backgroundColor = '#ecf0f1';

        //Load media assets
        this.game.load.image('star', 'imgs/star.png');
        this.game.load.image('triangle', 'imgs/triangle.png');

        this.ccNum = randomNum(0,3);
        this.gMode = true;// True = check color; False = check shape


    }

    /*
     *  Purpose: Create objects and other stuff that will is needed during the game.
     *  Called: Once on creation of game.
     */
    this.create = function() {

        var style = {
            font: "65px Arial",
            fill: "#ff0044",
            align: "center"
        };
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.countdown = this.game.add.text(this.cX * 2, 0, "1000", style);
        this.countdown.anchor.y = 0;
        this.countdown.anchor.x = 1;
        this.isGame = true;

        this.square = new Phaser.Rectangle(this.positions[0].x, this.positions[0].y, 100, 100); //Left
        this.circle = new Phaser.Circle(this.positions[1].x, this.positions[1].y, 100); //Right
        this.triangle = this.game.add.sprite(this.positions[2].x, this.positions[2].y, 'triangle'); //Bottom
        this.star = this.game.add.sprite(this.positions[3].x, this.positions[3].y, 'star'); //Top
        
        //this peice will change often
        this.player =  this.game.add.sprite(this.cX-50, this.cY-50, 'star'); //center
       

    }

    /*
     *  Purpose: Main game function that handles all game logic.
     *  Called: 60 times per second
     */
    this.update = function() {
        if (this.countdown.text > 0) //slighty fast then a second hehehe
            this.countdown.text -= 20;
        else if(this.nextRound){
            //game over check if they made or if they failed then reset 
            this.countdown.text = 800;
            this.nextRound = false;
            this.newColors= true;
           
        } else{
            this.isGame = false;
            this.countdown.text = 'You Lose'
        }
        if(this.isGame){
            if(this.cursors.up.isDown){
               
                if(this.prevColor[this.ccNum].replace('#', '0x') == this.star.tint){
                    console.log('You Won!');
                    this.nextRound = true;
                }else{
                    this.isGame = false;
                    this.countdown.text = 'You Lose'
                    
                }
                    
            } 
            if(this.cursors.down.isDown){
              
                if(this.prevColor[this.ccNum].replace('#', '0x') == this.triangle.tint){
                    console.log('You Won!');
                    this.nextRound = true;
                }else{
                    this.isGame = false;
                    this.countdown.text = 'You Lose'
                }
                
            }
            if(this.cursors.left.isDown){
               
                if(this.prevColor[this.ccNum] == this.prevColor[1]){
                    console.log('You Won!');
                    this.nextRound = true;
                }else{
                    this.isGame = false;
                    this.countdown.text = 'You Lose'
                }
                
            }
            if(this.cursors.right.isDown){
              
                if(this.prevColor[this.ccNum] == this.prevColor[0]){
                    console.log('You Won!');
                    this.nextRound = true;
                }else{
                    this.isGame = false;
                    this.countdown.text = 'You Lose'
                }
            }
        }



    }

    /*
     *  Purpose: Render graphics objects to the screen
     *  Called: when objects are rendered to the screen
     */
    this.render = function() {
        function newColors(length) {
            var colors = generateRandomColors(length); //Function by some really smart dude on stackoverflow
                
            
            console.log('Color Change!: ' + colors)

            return colors;
        }
        
       
        //Change color of square every 120 frames (~2 sec)
        if (this.newColors) {
            this.prevColor = this.shapeColors;
            this.shapeColors = newColors(4);

            this.game.debug.geom(this.square, this.shapeColors[0]);
            this.game.debug.geom(this.circle, this.shapeColors[1]);
            this.triangle.tint = this.shapeColors[2];
            this.star.tint = this.shapeColors[3];
            this.ccNum = randomNum(0,3);
           
            switch(randomNum(1,4)){
                case 1:
                    if(!this.player.g){
                        this.player.destroy();
                    }
                    this.player = new Phaser.Rectangle(this.cX-50, this.cY-50, 100, 100); //Left
                    this.player.g = true;
                    break;
                case 2:
                    if(!this.player.g){
                        this.player.destroy();
                    }
                    this.player = new Phaser.Circle(this.cX, this.cY, 100);
                    this.player.g = true;
                    break;
                case 3:
                    if(!this.player.g){
                        this.player.destroy();
                    }
                    this.player =  this.game.add.sprite(this.cX-50, this.cY-50, 'triangle');
                    this.player.tint = this.shapeColors[this.ccNum].replace('#', '0x');
                    break;
                case 4:
                    if(!this.player.g){
                        this.player.destroy();
                    }
                    this.player =  this.game.add.sprite(this.cX-50, this.cY-50, 'star');
                    this.player.tint = this.shapeColors[this.ccNum].replace('#', '0x');
                    break;
                default://just make a star
                    if(!this.player.g){
                        this.player.destroy();
                    }
                    this.player =  this.game.add.sprite(this.cX-50, this.cY-50, 'star');
                    this.player.tint = this.shapeColors[this.ccNum].replace('#', '0x');
                    break;
                    
            }
            this.frameInterval = 0;
            this.newColors = false;


        } else if (this.frameInterval == -1) {

            this.shapeColors = newColors(4);
            this.prevColor = this.shapeColors;

            this.game.debug.geom(this.square, this.shapeColors[0]);
            this.game.debug.geom(this.circle, this.shapeColors[1]);
            this.triangle.tint = this.shapeColors[2].replace('#', '0x');
            this.star.tint = this.shapeColors[3].replace('#', '0x');
            this.player.tint = this.shapeColors[0].replace('#', '0x');


        } else {

            this.game.debug.geom(this.square, this.prevColor[0]);
            this.game.debug.geom(this.circle, this.prevColor[1]);
            this.triangle.tint = this.prevColor[2].replace('#', '0x');
            this.star.tint = this.prevColor[3].replace('#', '0x');
            
            if(this.player.g){
                
                this.game.debug.geom(this.player, this.prevColor[this.ccNum]);
            }else{
             
             
                this.player.tint = this.prevColor[this.ccNum].replace('#', '0x');
            }
            



        }


        this.frameInterval += 1;


    }


}

var game = new shapeMatch();
game.go();
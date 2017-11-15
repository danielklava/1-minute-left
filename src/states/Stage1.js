import Player from '../objects/Player';
import Obstacle from '../objects/Obstacle';

class Stage1 extends Phaser.State {

	create() {
		this.camera.flash("#000000");
		this.inputEnabled = false;

		var gravity = 350;
		var stageLength = 144 * 4;

		//Enble Arcade Physics
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = gravity;

		//stage world settings
		this.adjustStageWorld(stageLength);

		//create stage background
		this.createBackground();
		this.createObjects();	
		this.createActors();
		
		//add phisics to elements (oh, really?)
		this.addPhysicsToElements(gravity);

		//camera settings
		this.adjustCamera();
		this.game.stage.smoothed=false;

		this.timer = this.game.time.create();
		this.timerEvent = this.timer.add(Phaser.Timer.MINUTE * 0.5, this.endTimer, this);
		this.timer.start();
		this.timerText = this.game.add.bitmapText(100, 65, "font", "", 16);

		this.timerText.fixedToCamera = true;
		this.timerText.cameraOffset.setTo(100,65);

		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.fireButton = this.game.input.keyboard.addKey(Phaser.KeyCode.CONTROL);
		this.actionButton = this.game.input.keyboard.addKey(Phaser.KeyCode.SHIFT);

		this.camera.follow(this.hero, Phaser.Camera.FOLLOW_PLATFORMER, 0.1, 0.1);

		this.jumpSound = this.game.add.audio('jump');
		this.shootSound = this.game.add.audio('shoot');
		this.raptorSound = this.game.add.audio('raptorSound');
		this.themeMusic = this.game.add.audio('theme', 1, true);
		this.themeMusic.play();

	}
	addDialogText(speaker, sentence){
		this.inputEnabled = false;
		
		var offsetX = this.game.camera.x;

		this.dialog = this.game.add.sprite(1 + offsetX, 1, 'dialog');
		this.portrait = this.game.add.sprite(3 + offsetX,3, speaker.toLowerCase() + "_portrait");
		this.portrait.animations.add('talk');
		this.portrait.animations.play('talk', 16, true);

		this.speaker = this.game.add.bitmapText(25 + offsetX, 5, "font", speaker + ":", 8);
		this.buffer  = this.game.add.bitmapText(25 + offsetX, 15, "font", "", 8);
		
		var i =-1;
		this.game.time.events.loop(Phaser.Timer.SECOND*0.10, function() {
			if (i == sentence.length - 1){
				this.game.time.events.add(Phaser.Timer.SECOND * 2, function(){
					this.dialog.destroy();
					this.portrait.destroy();
					this.speaker.destroy();
					this.buffer.destroy();
					this.game.time.events.stop();
					this.inputEnabled = true;
				}, this);
			}
			else{
				i++;
				this.buffer.text = this.buffer.text + sentence[i];
			}
		}, this);

	}
	endTimer() {
        // Stop the timer when the delayed event triggers
        this.timer.stop();
    }
    formatTime(s) {
        // Convert seconds (s) to a nicely formatted and padded time string
        var minutes = "0" + Math.floor(s / 60);
		var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);   
    }
	adjustStageWorld(stageLength){
		this.game.world.setBounds(0, 0, stageLength, this.game.height	);
	}
	createActors  (){
  		//creating ground sprite
  		this.ground = this.add.tileSprite(0,this.game.height - 10  ,this.game.world.width, 10, 'ground');

		this.hero = new Player(this.game, 70, 51);

		this.car = this.game.add.sprite(-100, 50,'car-idle');
		
		this.weapon = this.game.add.weapon(5, 'bullet');
		this.weapon.bulletSpeed = 100;
		//this.weapon.fireLimit = 1;
		this.weapon.fireRate = 500;
		this.weapon.fireAngle = Phaser.ANGLE_RIGHT;
		this.weapon.bulletKillDistance = 45;
		this.weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
		this.weapon.bulletGravity.y = -350;
		
		this.weapon.trackSprite(this.hero, 5, -2, true);
		this.weapon.trackRotation = false;

		this.carArrives = this.add.tween(this.car).to({ x:0}, 2000, Phaser.Easing.Cubic.InOut, true, 0, 0, false);
		this.carArrives.onComplete.add(this.showHero, this);
		this.carArrives.start();

		this.raptor = this.game.add.sprite(190,45 ,'raptor');
		this.raptor.scale.x *= -1;
		this.raptor.animations.add('run', Phaser.Animation.generateFrameNames('raptor_run', 0, 6,"",1), 6, true);
		this.raptor.animations.play('run');
		this.raptor.anchor.set(0.5);
		this.raptor.deathSound = this.raptorSound;

		this.raptor2 = this.game.add.sprite(290,30 ,'raptor');
		this.raptor2.scale.x *= -1;
		this.raptor2.anchor.set(0.5);
	}
	createObjects (){
		this.objects = this.add.group();
		
		this.container01 = new Obstacle(this.game, 110, this.getObjectPositionAboveGround('container01'), 'container01');
		
		this.container02 = this.add.sprite(280, this.getObjectPositionAboveGround('container01'),'container01');
		this.cardboardbox = this.add.sprite(
			80,
			this.getObjectPositionAboveGround('cardboardbox'),
			'cardboardbox'
		);
		
		this.objects.add(this.container01);
		this.objects.add(this.container02);
		this.objects.add(this.cardboardbox);

		this.eventLab = this.add.sprite(-200, -1000);
		//this.eventLab.scale.y = this.game.height;
	}
	showHero (){
		this.hero.alpha = 1;
		this.addDialogText("Selene", "You must stop Dr. Stein!");
	}
  	createBackground(stageLength){
  		this.game.stage.backgroundColor = "#FFF";
	
		this.addImageToBackground('background');
		this.addImageToBackground('clouds');
		this.addImageToBackground('city-far');
		this.addImageToBackground('city-mid');
		this.addImageToBackground('city-front');
		this.addImageToBackground('fence', 0, 37);
		this.addImageToBackground('road');
    

		//LAB BG
		this.bgLab = this.game.add.sprite(144*3, 0, 'bg-lab');     
		this.labWalls = this.game.add.sprite(144*3, 0, 'lab-walls');          
		this.labComputer = this.game.add.sprite(505, 50, 'lab-computer');     
		this.labEnergy = this.game.add.sprite(144*3, 0, 'lab-energy');     
		
		this.add.tween(this.labEnergy).to({y: -5}, 1000, Phaser.Easing.Cubic.InOut, true, 1, 1000, true);		
  	}
  	orderStageElements() {
	    this.game.world.bringToTop(this.background);
	    this.game.world.bringToTop(this.clouds);
	    this.game.world.bringToTop(this.cityFar);
	    this.game.world.bringToTop(this.cityMid);
	    this.game.world.bringToTop(this.cityFront);
	    this.game.world.bringToTop(this.car);
	}
  	addPhysicsToElements(gravity){
  		this.physics.arcade.enable(this.hero);
		this.physics.arcade.enable(this.ground);
		this.physics.arcade.enable(this.labComputer);
		this.physics.arcade.enable(this.container01);
		this.physics.arcade.enable(this.container02);
		this.physics.arcade.enable(this.cardboardbox);
		this.physics.arcade.enable(this.raptor);
		this.physics.arcade.enable(this.raptor2);

		this.physics.arcade.enable(this.eventLab);

		this.eventLab.enableBody = true;
		this.eventLab.body.immovable = true;
		this.eventLab.body.allowGravity = false;

		this.labComputer.enableBody = true;
		this.labComputer.body.immovable=true;
		this.labComputer.body.allowGravity=false;
		
		this.container02.enableBody = true;
		this.container02.body.immovable=true;
		this.container02.body.allowGravity=false;

		this.cardboardbox.enableBody = true;
		this.cardboardbox.body.immovable=true;
		this.cardboardbox.body.allowGravity=false;

		this.ground.body.immovable = true;
	    this.ground.body.allowGravity = false;

		this.hero.body.gravity.y = gravity;
		this.hero.body.collideWorldBounds = true;
		this.hero.body.maxVelocity.y = 500;
		this.hero.body.setSize(12,21);

		this.raptor.body.allowGravity=true;
		this.raptor.enableBody = true;
		this.raptor.body.collideWorldBounds = true;

		this.raptor2.body.allowGravity=true;
		this.raptor2.enableBody = true;
		this.raptor2.body.collideWorldBounds = true;

  	}
  	adjustCamera(){
		this.game.camera.follow(this.hero);  
	}
	interactComputer (){
		console.log("Interact");
		if (this.actionButton.isDown){
			this.status = "WIN";
			this.camera.fade("#000000",1500);
			this.camera.onFadeComplete.add(function(){			
				this.state.start('GameTitle', true, false);
			}, this);
		}
	}
	update() {
		this.updateBackground();

		if (this.checkOverlap(this.hero, this.eventLab)) this.startEventLab();

		this.physics.arcade.collide(this.hero, this.ground, this.playerHit, null, this);
		this.physics.arcade.overlap(this.hero, this.labComputer, this.interactComputer, null, this);
		this.physics.arcade.collide(this.hero, this.container01);
		this.physics.arcade.collide(this.hero, this.container02);
		this.physics.arcade.collide(this.hero, this.cardboardbox);
		this.physics.arcade.collide(this.hero, this.raptor, this.restartStage, null, this);
		this.physics.arcade.collide(this.hero, this.raptor2, this.restartStage, null, this);
		this.physics.arcade.overlap(this.weapon.bullets, this.raptor, this.bulletHitEnemy, null, this);
		this.physics.arcade.overlap(this.weapon.bullets, this.raptor2, this.bulletHitEnemy, null, this);
		this.physics.arcade.collide(this.objects, this.raptor, this.enemyHitWall);
		this.physics.arcade.collide(this.raptor, this.ground);
		this.physics.arcade.collide(this.raptor2, this.ground);
		this.physics.arcade.collide(this.raptor, this.objects);
		this.physics.arcade.collide(this.raptor2, this.objects);
		
		this.hero.body.velocity.x = 0;
		
		if (this.inputEnabled){
			if (this.cursors.left.isDown)
			{
				this.hero.body.velocity.x = -45;
				if (this.hero.scale.x > 0){
					this.hero.scale.x *=-1;
				}

				this.weapon.fireAngle = Phaser.ANGLE_LEFT;
			}
			else if (this.cursors.right.isDown)
			{
				this.hero.body.velocity.x = 45;
				if (this.hero.scale.x < 0){
					this.hero.scale.x *=-1;
				}

				this.weapon.fireAngle = Phaser.ANGLE_RIGHT;
			}

			if (this.jumpButton.isDown && this.hero.body.touching.down){
				this.hero.body.velocity.y = -210;
				this.jumpSound.play();
			}

			if (this.fireButton.isDown){
				this.weapon.fire();
				this.shootSound.play();
			}
		}

		if (this.hero.body.velocity.y != 0){
			this.hero.animations.play('jump');
		}else{
			if (this.hero.body.velocity.x == 0){
				this.hero.animations.play('idle');
			}
			else{
				this.hero.animations.play('run');
			}
		}

		this.updateEnemies();
	}
	startEventLab (){
		this.addDialogText('Selene', 'This is it.');
	}
	restartStage (){
		this.game.state.restart();
	}
	updateEnemies (){
		if (this.raptor.body != null)
			if (Math.random() > 0.5){
				if (this.raptor.scale.x > 0){
					this.raptor.body.velocity.x = 30;
				}
				else {
					this.raptor.body.velocity.x = -30;
				}
			}
	}
	enemyHitWall  (enemy, object){
		if (enemy.body.touching.left || enemy.body.touching.right){	
			enemy.scale.x *= -1;
		}
	}
	bulletHitEnemy (bullet, object){	
		bullet.destroy();	

		object.destroy();

		this.raptorSound.play();
	}
	updateBackground (){
		this.background.tilePosition.x -= 0.03;
		this.clouds.tilePosition.x -=  0.05	;
	}
	render (){
		if (this.status == "WIN"){
			this.timerText.text = "You won!";
		}
		else{
			if (this.timer.running) {
				var runningTime = this.formatTime(Math.round((this.timerEvent.delay - this.timer.ms) / 1000));
				//this.game.debug.text(runningTime, 2, 70, "#ff0");
				this.timerText.text = runningTime;
			}
			else {
				//this.game.debug.text("Failed!", 2, 70, "#0f0");
				this.timerText.text = "Failed";
				this.restartStage();
			}
		}

		this.game.debug.body(this.eventLab);
		this.game.debug.body(this.hero);

		console.log("Hero: " + this.hero.x + " " + this.hero.y);
	}

	getGroundPositionY (){
		return this.game.height - this.game.cache.getImage('ground').height;
	}
	
	getObjectPositionAboveGround (spriteName){
		return this.getGroundPositionY() - this.game.cache.getImage(spriteName).height;
	}
	
	checkOverlap (spriteA, spriteB) {
		var boundsA = spriteA.getBounds();
		var boundsB = spriteB.getBounds();
	
		return Phaser.Rectangle.intersects(boundsA, boundsB);
	}

	addImageToBackground(imageName, x, y){
		if (!x) x = 0;
		if (!y) y = this.game.height - this.game.cache.getImage(imageName).height; 

		this[imageName] = this.game.add.tileSprite(
			x
			, y 
			, this.game.world.width
			, this.game.cache.getImage(imageName).height
			,imageName
		);   
	}
};

export default Stage1;
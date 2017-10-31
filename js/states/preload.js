var Main = Main || {};

Main.Preload = function (){};

Main.Preload.prototype = {
  preload : function() {
    this.game.load.image('gameTitle',    'assets/images/gametitle.png');

    this.game.load.image('city-far',    'assets/images/city-far.png');
    this.game.load.image('city-front',  'assets/images/city-front.png');
    this.game.load.image('city-mid',    'assets/images/city-mid.png');
    this.game.load.image('clouds',      'assets/images/clouds.png');
    this.game.load.image('fence',       'assets/images/fence.png');
    this.game.load.image('background',  'assets/images/background.png');
    this.game.load.image('road',        'assets/images/road.png');
    this.game.load.image('container01', 'assets/images/container_01.png');
    this.game.load.image('cardboardbox',   'assets/images/cardboardbox.png');
    this.game.load.image('ground',      'assets/images/ground.png');
    this.game.load.image('menu-start',  'assets/images/menu-start.png');

    this.game.load.image('bg-lab',  'assets/images/bg_lab.png');
    this.game.load.image('lab-walls',  'assets/images/lab_walls.png');
    this.game.load.image('lab-computer',  'assets/images/lab_computer.png');
    this.game.load.image('lab-energy',  'assets/images/lab_energy.png');

    //CAR
    this.game.load.image('car-idle',    'assets/images/car-idle.png');
    this.game.load.spritesheet('car-driving', 'assets/images/car-sheet.png', 70, 18, 2);

    //HERO
    this.game.load.atlas('hero',  'assets/images/hero_atlas.png', 'assets/images/hero_atlas.json');

    //BULLET
    this.game.load.image('bullet',  'assets/images/bullet.png');

    //ENEMIES
    this.game.load.atlas('raptor',  'assets/images/raptor_atlas.png', 'assets/images/raptor_atlas.json');

    //AUDIO
    this.game.load.audio('theme', ['assets/audio/theme.wav'], true);
    this.game.load.audio('jump', ['assets/audio/jump.wav'], false);
    this.game.load.audio('raptorSound', ['assets/audio/raptor.wav'], false);
  },
  
  create : function() {
    
    this.stage.backgroundColor = "#000";

    this.state.start('GameTitle', true, false);
  },

  update : function() {}
}
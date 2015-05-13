module.exports = function(game) {

  var preloader = {};

  preloader.preload = function () {
    game.load.image('logo', 'images/phaser.png#grunt-cache-bust');

    game.load.atlas('clock', 'images/clock.png', 'images/clock.json')
  };

  preloader.create = function () {
    game.state.start('game');
  };

  return preloader;
};

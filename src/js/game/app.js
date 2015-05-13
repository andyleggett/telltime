var Phaser = require('Phaser'),
    R = require('ramda'),
    properties = require('./properties'),
    states = {
        boot: require('./states/boot.js'),
        preloader: require('./states/preloader.js'),
        game: require('./states/game.js')
    },
    game = new Phaser.Game(properties.size.x, properties.size.y, Phaser.AUTO, 'game');

// Automatically register each state.
R.compose(R.forEach(function(key) {
  game.state.add(key, states[key](game));
}), R.keys)(states);

game.state.start('boot');


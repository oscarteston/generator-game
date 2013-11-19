'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var GameGenerator = module.exports = function GameGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(GameGenerator, yeoman.generators.Base);

GameGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    type: 'list',
    name: 'library',
    message: 'Which library would you like to include?',
    choices: [{
      value: 'melonJS',
      name: 'Melon JS'
    }, {
      value: 'easeljs',
      name: 'Easel JS'
    }, {
      value: 'crafty',
      name: 'Crafty'
    }];

  this.prompt(prompts, function (props) {
    this.library = props.library;
    console.log(this.library);
    
    cb();
  }.bind(this));
};

GameGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/templates');

  this.copy('_package.json', 'package.json');
  this.copy('_bower.json', 'bower.json');
};

GameGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};

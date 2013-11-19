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
    },
    {
    type: 'checkbox',
    name: 'features',
    message: 'What more would you like?',
    choices: [{
      name: 'Bootstrap for Sass',
      value: 'compassBootstrap',
      checked: true
    }, {
      name: 'Modernizr',
      value: 'includeModernizr',
      checked: true
    }]
  }];

  this.prompt(prompts, function (props) {
    var features = answers.features;

    function hasFeature(feat) { return features.indexOf(feat) !== -1; }

    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.compassBootstrap = hasFeature('compassBootstrap');
    this.includeModernizr = hasFeature('includeModernizr');

    this.gameLibrary  = props.library;

    mapPropertiesGameLibrary();


    console.log(this.library);

    cb();
  }.bind(this));
};

function mapPropertiesGameLibrary(){
  switch(this.gameLibrary.value){
    case "melonJS":
      this.gameLibrary.src = "bower_components/melonjs/melonjs.js";
      this.gameLibrary.version = "2.0.3";
    break;
  }
}

GameGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};

GameGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

GameGenerator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

GameGenerator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

GameGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.copy('_bower.json', 'bower.json');
};

GameGenerator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

GameGenerator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

GameGenerator.prototype.h5bp = function h5bp() {
  this.copy('favicon.ico', 'app/favicon.ico');
  this.copy('404.html', 'app/404.html');
  this.copy('robots.txt', 'app/robots.txt');
  this.copy('htaccess', 'app/.htaccess');
};

GameGenerator.prototype.mainStylesheet = function mainStylesheet() {
  if (this.compassBootstrap) {
    this.copy('main.scss', 'app/styles/main.scss');
  } else {
    this.copy('main.css', 'app/styles/main.css');
  }
};

GameGenerator.prototype.writeIndex = function writeIndex() {

  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  this.indexFile = this.engine(this.indexFile, this);
  this.indexFile = this.appendScripts(this.indexFile, 'scripts/main.js', [
    'scripts/main.js'
  ]);

  if (this.compassBootstrap) {
    // wire Twitter Bootstrap plugins
    this.indexFile = this.appendScripts(this.indexFile, 'scripts/plugins.js', [
      'bower_components/sass-bootstrap/js/affix.js',
      'bower_components/sass-bootstrap/js/alert.js',
      'bower_components/sass-bootstrap/js/dropdown.js',
      'bower_components/sass-bootstrap/js/tooltip.js',
      'bower_components/sass-bootstrap/js/modal.js',
      'bower_components/sass-bootstrap/js/transition.js',
      'bower_components/sass-bootstrap/js/button.js',
      'bower_components/sass-bootstrap/js/popover.js',
      'bower_components/sass-bootstrap/js/carousel.js',
      'bower_components/sass-bootstrap/js/scrollspy.js',
      'bower_components/sass-bootstrap/js/collapse.js',
      'bower_components/sass-bootstrap/js/tab.js'
    ]);
  }

  if(this.gameLibrary) {
    /*this.gameLibrary.dependencies 
    this.indexFile = this.appendScripts(this.indexFile, 'scripts/'+this.gameLibrary.name'.js', [
      this.gameLibrary.src,
      'bower_components/sass-bootstrap/js/alert.js',
      'bower_components/sass-bootstrap/js/dropdown.js',
      'bower_components/sass-bootstrap/js/tooltip.js',
      'bower_components/sass-bootstrap/js/modal.js',
      'bower_components/sass-bootstrap/js/transition.js',
      'bower_components/sass-bootstrap/js/button.js',
      'bower_components/sass-bootstrap/js/popover.js',
      'bower_components/sass-bootstrap/js/carousel.js',
      'bower_components/sass-bootstrap/js/scrollspy.js',
      'bower_components/sass-bootstrap/js/collapse.js',
      'bower_components/sass-bootstrap/js/tab.js'
    ]);
  }*/
};

AppGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/scripts');
  this.mkdir('app/styles');
  this.mkdir('app/images');
  this.write('app/index.html', this.indexFile);

};
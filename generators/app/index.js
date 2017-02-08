'use strict';
const path = require('path');
const Generator = require('yeoman-generator');
const _ = require('lodash');
const extend = require('deep-extend');
const mkdirp = require('mkdirp');
const yosay = require('yosay');
var chalk = require('chalk');
var rename = require("gulp-rename");

const middlewarePostfix = '-middleware';

function makeGeneratorName(name) {
  name = _.kebabCase(name);
  name = name.slice(-middlewarePostfix.length) == middlewarePostfix ? name : name + middlewarePostfix;
  return name;
}

module.exports = class extends Generator {
  initializing() {
    this.props = {};
  }

  prompting() {
    //Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the epic ' + chalk.red('generator-core-middleware') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'What should the middleware be called. e.g. performance-logger?',
      default: makeGeneratorName(path.basename(process.cwd())),
      filter: makeGeneratorName,
      validate: str => {
        return str.length > middlewarePostfix.length;
      }
    },
    {
      type: 'confirm',
      name: 'jenkinsfile',
      message: 'Do you want me to generate a Jenkinsfile for you?',
    }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  }

  default() {    
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        'Your generator must be inside a folder named ' + this.props.name + '\n' +
        'I\'ll automatically create this folder.'
      );
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }


  }

  writing() {

    var CLASSNAME = _.upperFirst(_.camelCase(this.props.name));
    var NAMESPACE = CLASSNAME.replace('Middleware', '');
    
    var TMP = this;
        this.registerTransformStream(rename(function(path) {
            path.basename = path.basename.replace(/(_name_)/g, TMP.props.name);
            path.basename = path.basename.replace(/(_classname_)/g, CLASSNAME);
            path.dirname = path.dirname.replace(/(_name_)/g, TMP.props.name);
        }));
        
    this.fs.copyTpl(
              this.templatePath('**/*'),
              this.destinationPath(), {
                  name: this.props.name,
                  classname: CLASSNAME,
                  namespace: NAMESPACE
              }            
          );
  }

  install() {
    // this.installDependencies({bower: false});
  }

  end() {
    this.spawnCommand('dotnet', ['restore']);
  }
};

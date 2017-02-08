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
const classPostfix = 'Middleware';

function makeGeneratorName(name) {
  name = _.kebabCase(name);
  name = name.slice(-middlewarePostfix.length) == middlewarePostfix ? name : name + middlewarePostfix;
  return name;
}

function makeClassName(name) {
  name = _.kebabCase(name);
  name = name.slice(-classPostfix.length) == classPostfix ? name : name + classPostfix;
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
      type: 'input',
      name: 'namespace',
      message: 'What should the namespace of the project be called?',
      default: path.basename(process.cwd()),
      validate: str => {
        return str.length > 0;
      }
    },
    {
      type: 'input',
      name: 'classname',
      message: 'What should the class of the project be called?',
      default: makeClassName(path.basename(process.cwd())),
      validate: str => {
        return str.length > 0;
      }
    }];

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
    var THAT = this;
        this.registerTransformStream(rename(function(path) {
            path.basename = path.basename.replace(/(_name_)/g, THAT.props.name);
            path.basename = path.basename.replace(/(_classname_)/g, THAT.props.classname);
            path.dirname = path.dirname.replace(/(_name_)/g, THAT.props.name);
        }));
        
    this.fs.copyTpl(
              this.templatePath('**/*'),
              this.destinationPath(), {
                  name: this.props.name,
                  classname: this.props.classname,
                  namespace: this.props.namespace
              }
          );
  }

  install() {
    // this.installDependencies({bower: false});
  }
};





// 'use strict';
// var Generator = require('yeoman-generator');
// var chalk = require('chalk');
// var yosay = require('yosay');

// function makeProjectName(name) {
//   name = _.kebabCase(name);
//   name = name.indexOf('-middleware') === 0 ? name : name + '-middleware';
//   return name;
// }

// module.exports = Generator.extend({
//   prompting: function () {
//     // Have Yeoman greet the user.
//     this.log(yosay(
//       'Welcome to the epic ' + chalk.red('generator-core-middleware') + ' generator!'
//     ));

//     var prompts = [{
//       type: 'input',
//       name: 'projectName',
//       message: 'What should the middleware be called. e.g. performance-logger?',
//       default: makeProjectName(path.basename(process.cwd())),
//       filter: makeProjectName,
//       validate: str => {
//         return str.length > '-middleware'.length;
//       }
//     }];

//     return this.prompt(prompts).then(function (props) {
//       // To access props later use this.props.someAnswer;
//       this.props = props;
//     }.bind(this));
//   },

//   writing: function () {
//     this.fs.copy(
//       //replace placeholders....
//       this.templatePath('dummyfile.txt'),
//       this.destinationPath('dummyfile.txt')
//     );
//   },

//   install: function () {
//     // this.installDependencies();
//   }
// });

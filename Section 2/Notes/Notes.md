# Section 2 Notes
## The story of NodeJS

Conception in 2009 by Ryan Dahl

Lukewarm almost hostile welcome

Npm made in 2010 by Isaac Schlueter

MongoDB in 2009
With the of social media, social media APIs became more and more popular these relied heavily on JSON which is integrated in javascript

MEAN package:
- MongoDB/Mongoose
- ExpressJS
- AngularJS
- Node for windows / npm

## What is v8, exactly?

“V8 = The Chrome V8 Javascript Engine”

Modern Computers only understand “Machine Code”
This is a “low-level” language
Javascript is a “High-level” language
Though these terms are relative

**In order for a computer to execute “high-level” code it needs to use**
- Interpreters
- Compilers
- Transpilers

**V8 is a javascript interpreter**
- V8 is inside of Chrome
- JavascriptCore (iOS, safari)
- SpiderMonkey (Firefox)
- Chakra (Internet Explorer)

## What is Node.js, exactly?
Node.js is a server-side javascript runtime environment
It runs on a server or computer and feeds the V8 engine with the code

V8 is the car engine and Node.js is everything else that makes the car.
You are the driver.

Node.js is a C++ application that embeds V8

Node.js now presents itself as two applications
1. A script processor
2. A REPL (Read Eval Print Loop)

The script processor can be called with:
node {script name} (eg: node index.js)

First initializes an event loop

The eventloop is continually checking if there is any new for Node.JS to do.

Most of the time a web application is sitting around waiting for some task to finish

Asynecrones behavior allows for the application to carry out other tasks while waiting.

Process of the node processor
1. Reads in the file specified by the execute command.
2. Reads in all the dependencies that file specifies, and all the dependencies of those files etc.
3. Begins executing the synchronous tasks in those files.
4. Begins processing the “todo list” by repeating the event loop until it has nothing to do. 

The REPL is executed by typing “node”, without any file specified

Process of the REPL
1. Reads the command typed.
2. Evaluates the command.
3. Prints the evaluated command.
4. Loops back up to read.

## Anatomy of a Node.js Application
The root js document is typically called “index.js”, if node is executed with a directory instead of a file, then node.js will look for the “index.js” file in that directory

**In a typical js document different sections will be outlined**

- Comment block
    - Typically stores meta information like 
        - The title of document
        - A description
        - An author
        - A date of creation
        - A version number
- Dependencies
    - Invoked with the require() method
    - Dependencies are scoped to the specific file who called it.
- Module scaffolding
- Configuration
- Function declaration
- Function invocations

## Common node conventions
- Package.json file
    - Dependency management
    - Is typically found in base directory
    - This file contains metadata about the project
    - It can contain a keyword called [“dependencies”: { “jokes”: “0.0.2” }] which is used by npm to install the dependency files in their specified versions.
        - These will be added to a folder called “node_modules”
        - Modules in this folder doesn’t need a path specified, and can just be called by their base directory
        - Var newJokes = require(‘jokes’) //will look in the “node_modules folder for a folder called jokes, which then contains an index.js file.
    - Npm install will also create a file called “package-lock.json”
- Testing
    - Testing script are commonly held in a /test directory, and are triggered by a “test runner” such as mocha or jest
        - Task running
        - Source control (git)
    - .git and .gitignore
    - Git repositories typically contains a readme.md file in base directory
- Environments & Configuration
- Styles and patterns
    - Airbnb JavaScript Style Guide(){
        - https://github.com/airbnb/javascript
- Error handling
    - Errback
- Avoid global variables
    - Don’t pollute the namespace

## Node.js vs. the browser
Node.js is not run in a browser which means that certain methods isn’t available

```javascript
window.open 
window.location
window.navigator
window.origin
window.focus
window.blur
window.scroll
window.alert
window.onload
document
document.body
onchange
onclick
onblur
oncopy
oncut
onscroll
onmouseenter
onmouseleave
```

Browser doesn’t support I/O

Node is one environment and doesn’t need cross-platform support
In node the source code is not visible to the end user as in a browser 



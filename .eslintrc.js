module.exports = {
    env: {
        node: true,
        browser: true,
        es6: true
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {}
    },
    rules: {
        // 1 Types

        // 1.1 Primitives: When you access a primitive type you work directly on its value.

        // 1.2 Complex: When you access a complex type you work on a reference to its value.


        // 2 References

        // 2.1 Use const for all of your references; avoid using var.
        "prefer-const": 2,
        "no-const-assign": 2,

        // 2.2 If you must reassign references, use let instead of var.
        "no-var": 2,
        "block-scoped-var": 0,


        // 3 Objects

        // 3.1 Use the literal syntax for object creation.
        "no-new-object": 2,

        /**
         * 3.3 Use object method shorthand.
         * 3.4 Use property value shorthand.
         */
        "object-shorthand": 2,

        // 3.6 Only quote properties that are invalid identifiers.
        "quote-props": [2, "as-needed"],

        // 3.7 Do not call Object.prototype methods directly, such as hasOwnProperty, propertyIsEnumerable, and isPrototypeOf.
        "no-prototype-builtins": 2,


        // 4 Arrays

        // 4.1 Use the literal syntax for array creation.
        "no-array-constructor": 2,

        /**
         * 4.7 Use return statements in array method callbacks. 
         *  It’s ok to omit the return if the function body consists of a single statement returning an expression without side effects, following 8.2.
         */
        "array-callback-return": 2,

        // 4.8 Use line breaks after open and before close array brackets if an array has multiple lines
        "array-bracket-newline": [0, { "multiline": true, "minItems": 3 }],
        "array-element-newline": [0, { "multiline": true, "minItems": 3 }],


        // 5 Destructuring

        // 5.1 Use object destructuring when accessing and using multiple properties of an object.
        "prefer-destructuring": 2,


        // 6 Strings

        // 6.1 Use single quotes '' for strings.
        "quotes": [2, "single"],

        // 6.3 When programmatically building up strings, use template strings instead of concatenation.
        "prefer-template": 2,
        "template-curly-spacing": 2,

        // 6.4 Never use eval() on a string, it opens too many vulnerabilities.
        "no-eval": 2,

        // 6.5 Do not unnecessarily escape characters in strings.
        "no-useless-escape": 2,


        // 7 Functions

        // 7.1 Use named function expressions instead of function declarations.
        "func-style": [2, "expression"],
        "func-names": 1,
        "func-name-matching": [0, "never"],

        // 7.2 Wrap immediately invoked function expressions in parentheses.
        "wrap-iife": 2,

        /**
         * 7.3 Never declare a function in a non-function block (if, while, etc).
         *  Assign the function to a variable instead.
         *  Browsers will allow you to do it, but they all interpret it differently, which is bad news bears.
         */
        "no-loop-func": 2,

        // 7.6 Never use arguments, opt to use rest syntax ... instead.
        "prefer-rest-params": 2,

        // 7.10 Never use the Function constructor to create a new function.
        "no-new-func": 2,

        // 7.11 Spacing in a function signature.
        // 19.2 Place 1 space before the leading brace.
        "space-before-function-paren": [2, {"named": "never"}],
        "space-before-blocks": 2,

        /**
         * 7.12 Never mutate parameters.
         * 7.13 Never reassign parameters.
         */
        "no-param-reassign": 2,

        // 7.14 Prefer the use of the spread operator ... to call variadic functions.
        "prefer-spread": 2,

        /**
         * 7.15 Functions with multiline signatures, or invocations, should be indented just like every other multiline list in this guide:
         *  with each item on a line by itself, with a trailing comma on the last item.
         */
        "function-paren-newline": 2,

        // ------------------new-------------------------

        // 7.16 Functions should always 
        "consistent-return": 2,

        // enforce a maximum function length
        'max-lines-per-function': ['warn', {
            max: 50,
            skipBlankLines: true,
            skipComments: true,
            IIFEs: true,
        }],

        // limits the number of parameters that can be used in the function declaration.
        'max-params': ['off', 3],


        // 8 Arrow Functions

        // 8.1 When you must use an anonymous function (as when passing an inline callback), use arrow function notation.
        "prefer-arrow-callback": 2,
        "arrow-spacing": 2,

        /**
         * 8.2 If the function body consists of a single statement returning an expression without side effects, omit the braces and use the implicit return.
         *  Otherwise, keep the braces and use a return statement.
         * 
         * 8.4 If your function takes a single argument and doesn’t use braces, omit the parentheses.
         *  Otherwise, always include parentheses around arguments for clarity and consistency.
         *  Note: it is also acceptable to always use parentheses, in which case use the “always” option for eslint.
         * 
         * Changed: always use parens to prevent confusion between => and >= in a statement.
         */
        "arrow-parens": 2,
        'arrow-body-style': ['error', 'as-needed', {
            requireReturnForObjectLiteral: false,
          }],

        // 8.5 Avoid confusing arrow function syntax (=>) with comparison operators (<=, >=).
        "no-confusing-arrow": 2,

        // 8.6 Enforce the location of arrow function bodies with implicit returns.
        "implicit-arrow-linebreak": 2,

        // ------------- new ---------------
        
        // 8.7 Always return the callback
        "callback-return": 2,

        // Max nested callbacks
        "max-nested-callbacks": 0,


        // 9 Classes & Constructors

        /**
         * 9.5 Classes have a default constructor if one is not specified.
         *  An empty constructor function or one that just delegates to a parent class is unnecessary.
         */
        "no-useless-constructor": 2,

        // 9.6 Avoid duplicate class members.
        "no-dupe-class-members": 2,

        // --------------- new -------------------

        //TODO: Make description
        "class-methods-use-this": 2,

        // Ensures a linebreak between members in a class
        "lines-between-class-members": ['error', 'always', { exceptAfterSingleLine: false }],

        // Enforces that each file may contain only a particular number of classes and no more.
        "max-classes-per-file": ['off', 0],

        // 10 Modules

        // 10.4 Only import from a path in one place.
        "no-duplicate-imports": 2,

        // ---------------- new --------------------

        // specify the max number of lines in a file
        'max-lines': ['off', {
            max: 300,
            skipBlankLines: true,
            skipComments: true,
        }],


        // 11 Iterators and Generators

        // 11.1 Don’t use iterators. Prefer JavaScript’s higher-order functions instead of loops like for-in or for-of.
        "no-iterator": 2,
        "no-restricted-syntax": [1, "ForStatement", "ForInStatement", "ForOfStatement",],

        // 11.3 If you must use generators, or if you disregard our advice, make sure their function signature is spaced properly.
        "generator-star-spacing": [2, "after"],

        // ----------------- new ------------------

        // 11.4 These rules will already raise an error because of 'no-iterator'
        'for-direction': 0,
        "guard-for-in": 0,


        // 12 Properties

        // 12.1 Use dot notation when accessing properties.
        "dot-notation": 2,

        // 12.3 Use exponentiation operator ** when calculating exponentiations.
        "no-restricted-properties": 2,
        

        // 13 Variables

        /**
         * 13.1 Always use const or let to declare variables.
         *  Not doing so will result in global variables. We want to avoid polluting the global namespace. 
         *  Captain Planet warned us of that.
         */
        "no-undef": 2,
        // "prefer-const": 2,

        // 13.2 Use one const or let declaration per variable or assignment.
        "one-var": [2, "never"],

        // 13.5 Don’t chain variable assignments.
        "no-multi-assign": 2,

        // 13.6 Avoid using unary increments and decrements (++, --).
        "no-plusplus": 2,

        // 13.7 Avoid linebreaks before or after = in an assignment. If your assignment violates max-len, surround the value in parens.
        "operator-linebreak": [2, "before", {"overrides": {"=": "none"}}],

        // 13.8 Disallow unused variables.
        "no-unused-vars": 2,

        // ---------------- new ------------------------

        // Always assign value during decleration
        "init-declarations": 2,

        // 13.9 Blacklisted variable names
        "id-blacklist": 'off',

        // 13.10 require identifiers to match the provided regular expression
        "id-match": 2,


        // 15 Comparison Operators & Equality

        // 15.1 Use === and !== over == and !=.
        "eqeqeq": 2,

        // 15.5 Use braces to create blocks in case and default clauses that contain lexical declarations (e.g. let, const, function, and class).
        "no-case-declarations": 2,

        // 15.6 Ternaries should not be nested and generally be single line expressions.
        "no-nested-ternary": 2,

        // 15.7 Avoid unneeded ternary statements.
        "no-unneeded-ternary": 0,

        // 15.8 When mixing operators, enclose them in parentheses. The only exception is the standard arithmetic operators (+, -, *, & /) since their precedence is broadly understood.
        "no-mixed-operators": [
            2,
            {
                "groups": [
                    ['%', '**'],
                    ['%', '+'],
                    ['%', '-'],
                    ['%', '*'],
                    ['%', '/'],
                    ['**', '+'],
                    ['**', '-'],
                    ['**', '*'],
                    ['**', '/'],
                    ['&', '|', '^', '~', '<<', '>>', '>>>'],
                    ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
                    ['&&', '||'],
                    ['in', 'instanceof']
                  ],
                  "allowSamePrecedence": false
            },
        ],

        // ------------------- new ------------------------

        // Case-switch should always have a default or a comment at the end stating that there is no default
        "default-case": ['error', { commentPattern: '^No default$' }],


        // 16 Blocks

        // 16.1 Use braces with all multi-line blocks.
        "nonblock-statement-body-position": 2,

        // 16.2 If you’re using multi-line blocks with if and else, put else on the same line as your if block’s closing brace. 
        "brace-style": 2,

        // 16.3 If an if block always executes a return statement, the subsequent else block is unnecessary. A return in an else if block following an if block that contains a return can be separated into multiple if blocks.
        "no-else-return": [2, {"allowElseIf": false}],

        // ------------------new-------------------

        // 16.4 if a statement becomes multiple lines, require a curly bracket before linebreak
        "curly": [2, 'multi-line'],

        // specify the maximum depth that blocks can be nested
        'max-depth': ['off', 4],


        // 18 Comments

        // 18.1 Use /** ... */ for multi-line comments.
        "multiline-comment-style": 2,

        // 18.2 Use // for single line comments. Place single line comments on a newline above the subject of the comment. Put an empty line before the comment unless it’s on the first line of a block.
        "no-inline-comments": 2,
        "line-comment-position": 2,
        "lines-around-comment": [
            'error',
            { 
                "beforeBlockComment": true,
                "beforeLineComment": true,
                "allowBlockStart": true,
            },
        ],

        // 18.3 Start all comments with a space to make it easier to read.
        "spaced-comment": 2,

        // -------------------new---------------------------

        // 18.7 Always capitalize comments
        "capitalized-comments": 2,


        // 19 Whitespace

        // 19.1 Use soft tabs (space character) set to 2 spaces.
        indent: ['error', 2, {
            SwitchCase: 1,
            VariableDeclarator: 1,
            outerIIFEBody: 1,
            // MemberExpression: null,
            FunctionDeclaration: {
              parameters: 1,
              body: 1
            },
            FunctionExpression: {
              parameters: 1,
              body: 1
            },
            CallExpression: {
              arguments: 1
            },
            ArrayExpression: 1,
            ObjectExpression: 1,
            ImportDeclaration: 1,
            flatTernaryExpressions: false,
            // list derived from https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
            ignoredNodes: ['JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],
            ignoreComments: false
          }
        ],

        // 19.3 Place 1 space before the opening parenthesis in control statements (if, while etc.). Place no space between the argument list and the function name in function calls and declarations.
        "keyword-spacing": 2,

        // 19.4 Set off operators with spaces.
        "space-infix-ops": 2,

        // 19.5 End files with a single newline character.
        "eol-last": 2,

        // 19.6 Use indentation when making long method chains (more than 2 method chains). Use a leading dot, which emphasizes that the line is a method call, not a new statement.
        "newline-per-chained-call": 2,
        "no-whitespace-before-property": 2,

        // 19.7 Leave a blank line after blocks and before the next statement.
        // "newline-before-return": 2, Deprecated
        "padding-line-between-statements": [2, { blankLine: "always", prev: "*", next: "return" }],

        // 19.8 Do not pad your blocks with blank lines.
        "padded-blocks": [2, "never"],

        // 19.9 Do not add spaces inside parentheses.
        "space-in-parens": [2, "never"],

        // 19.10 Do not add spaces inside brackets.
        "array-bracket-spacing": 2,

        // 19.11 Add spaces inside curly braces.
        "object-curly-spacing": [2, "always"],

        // 19.12 Avoid having lines of code that are longer than 100 characters (including whitespace). Note: per above, long strings are exempt from this rule, and should not be broken up.
        "max-len": [
            2,
            {
                "code": 100,
                "ignoreStrings": true,
                "ignoreTemplateLiterals": true,
                "ignoreComments": true,
            }
        ],

        // 19.13 Require consistent spacing inside an open block token and the next token on the same line. This rule also enforces consistent spacing inside a close block token and previous token on the same line.
        "block-spacing": 2,

        // 19.14 Avoid spaces before commas and require a space after commas.
        "comma-spacing": 2,

        // 19.15 Enforce spacing inside of computed properties.
        "computed-property-spacing": 2,

        // 19.16 Enforce spacing between functions and their invocations.
        "func-call-spacing": 2,

        // 19.17 Enforce spacing between keys and values in object literal properties.
        "key-spacing": [2, { beforeColon: false, afterColon: true }],

        // 19.18 Avoid trailing spaces at the end of lines.
        "no-trailing-spaces": [
            1,
            {
                "skipBlankLines": false,
                "ignoreComments": true,
            },
        ],

        // 19.19 Avoid multiple empty lines and only allow one newline at the end of files.
        "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 0 }],


        // -------------- new -------------------

        // 19.20 This rule aims to enforce newline consistency in member expressions. This rule prevents the use of mixed newlines around the dot in a member expression.
        "dot-location": [2, "property"],

        // 19.21 This rule enforces consistent line endings independent of operating system, VCS, or editor used across your codebase.
        "linebreak-style": [0, 'unix'],
        
        // 20 Commas

        // 20.1 Leading commas: Nope.
        "comma-style": ["error", "last", {
            "exceptions": {
              "ArrayExpression": false,
              "ArrayPattern": false,
              "ArrowFunctionExpression": false,
              "CallExpression": false,
              "FunctionDeclaration": false,
              "FunctionExpression": false,
              "ImportDeclaration": false,
              "ObjectExpression": false,
              "ObjectPattern": false,
              "VariableDeclaration": false,
              "NewExpression": false,
            }
          }
        ],

        // 20.2 Additional trailing comma: Yup.
        "comma-dangle": ["error", {
            "arrays": "always-multiline",
            "objects": "always-multiline",
            "imports": "always-multiline",
            "exports": "always-multiline",
            "functions": "always-multiline",
          }
        ],

        // 21 Semicolons

        // 21.1 Yup.
        "semi": ["error", "always"],


        // 22 Type Casting & Coercion

        // 22.2 Strings
        "no-new-wrappers": 2,

        // 22.3 Numbers: Use Number for type casting and parseInt always with a radix for parsing strings.
        "radix": 2,

        // 23 Naming Conventions

        // 23.1 Avoid single letter names. Be descriptive with your naming.
        "id-length": 1,

        // 23.2 Use camelCase when naming objects, functions, and instances.
        "camelcase": [2, { properties: 'never' }],

        // 23.3 Use PascalCase only when naming constructors or classes.
        "new-cap": [2, {
            "newIsCap": true,
            "newIsCapExceptions": [],
            "capIsNew": false,
            "capIsNewExceptions": ["Immutable.Map", "Immutable.Set", "Immutable.List"],
        }],

        // 23.4 Do not use trailing or leading underscores.
        "no-underscore-dangle": ["warn", {
            "allow": [],
            "allowAfterThis": false,
            "allowAfterSuper": false,
            "enforceInMethodNames": true,
          }
        ],

        // 24 Accessors

        // 24.1 Accessor functions for properties are not required.
        
        // 24.2 Do not use JavaScript getters/setters as they cause unexpected side effects and are harder to test, maintain, and reason about. Instead, if you do make accessor functions, use getVal() and setVal('hello').
        "accessor-pairs": [0, {setWithoutGet: false, getWithoutSet: false}],
        "getter-return": 0,


        // 40 deprecated
        "indent-legacy": 0,
        "lines-around-directive": 0,
        "newline-after-var": 0,
        "newline-before-return": 0,
        "no-catch-shadow": 0,
        "no-native-reassign": 0,
        "no-negated-in-lhs": 0,
        "no-spaced-func": 0,
        "prefer-reflect": 0,


        // 41 Node.js

        // 41.1 All dependencies should be declared at the top of the document
        "global-require": 2,

        // 41.2 This rule expects that when you’re using the callback pattern in Node.js you’ll handle the error.
        "handle-callback-err": 2,

        // 42 jsx & React
        "jsx-quotes": 0,


        // Rest of rules
        "complexity": 0,
        "consistent-this": 2,
        "constructor-super": 2,
        
        "max-statements-per-line": 2,
        "max-statements": 0,
        "multiline-ternary": 2,
        "new-parens": 2,
        "no-alert": 2,
        "no-async-promise-executor": 2,
        "no-await-in-loop": 2,
        "no-bitwise": 2,
        "no-buffer-constructor": 2,
        "no-caller": 2,
        "no-class-assign": 2,
        "no-compare-neg-zero": 2,
        "no-cond-assign": 2,
        "no-console": 0,
        "no-constant-condition": 2,
        "no-continue": 2,
        "no-control-regex": 2,
        "no-debugger": 2,
        "no-delete-var": 2,
        "no-div-regex": 2,
        "no-dupe-args": 2,
        "no-dupe-keys": 2,
        "no-duplicate-case": 2,
        "no-empty-character-class": 2,
        "no-empty-function": 2,
        "no-empty-pattern": 2,
        "no-empty": 2,
        "no-eq-null": 2,
        "no-ex-assign": 2,
        "no-extend-native": 2,
        "no-extra-bind": 2,
        "no-extra-boolean-cast": 2,
        "no-extra-label": 2,
        "no-extra-parens": 0,
        "no-extra-semi": 2,
        "no-fallthrough": 2,
        "no-floating-decimal": 2,
        "no-func-assign": 2,
        "no-global-assign": 2,
        "no-implicit-coercion": 2,
        "no-implicit-globals": 2,
        "no-implied-eval": 2,
        "no-inner-declarations": 2,
        "no-invalid-regexp": 2,
        "no-invalid-this": 2,
        "no-irregular-whitespace": 2,
        "no-label-var": 2,
        "no-labels": 2,
        "no-lone-blocks": 2,
        "no-lonely-if": 2,
        "no-magic-numbers": [1, {"ignore": [-1, 0, 1]}],
        "no-misleading-character-class": 2,
        "no-mixed-requires": 2,
        "no-mixed-spaces-and-tabs": 2,
        "no-multi-spaces": 2,
        "no-multi-str": 2,
        "no-negated-condition": 0,
        "no-new-require": 2,
        "no-new-symbol": 2,
        "no-new": 2,
        "no-obj-calls": 2,
        "no-octal-escape": 2,
        "no-octal": 2,
        "no-path-concat": 2,
        "no-process-env": 1,
        "no-process-exit": 2,
        "no-proto": 2,
        "no-redeclare": 2,
        "no-regex-spaces": 2,
        "no-restricted-globals": 2,
        "no-restricted-imports": 2,
        "no-restricted-modules": 2,
        "no-return-assign": 2,
        "no-return-await": 2,
        "no-script-url": 2,
        "no-self-assign": 2,
        "no-self-compare": 2,
        "no-sequences": 2,
        "no-shadow-restricted-names": 2,
        "no-shadow": 0,
        "no-sparse-arrays": 2,
        "no-sync": 0,
        "no-tabs": 2,
        "no-template-curly-in-string": 2,
        "no-ternary": 0,
        "no-this-before-super": 2,
        "no-throw-literal": 2,
        "no-undef-init": 2,
        "no-undefined": 2,
        "no-unexpected-multiline": 2,
        "no-unmodified-loop-condition": 2,
        "no-unreachable": 2,
        "no-unsafe-finally": 2,
        "no-unsafe-negation": 2,
        "no-unused-expressions": 2,
        "no-unused-labels": 2,
        "no-use-before-define": 2,
        "no-useless-call": 2,
        "no-useless-computed-key": 2,
        "no-useless-concat": 2,
        "no-useless-rename": 2,
        "no-useless-return": 2,
        "no-void": 2,
        "no-warning-comments": 2,
        "no-with": 2,
        "object-curly-newline": 2,
        "object-property-newline": 2,
        "object-shorthand": 2,
        "one-var-declaration-per-line": 2,
        "operator-assignment": 2,
        "prefer-numeric-literals": 2,
        "prefer-object-spread": 2,
        "prefer-promise-reject-errors": 2,
        "require-atomic-updates": 2,
        "require-await": 2,
        "require-jsdoc": 0,
        "require-unicode-regexp": 0,
        "require-yield": 2,
        "rest-spread-spacing": 2,
        "semi-spacing": 2,
        "semi-style": 2,
        "sort-imports": 2,
        "sort-keys": 0,
        "sort-vars": 2,
        "space-unary-ops": 2,
        "strict": 2,
        "switch-colon-spacing": 2,
        "symbol-description": 2,
        "template-tag-spacing": 2,
        "unicode-bom": 2,
        "use-isnan": 2,
        "valid-jsdoc": 0,
        "valid-typeof": 2,
        "vars-on-top": 2,
        "wrap-regex": 2,
        "yield-star-spacing": 2,
        "yoda": 2,
    }
}

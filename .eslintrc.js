module.exports = {
    "env": {
        "node": true,
        "browser": true,
        "es6": true
    },
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {}
    },
    "rules": {
        // 2.1 Use const for all of your references; avoid using var.
        "prefer-const": 2,
        "no-const-assign": 2,

        // 2.2 If you must reassign references, use let instead of var.
        "no-var": 2,


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


        // 4.1 Use the literal syntax for array creation.
        "no-array-constructor": 2,

        /**
         * 4.7 Use return statements in array method callbacks. 
         *  It’s ok to omit the return if the function body consists of a single statement returning an expression without side effects, following 8.2.
         */
        "array-callback-return": 2,


        // 5.1 Use object destructuring when accessing and using multiple properties of an object.
        "prefer-destructuring": 2,


        // 6.1 Use single quotes '' for strings.
        "quotes": [2, "single"],

        // 6.3 When programmatically building up strings, use template strings instead of concatenation.
        "prefer-template": 2,
        "template-curly-spacing": 2,

        // 6.4 Never use eval() on a string, it opens too many vulnerabilities.
        "no-eval": 2,

        // 6.5 Do not unnecessarily escape characters in strings.
        "no-useless-escape": 2,


        // 7.1 Use named function expressions instead of function declarations.
        "func-style": [2, "expression"],
        "func-names": 2,

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
        "arrow-body-style": 2,

        // 8.5 Avoid confusing arrow function syntax (=>) with comparison operators (<=, >=).
        "no-confusing-arrow": 2,

        // 8.6 Enforce the location of arrow function bodies with implicit returns.
        "implicit-arrow-linebreak": 2,


        /**
         * 9.5 Classes have a default constructor if one is not specified.
         *  An empty constructor function or one that just delegates to a parent class is unnecessary.
         */
        "no-useless-constructor": 2,

        // 9.6 Avoid duplicate class members.
        "no-dupe-class-members": 2,


        // 10.4 Only import from a path in one place.
        "no-duplicate-imports": 2,


        // 11.1 Don’t use iterators. Prefer JavaScript’s higher-order functions instead of loops like for-in or for-of.
        "no-iterator": 2,
        "no-restricted-syntax": [1, "ForStatement", "ForInStatement", "ForOfStatement",],

        // 11.3 If you must use generators, or if you disregard our advice, make sure their function signature is spaced properly.
        "generator-star-spacing": [2, "after"],


        // 12.1 Use dot notation when accessing properties.
        "dot-notation": 2,

        // 12.3 Use exponentiation operator ** when calculating exponentiations.
        "no-restricted-properties": 2,
        

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


        // 15.1 Use === and !== over == and !=.
        "eqeqeq": 2,

        // Rest of rules
        "accessor-pairs": 2,
        "array-bracket-newline": 2,
        "array-bracket-spacing": 2,
        
        "array-element-newline": [2, "consistent"],
        
        
        
        "block-scoped-var": 2,
        "block-spacing": 2,
        "brace-style": 2,
        "callback-return": 0,
        "camelcase": 2,
        "capitalized-comments": 2,
        "class-methods-use-this": 2,
        "comma-dangle": [2, "always-multiline", {"functions": "always"}],
        "comma-spacing": 2,
        "comma-style": 2,
        "complexity": 0,
        "computed-property-spacing": 2,
        "consistent-return": 2,
        "consistent-this": 2,
        "constructor-super": 2,
        "curly": 2,
        "default-case": 2,
        "dot-location": [2, "property"],
        
        "eol-last": 2,
        
        "for-direction": 2,
        "func-call-spacing": 2,
        "func-name-matching": [2, "never"],
        
        
        
        
        "getter-return": 2,
        "global-require": 2,
        "guard-for-in": 2,
        "handle-callback-err": 2,
        "id-blacklist": 2,
        "id-length": [2, { "exceptions": ["i"] }],
        "id-match": 2,
        
        "indent-legacy": 2,
        "indent": 2,
        "init-declarations": 2,
        "jsx-quotes": 2,
        "key-spacing": 2,
        "keyword-spacing": 2,
        "line-comment-position": 2,
        "linebreak-style": 0,
        "lines-around-comment": 2,
        "lines-around-directive": 2,
        "lines-between-class-members": 2,
        "max-classes-per-file": 2,
        "max-depth": 2,
        "max-len": 0,
        "max-lines-per-function": 0,
        "max-lines": 0,
        "max-nested-callbacks": 2,
        "max-params": 0,
        "max-statements-per-line": 2,
        "max-statements": 0,
        "multiline-comment-style": 2,
        "multiline-ternary": 2,
        "new-cap": 2,
        "new-parens": 2,
        "newline-after-var": 2,
        "newline-before-return": 2,
        "newline-per-chained-call": 2,
        "no-alert": 2,
        
        "no-async-promise-executor": 2,
        "no-await-in-loop": 2,
        "no-bitwise": 2,
        "no-buffer-constructor": 2,
        "no-caller": 2,
        "no-case-declarations": 2,
        "no-catch-shadow": 2,
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
        
        "no-else-return": 2,
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
        "no-inline-comments": 2,
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
        "no-mixed-operators": 2,
        "no-mixed-requires": 2,
        "no-mixed-spaces-and-tabs": 2,
        
        "no-multi-spaces": 2,
        "no-multi-str": 2,
        "no-multiple-empty-lines": 2,
        "no-native-reassign": 2,
        "no-negated-condition": 0,
        "no-negated-in-lhs": 2,
        "no-nested-ternary": 2,
        
        
        "no-new-require": 2,
        "no-new-symbol": 2,
        "no-new-wrappers": 2,
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
        "no-spaced-func": 2,
        "no-sparse-arrays": 2,
        "no-sync": 0,
        "no-tabs": 2,
        "no-template-curly-in-string": 2,
        "no-ternary": 0,
        "no-this-before-super": 2,
        "no-throw-literal": 2,
        "no-trailing-spaces": [1, {"ignoreComments": true}],
        "no-undef-init": 2,
        
        "no-undefined": 2,
        "no-unexpected-multiline": 2,
        "no-unmodified-loop-condition": 2,
        "no-unneeded-ternary": 0,
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
        "no-whitespace-before-property": 2,
        "no-with": 2,
        "nonblock-statement-body-position": 2,
        "object-curly-newline": 2,
        "object-curly-spacing": [2, "always"],
        "object-property-newline": 2,
        "object-shorthand": 2,
        "one-var-declaration-per-line": 2,
        
        "operator-assignment": 2,
        
        "padded-blocks": 0,
        "padding-line-between-statements": 2,
        
        
        
        "prefer-numeric-literals": 2,
        "prefer-object-spread": 2,
        "prefer-promise-reject-errors": 2,
        "prefer-reflect": 0,
        
        
        
        
        "radix": 2,
        "require-atomic-updates": 2,
        "require-await": 2,
        "require-jsdoc": 0,
        "require-unicode-regexp": 0,
        "require-yield": 2,
        "rest-spread-spacing": 2,
        "semi-spacing": 2,
        "semi-style": 2,
        "semi": 2,
        "sort-imports": 2,
        "sort-keys": 0,
        "sort-vars": 2,
        
        
        "space-in-parens": [2, "never"],
        "space-infix-ops": 2,
        "space-unary-ops": 2,
        "spaced-comment": 2,
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

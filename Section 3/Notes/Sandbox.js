/* eslint "capitalized-comments": 0 */
/* eslint "curly": 0 */
/* eslint "no-undef": 0 */
/* eslint "func-style": 0 */
/* eslint "consistent-return": 0 */
/* eslint "no-unused-vars": 0 */
/* eslint "no-unused-expressions": 0 */
/* eslint "max-statements-per-line": 2 */
/* eslint "no-lonely-if": 0 */
/* eslint "no-empty-function": 0 */

const say = Symbol('talk');

class Cat {
  constructor() {
    // call private
    this[say]();
  }

  [say]() {
    console.log('im private');
  }
}

const kevin = new Cat();

kevin.say;

const sample = require('lodash/sample');
const shuffle = require('lodash/shuffle');

// different ways to connect parts
// don't affect specificity
const CONNECTORS = [
  ' ',
  // ' > ',
  // ' + ',
  // ' ~ ',
];

const {
  ELEMENTS,
  WORDS,
} = require('./dictionaries');

// probabilities of selector properties
const HAS_ELEMENT = [true, false, false];
const CLASSES_AMOUNTS = [0, 0, 1, 1, 2];
const IDS_AMOUNTS = [0, 0, 0, 1];
const ATTRS_AMOUNTS = [0, 0, 0, 1];
const CHAIN_LENGTHS = [1, 1, 1, 2, 2, 3]

class SelectorsChain {
  constructor(...selectors) {
    this.selectors = [...selectors];

    this.string = this.generateString();
  }

  getSpecificity() {
    return this.selectors.reduce((acc, current) => {
      return acc + current.getSpecificity();
    }, 0);
  }

  static getRandom() {
    const length = sample(CHAIN_LENGTHS);

    let selectors = [];
    for (let i = 0; i < length; i++) {
      const hasElement = sample(HAS_ELEMENT);
      const classesAmount = sample(CLASSES_AMOUNTS);
      const idsAmount = sample(IDS_AMOUNTS);
      const attrsAmount = sample(ATTRS_AMOUNTS);

      const element = hasElement ? sample(ELEMENTS) : null;

      let classes = [];
      for (let classIndex = 0; classIndex < classesAmount; classIndex++) {
        classes.push(sample(WORDS));
      }

      let ids = [];
      for (let idsIndex = 0; idsIndex < idsAmount; idsIndex++) {
        ids.push(sample(WORDS));
      }

      let attrs = {};
      for (let attrsIndex = 0; attrsIndex < attrsAmount; attrsIndex++) {
        attrs['data-' + sample(WORDS)] = sample(WORDS);
      }

      let selector = new Selector(element, classes, ids, attrs);
      if (!selector.getSpecificity()) {
        selector = new Selector(sample(ELEMENTS));
      }

      selectors.push(selector);
    }

    return new SelectorsChain(...selectors);
  }

  generateString() {
    return this.selectors.map(s => s.toString()).join(sample(CONNECTORS));
  }

  toString() {
    return this.string;
  }
}

class Selector {
  constructor(elem, classes = [], ids = [], attrs = {}) {
    this.elem = elem;
    this.classes = classes;
    this.ids = ids;
    this.attrs = attrs;

    this.string = this.generateString();
  }

  getSpecificity() {
    const elemSp = this.elem ? 1 : 0;
    const classesSp = this.classes.length * 10;
    const attrsSp = Object.keys(this.attrs).length * 10;
    const idsSp = this.ids.length * 100;

    return elemSp + classesSp + attrsSp + idsSp;
  }

  generateString() {
    const elem = this.elem ? this.elem : '';
    const classes = this.classes.map(cl => `.${cl}`);
    const ids = this.ids.map(id => `#${id}`);
    const attrs = Object.keys(this.attrs).map(
      attr => `[${attr}="${this.attrs[attr]}"]`
    );
    const shuffled = shuffle([...classes, ...ids, ...attrs]);
    return elem + shuffled.reduce((acc, curr) => {
      return acc + curr;
    }, '');
  }

  toString() {
    return this.string;
  }
}

module.exports = {
  SelectorsChain,
};

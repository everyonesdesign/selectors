const delegate = require('emmy/delegate');
const {
  SelectorsChain,
} = require('./selector');
const extend = require('lodash/extend');

const state = {
  selector1: null,
  selector2: null,
  chosenIndex: null,
}

const container = document.querySelector('#app');

delegate(document.body, 'click', '.nextButton', newRound);
delegate(document.body, 'click', '.choices-item', (e) => {
  const target = e.delegateTarget;

  if (state.chosenIndex !== null) {
    return;
  }

  const index = Number(target.getAttribute('data-index'));
  chooseOption(index);
});

function newRound() {
  state.selector1 = SelectorsChain.getRandom();
  state.selector2 = SelectorsChain.getRandom();
  state.chosenIndex = null;
  renderApp();
}

function chooseOption(index) {
  state.chosenIndex = index;
  renderApp();
}

function getResult() {
  const specificity1 = state.selector1.getSpecificity();
  const specificity2 = state.selector2.getSpecificity();

  if (state.chosenIndex === 0) {
    if (specificity1 > specificity2) {
      return getSuccessfulResult();
    }

    return getErrorResult();
  } else if (state.chosenIndex === 1) {
    if (specificity1 < specificity2) {
      return getSuccessfulResult();
    }

    return getErrorResult();
  } else if (state.chosenIndex === 2) {
    if (specificity1 === specificity2) {
      return getSuccessfulResult();
    }

    return getErrorResult();
  }

  return '';
}

function getSuccessfulResult() {
  return `
    Верно!
    ${renderSpecificityTable()}
    <span class="nextButton">
      Далее
    </span>
  `;
}

function getErrorResult() {
  return `
    Неверно:
    ${renderSpecificityTable()}
    <span class="nextButton">
      Далее
    </span>
  `;
}

function renderSpecificityTable() {
  return `
    <table class="resultsTable">
      <tr>
        <th>Селектор</th>
        <th>Специфичность</th>
      </tr>
      <tr>
        <td>${state.selector1.toString()}</td>
        <td>${state.selector1.getSpecificity()}</td>
      </tr>
      <tr>
        <td>${state.selector2.toString()}</td>
        <td>${state.selector2.getSpecificity()}</td>
      </tr>
    </table>
  `;
}

function renderApp() {
  const choicesSelectedClass = state.chosenIndex === null ? '' : 'choices--selected';
  const items = [
    state.selector1.toString(),
    state.selector2.toString(),
    'селекторы равны',
  ].map((item, index) => {
    const selectedClass = index === state.chosenIndex ? 'choices-item--selected' : '';
    return `
      <div class="choices-item ${selectedClass}" data-index="${index}">
        ${item}
      </div>
    `;
  }).join('');
  const result = state.chosenIndex === null ? '' : getResult();

  container.innerHTML = `
    <div class="title">Выберите более специфичный селектор:</div>
    <div class="choices ${choicesSelectedClass}">
      ${items}
    </div>
    ${result}
  `;
}

newRound();

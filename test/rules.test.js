import test from 'node:test';
import assert from 'node:assert/strict';
import { findMatchingRule, getMessageText } from '../src/rules.js';

const rules = [
  { keywords: ['hello', 'hi'], replies: ['first'] },
  { keywords: ['hours'], replies: ['second'] },
];

test('matches keywords without case or accent sensitivity', () => {
  assert.equal(findMatchingRule('HÉLLO there', rules), rules[0]);
});

test('returns the first matching rule and no rule for unrelated text', () => {
  assert.equal(findMatchingRule('hi, what are your hours?', rules), rules[0]);
  assert.equal(findMatchingRule('goodbye', rules), undefined);
  assert.equal(findMatchingRule('this is useful', rules), undefined);
});

test('reads conversation and extended text messages', () => {
  assert.equal(getMessageText({ conversation: 'hello' }), 'hello');
  assert.equal(getMessageText({ extendedTextMessage: { text: 'hello there' } }), 'hello there');
  assert.equal(getMessageText({}), '');
});
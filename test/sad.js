//@ts-check
const test = require('tape');
const fixtures = require('./fixtures');
const ssbUri = require('../lib');

test('message URI not recognized as feed URI', (t) => {
  t.plan(1);
  t.false(ssbUri.isFeedSSBURI(fixtures.message.uri));
});

test('bendybutt message URI cannot be converted to sigil', (t) => {
  t.plan(1);
  t.notOk(ssbUri.toMessageSigil(fixtures.message.uri4));
});

test('falsy input not recognized as feed', (t) => {
  t.plan(1);
  t.false(ssbUri.isFeedSSBURI(null));
});

test('falsy input not recognized as message', (t) => {
  t.plan(1);
  t.false(ssbUri.isMessageSSBURI(null));
});

test('falsy input not recognized as blob', (t) => {
  t.plan(1);
  t.false(ssbUri.isBlobSSBURI(null));
});

test('falsy input not recognized as address', (t) => {
  t.plan(1);
  t.false(ssbUri.isAddressSSBURI(null));
});

test('falsy input not recognized as experimental', (t) => {
  t.plan(1);
  t.false(ssbUri.isExperimentalSSBURI(null));
});

test('invalid SSB URI input not recognized', (t) => {
  t.plan(1);
  t.false(ssbUri.isFeedSSBURI('ssb:feed/ed25519/'));
});

test('invalid feed SSB URI cannot be converted to sigil', (t) => {
  t.plan(1);
  t.false(ssbUri.toFeedSigil('ssb:'));
});

test('bendybutt feed URI cannot be converted to sigil', (t) => {
  t.plan(1);
  t.notOk(ssbUri.toFeedSigil(fixtures.feed.uri4));
});

test('invalid message SSB URI cannot be converted to sigil', (t) => {
  t.plan(1);
  t.false(ssbUri.toMessageSigil('ssb:'));
});

test('invalid blob SSB URI cannot be converted to sigil', (t) => {
  t.plan(1);
  t.false(ssbUri.toBlobSigil('ssb:'));
});

test('invalid address SSB URI not recognized', (t) => {
  t.plan(1);
  t.false(ssbUri.isAddressSSBURI('ssb:address/multiserver/'));
});

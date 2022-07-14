//@ts-check
const test = require('tape');
const fixtures = require('./fixtures');
const ssbUri = require('../lib');

test('message URI not recognized as feed URI', (t) => {
  t.plan(1);
  t.false(ssbUri.isClassicFeedSSBURI(fixtures.message.uri));
});

test('bendybutt message URI cannot be converted to sigil', (t) => {
  t.plan(1);
  t.notOk(ssbUri.toMessageSigil(fixtures.message.uri4));
});

test('gabbygrove message URI cannot be converted to sigil', (t) => {
  t.plan(1);
  t.notOk(ssbUri.toMessageSigil(fixtures.message.uri5));
});

test('falsy input not recognized as feed', (t) => {
  t.plan(1);
  t.false(ssbUri.isClassicFeedSSBURI(null));
});

test('falsy input not recognized as message', (t) => {
  t.plan(1);
  t.false(ssbUri.isClassicMessageSSBURI(null));
});

test('falsy input not recognized as blob', (t) => {
  t.plan(1);
  t.false(ssbUri.isClassicBlobSSBURI(null));
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
  t.false(ssbUri.isClassicFeedSSBURI('ssb:feed/ed25519/'));
});

test('invalid feed SSB URI cannot be converted to sigil', (t) => {
  t.plan(1);
  t.false(ssbUri.toFeedSigil('ssb:'));
});

test('bendybutt feed URI cannot be converted to sigil', (t) => {
  t.plan(1);
  t.notOk(ssbUri.toFeedSigil(fixtures.feed.uri4));
});

test('gabbygrove feed URI cannot be converted to sigil', (t) => {
  t.plan(1);
  t.notOk(ssbUri.toFeedSigil(fixtures.feed.uri5));
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

test('compose() missing type', (t) => {
  t.plan(1);
  t.throws(
    () => ssbUri.compose({format: 'ed25519', data: 'yum'}),
    /Missing required "type"/,
  );
});

test('compose() missing format', (t) => {
  t.plan(1);
  t.throws(
    () => ssbUri.compose({type: 'feed', data: 'yum'}),
    /Missing required "format"/,
  );
});

test('compose() missing data', (t) => {
  t.plan(1);
  t.throws(
    () => ssbUri.compose({type: 'feed', format: 'ed25519'}),
    /Missing required "data"/,
  );
});

test('compose() got bad format for type feed', (t) => {
  t.plan(1);
  t.throws(
    // @ts-ignore
    () => ssbUri.compose({type: 'feed', format: 'lols', data: 'ABCDE'}),
    /Unknown format for type/,
  );
});

test('compose() got bad format for type message', (t) => {
  t.plan(1);
  t.throws(
    // @ts-ignore
    () => ssbUri.compose({type: 'message', format: 'lols', data: 'ABCDE'}),
    /Unknown format for type/,
  );
});

test('compose() got bad format for type blob', (t) => {
  t.plan(1);
  t.throws(
    // @ts-ignore
    () => ssbUri.compose({type: 'blob', format: 'lols', data: 'ABCDE'}),
    /Unknown format for type/,
  );
});

test('compose() got bad format for type address', (t) => {
  t.plan(1);
  t.throws(
    // @ts-ignore
    () => ssbUri.compose({type: 'address', format: 'lols', data: 'ABCDE'}),
    /Unknown format for type/,
  );
});

test('compose() got bad format for type encryption-key', (t) => {
  t.plan(1);
  t.throws(
    () =>
      // @ts-ignore
      ssbUri.compose({type: 'encryption-key', format: 'lols', data: 'ABCDE'}),
    /Unknown format for type/,
  );
});

test('compose() got bad format for type identity', (t) => {
  t.plan(1);
  t.throws(
    // @ts-ignore
    () => ssbUri.compose({type: 'identity', format: 'lols', data: 'ABCDE'}),
    /Unknown format for type/,
  );
});

test('decompose() an pathname-less SSB URI', (t) => {
  t.plan(1);
  t.throws(() => ssbUri.decompose('ssb:'), /Invalid SSB URI/);
});

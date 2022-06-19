//@ts-check
const test = require('tape');
const fixtures = require('./fixtures');
const ssbUri = require('../lib');

test('compose() a message URI', (t) => {
  t.plan(1);
  const uri = ssbUri.compose({
    type: 'message',
    format: 'sha256',
    data: 'g3hPVPDEO1Aj/uPl0+J2NlhFB2bbFLIHlty+YuqFZ3w=',
  });
  t.equals(uri, fixtures.message.uri);
});

test('decompose() a message URI', (t) => {
  t.plan(4);
  const parts = ssbUri.decompose(fixtures.message.uri);
  t.deepEquals(Object.keys(parts), ['type', 'format', 'data'], 'obj keys');
  t.equals(parts.type, 'message', 'type');
  t.equals(parts.format, 'sha256', 'format');
  t.equals(parts.data, 'g3hPVPDEO1Aj/uPl0+J2NlhFB2bbFLIHlty+YuqFZ3w=', 'data');
});

test('decompose() and compose()', (t) => {
  t.plan(1);
  const uri = ssbUri.compose(ssbUri.decompose(fixtures.message.uri));
  t.equals(uri, fixtures.message.uri, 'same');
});

test('compose() a feed URI', (t) => {
  t.plan(1);
  const uri = ssbUri.compose({
    type: 'feed',
    format: 'ed25519',
    data: '+oaWWDs8g73EZFUMfW37R/ULtFEjwKN_DczvdYihjbU=',
  });
  t.equals(uri, fixtures.feed.uri);
});

test('compose() a feed URI with extra data', (t) => {
  t.plan(2);
  const parts = {
    type: 'feed',
    format: 'buttwoo-v1',
    data: 'FY5OG311W4j/KPh8H9B2MZt4WSziy/p+ABkKERJdujQ=',
    extraData: 'Z0rMVMDEO1Aj0uPl0/J2NlhFB2bbFLIHlty/YuqArFq=',
  };
  const uri = ssbUri.compose(parts);
  t.equals(uri, fixtures.feed.uri7);
  const parts2 = ssbUri.decompose(uri);
  t.deepEqual(parts2, parts);
});

//@ts-check
const test = require('tape');
const fixtures = require('./fixtures');
const ssbUri = require('../lib');

test('compose()', (t) => {
  t.plan(1);
  const parts = {
    type: 'message',
    format: 'sha256',
    data: 'g3hPVPDEO1Aj_uPl0-J2NlhFB2bbFLIHlty-YuqFZ3w=',
  };
  const uri = ssbUri.compose(parts);
  t.equals(uri, fixtures.message.uri);
});

test('decompose()', (t) => {
  t.plan(4);
  const parts = ssbUri.decompose(fixtures.message.uri);
  t.deepEquals(Object.keys(parts), ['type', 'format', 'data'], 'obj keys');
  t.equals(parts.type, 'message', 'type');
  t.equals(parts.format, 'sha256', 'format');
  t.equals(parts.data, 'g3hPVPDEO1Aj_uPl0-J2NlhFB2bbFLIHlty-YuqFZ3w=', 'data');
});

test('decompose() and compose()', (t) => {
  t.plan(1);
  const uri = ssbUri.compose(ssbUri.decompose(fixtures.message.uri));
  t.equals(uri, fixtures.message.uri, 'same');
});

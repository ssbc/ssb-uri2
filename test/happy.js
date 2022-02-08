//@ts-check
const test = require('tape');
const Ref = require('ssb-ref');
const fixtures = require('./fixtures');
const ssbUri = require('../lib');

test('message URIs recognized', (t) => {
  t.plan(6);
  t.true(ssbUri.isSSBURI(fixtures.message.uri));
  t.true(ssbUri.isMessageSSBURI(fixtures.message.uri));
  t.true(ssbUri.isMessageSSBURI(fixtures.message.uri2));
  t.true(ssbUri.isMessageSSBURI(fixtures.message.uri3));

  t.true(ssbUri.isBendyButtV1MessageSSBURI(fixtures.message.uri4));
  t.true(ssbUri.isGabbyGroveV1MessageSSBURI(fixtures.message.uri5));
});

test('message from sigil to URI', (t) => {
  t.plan(1);
  const uri = ssbUri.fromMessageSigil(fixtures.message.sigil);
  t.equal(uri, fixtures.message.uri);
});

test('message from URI to sigil', (t) => {
  t.plan(1);
  const sigil = ssbUri.toMessageSigil(fixtures.message.uri);
  t.equal(sigil, fixtures.message.sigil);
});

test('feed URIs recognized', (t) => {
  t.plan(6);
  t.true(ssbUri.isSSBURI(fixtures.feed.uri));
  t.true(ssbUri.isFeedSSBURI(fixtures.feed.uri));
  t.true(ssbUri.isFeedSSBURI(fixtures.feed.uri2));
  t.true(ssbUri.isFeedSSBURI(fixtures.feed.uri3));

  t.true(ssbUri.isBendyButtV1FeedSSBURI(fixtures.feed.uri4));
  t.true(ssbUri.isGabbyGroveV1FeedSSBURI(fixtures.feed.uri5));
});

test('feed from sigil to URI', (t) => {
  t.plan(1);
  const uri = ssbUri.fromFeedSigil(fixtures.feed.sigil);
  t.equal(uri, fixtures.feed.uri);
});

test('feed from URI to sigil', (t) => {
  t.plan(1);
  const sigil = ssbUri.toFeedSigil(fixtures.feed.uri);
  t.equal(sigil, fixtures.feed.sigil);
});

test('blob URIs recognized', (t) => {
  t.plan(4);
  t.true(ssbUri.isSSBURI(fixtures.blob.uri));
  t.true(ssbUri.isBlobSSBURI(fixtures.blob.uri));
  t.true(ssbUri.isBlobSSBURI(fixtures.blob.uri2));
  t.true(ssbUri.isBlobSSBURI(fixtures.blob.uri3));
});

test('blob from sigil to URI', (t) => {
  t.plan(1);
  const uri = ssbUri.fromBlobSigil(fixtures.blob.sigil);
  t.equal(uri, fixtures.blob.uri);
});

test('blob from URI to sigil', (t) => {
  t.plan(1);
  const sigil = ssbUri.toBlobSigil(fixtures.blob.uri);
  t.equal(sigil, fixtures.blob.sigil);
});

test('address URIs recognized', (t) => {
  t.plan(4);
  t.true(ssbUri.isSSBURI(fixtures.address.uri));
  t.true(ssbUri.isAddressSSBURI(fixtures.address.uri));
  t.true(ssbUri.isAddressSSBURI(fixtures.address.uri2));
  t.true(ssbUri.isAddressSSBURI(fixtures.address.uri3));
});

test('address from multiserver to URI', (t) => {
  t.plan(1);
  const uri = ssbUri.fromMultiserverAddress(fixtures.address.multiserver);
  t.equal(uri, fixtures.address.uri);
});

test('address from URI to multiserver', (t) => {
  t.plan(1);
  const msaddr = ssbUri.toMultiserverAddress(fixtures.address.uri);
  t.true(Ref.isAddress(msaddr));
});

test('identity URIs recognized', (t) => {
  t.plan(2);
  t.true(ssbUri.isSSBURI(fixtures.identity.uri));
  t.true(ssbUri.isSSBURI(fixtures.identity.uri2));
});

test('experimental URIs recognized', (t) => {
  t.plan(3);
  t.true(ssbUri.isSSBURI(fixtures.experimental.httpInviteUri));
  t.true(ssbUri.isExperimentalSSBURI(fixtures.experimental.httpInviteUri));
  t.true(ssbUri.isExperimentalSSBURI(fixtures.experimental.httpInviteUri2));
});

test('experimental URIs with action recognized', (t) => {
  t.plan(1);
  t.true(
    ssbUri.isExperimentalSSBURIWithAction('claim-http-invite')(
      fixtures.experimental.httpInviteUri,
    ),
  );
});

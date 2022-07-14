//@ts-check
const test = require('tape');
// @ts-ignore
const Ref = require('ssb-ref');
const fixtures = require('./fixtures');
const ssbUri = require('../lib');

test('message URIs recognized', (t) => {
  t.plan(7);
  t.true(ssbUri.isSSBURI(fixtures.message.uri));
  t.true(ssbUri.isClassicMessageSSBURI(fixtures.message.uri));
  t.true(ssbUri.isClassicMessageSSBURI(fixtures.message.uri2));
  t.true(ssbUri.isClassicMessageSSBURI(fixtures.message.uri3));

  t.true(ssbUri.isBendyButtV1MessageSSBURI(fixtures.message.uri4));
  t.true(ssbUri.isGabbyGroveV1MessageSSBURI(fixtures.message.uri5));
  t.true(ssbUri.isButtwooV1MessageSSBURI(fixtures.message.uri6));
});

test('message URI regex', (t) => {
  t.plan(6);
  t.true(ssbUri.getMessageSSBURIRegex().test(fixtures.message.uri));
  t.true(ssbUri.getMessageSSBURIRegex().test(fixtures.message.uri2));
  t.true(ssbUri.getMessageSSBURIRegex().test(fixtures.message.uri3));
  t.true(ssbUri.getMessageSSBURIRegex().test(fixtures.message.uri4));
  t.true(ssbUri.getMessageSSBURIRegex().test(fixtures.message.uri5));
  t.true(ssbUri.getMessageSSBURIRegex().test(fixtures.message.uri6));
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
  t.plan(8);
  t.true(ssbUri.isSSBURI(fixtures.feed.uri));
  t.true(ssbUri.isClassicFeedSSBURI(fixtures.feed.uri));
  t.true(ssbUri.isClassicFeedSSBURI(fixtures.feed.uri2));
  t.true(ssbUri.isClassicFeedSSBURI(fixtures.feed.uri3));

  t.true(ssbUri.isBendyButtV1FeedSSBURI(fixtures.feed.uri4));
  t.true(ssbUri.isGabbyGroveV1FeedSSBURI(fixtures.feed.uri5));
  t.true(ssbUri.isButtwooV1FeedSSBURI(fixtures.feed.uri6));
  t.true(ssbUri.isButtwooV1FeedSSBURI(fixtures.feed.uri7));
});

test('feed URI regex', (t) => {
  t.plan(7);
  t.equals(
    // @ts-ignore
    ssbUri.getFeedSSBURIRegex().exec(fixtures.feed.uri)[0],
    fixtures.feed.uri,
  );
  t.equals(
    // @ts-ignore
    ssbUri.getFeedSSBURIRegex().exec(fixtures.feed.uri2)[0],
    fixtures.feed.uri2,
  );
  t.equals(
    // @ts-ignore
    ssbUri.getFeedSSBURIRegex().exec(fixtures.feed.uri3)[0],
    fixtures.feed.uri3,
  );
  t.equals(
    // @ts-ignore
    ssbUri.getFeedSSBURIRegex().exec(fixtures.feed.uri4)[0],
    fixtures.feed.uri4,
  );
  t.equals(
    // @ts-ignore
    ssbUri.getFeedSSBURIRegex().exec(fixtures.feed.uri5)[0],
    fixtures.feed.uri5,
  );
  t.equals(
    // @ts-ignore
    ssbUri.getFeedSSBURIRegex().exec(fixtures.feed.uri6)[0],
    fixtures.feed.uri6,
  );
  t.equal(
    // @ts-ignore
    ssbUri.getFeedSSBURIRegex().exec(fixtures.feed.uri7)[0],
    fixtures.feed.uri7,
  );
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
  t.true(ssbUri.isClassicBlobSSBURI(fixtures.blob.uri));
  t.true(ssbUri.isClassicBlobSSBURI(fixtures.blob.uri2));
  t.true(ssbUri.isClassicBlobSSBURI(fixtures.blob.uri3));
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

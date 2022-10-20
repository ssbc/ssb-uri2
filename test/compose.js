//@ts-check
const test = require("tape");
const fixtures = require("./fixtures");
const ssbUri = require("../lib");

test("compose() a message URI", (t) => {
  t.plan(1);
  const uri = ssbUri.compose({
    type: "message",
    format: "classic",
    data: "g3hPVPDEO1Aj/uPl0+J2NlhFB2bbFLIHlty+YuqFZ3w=",
  });
  t.equals(uri, fixtures.message.uri);
});

test("decompose() a message URI", (t) => {
  t.plan(4);
  const parts = ssbUri.decompose(fixtures.message.uri);
  t.deepEquals(Object.keys(parts), ["type", "format", "data"], "obj keys");
  t.equals(parts.type, "message", "type");
  t.equals(parts.format, "classic", "format");
  t.equals(parts.data, "g3hPVPDEO1Aj/uPl0+J2NlhFB2bbFLIHlty+YuqFZ3w=", "data");
});

test("decompose() a cloaked message", (t) => {
  const parts = ssbUri.decompose(fixtures.message.uri9);
  t.end();
});

test("decompose() and compose()", (t) => {
  t.plan(1);
  const uri = ssbUri.compose(ssbUri.decompose(fixtures.message.uri));
  t.equals(uri, fixtures.message.uri, "same");
});

test("compose() a feed URI", (t) => {
  t.plan(1);
  const uri = ssbUri.compose({
    type: "feed",
    format: "classic",
    data: "+oaWWDs8g73EZFUMfW37R/ULtFEjwKN_DczvdYihjbU=",
  });
  t.equals(uri, fixtures.feed.uri);
});

test("compose() a feed URI with extra data", (t) => {
  t.plan(2);
  const parts = {
    type: "feed",
    format: "buttwoo-v1",
    data: "FY5OG311W4j/KPh8H9B2MZt4WSziy/p+ABkKERJdujQ=",
    extraData: "Z0rMVMDEO1Aj0uPl0/J2NlhFB2bbFLIHlty/YuqArFq=",
  };
  const uri = ssbUri.compose(parts);
  t.equals(uri, fixtures.feed.uri7);
  const parts2 = ssbUri.decompose(uri);
  t.deepEqual(parts2, parts);
});

test("compose() a deprecated format create deprecated URI", (t) => {
  t.plan(3);
  const msgUri = ssbUri.compose({
    type: "message",
    format: "sha256",
    data: "g3hPVPDEO1Aj/uPl0+J2NlhFB2bbFLIHlty+YuqFZ3w=",
  });
  t.equals(msgUri, fixtures.message.uri7);

  const feedUri = ssbUri.compose({
    type: "feed",
    format: "ed25519",
    data: "+oaWWDs8g73EZFUMfW37R/ULtFEjwKN_DczvdYihjbU=",
  });
  t.equals(feedUri, fixtures.feed.uri8);

  const blobUri = ssbUri.compose({
    type: "blob",
    format: "sha256",
    data: "sbBmsB7XWvmIzkBzreYcuzPpLtpeCMDIs6n/OJGSC1U=",
  });
  t.equals(blobUri, fixtures.blob.uri4);
});

test("decompose() a deprecated URI gives modern parts", (t) => {
  t.plan(4 * 3);
  const p1 = ssbUri.decompose(fixtures.message.uri7);
  t.deepEquals(Object.keys(p1), ["type", "format", "data"], "obj keys");
  t.equals(p1.type, "message", "type");
  t.equals(p1.format, "classic", "format");
  t.equals(p1.data, "g3hPVPDEO1Aj/uPl0+J2NlhFB2bbFLIHlty+YuqFZ3w=", "data");

  const p2 = ssbUri.decompose(fixtures.feed.uri8);
  t.deepEquals(Object.keys(p2), ["type", "format", "data"], "obj keys");
  t.equals(p2.type, "feed", "type");
  t.equals(p2.format, "classic", "format");
  t.equals(p2.data, "+oaWWDs8g73EZFUMfW37R/ULtFEjwKN/DczvdYihjbU=", "data");

  const p3 = ssbUri.decompose(fixtures.blob.uri4);
  t.deepEquals(Object.keys(p3), ["type", "format", "data"], "obj keys");
  t.equals(p3.type, "blob", "type");
  t.equals(p3.format, "classic", "format");
  t.equals(p3.data, "sbBmsB7XWvmIzkBzreYcuzPpLtpeCMDIs6n/OJGSC1U=", "data");
});

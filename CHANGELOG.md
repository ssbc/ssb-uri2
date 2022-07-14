# 2.0.0

Support ssb-uri-spec version 1.1, which means that we added support for `ssb:feed/classic` as first-class URIs, while `ssb:feed/ed25519` is still supported, but is deprecated. (Similarly for `ssb:message/classic` and `ssb:message/ed25519`, `ssb:blob/classic` and `ssb:blob/ed25519`.)

`compose({type: 'feed', format: 'ed25519', data})` is still going to return the deprecated URI `ssb:feed/ed25519/${data}`, but `decompose(uri)` will return `{type: 'feed', format: 'classic', data}`.

**Breaking change:**

- `isFeedSSBURI` renamed to `isClassicFeedSSBURI`
- `isMessageSSBURI` renamed to `isClassicMessageSSBURI`
- `isBlobSSBURI` renamed to `isClassicBlobSSBURI`

# 1.9.0

Support buttwoo feed URIs with 4 parts, i.e., an extra data part:

```
ssb:feed/buttwoo-v1/<FEEDID>/<PARENTMSGID>
```
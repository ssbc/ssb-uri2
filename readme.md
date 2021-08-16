# ssb-uri2

> An SSB utility library for handling and converting SSB URIs

This library provides utilities that recognize SSB URIs according to the [spec](https://github.com/ssb-ngi-pointer/ssb-uri-spec), and is compatible with [ssb-uri](https://github.com/fraction/ssb-uri) (prior work), while adding more support and more utilities.

## Install

```
npm install ssb-uri2
```

## Example

```js
const ssbUri = require('ssb-uri2');

const exampleURI =
  'ssb:message/sha256/g3hPVPDEO1Aj_uPl0-J2NlhFB2bbFLIHlty-YuqFZ3w=';

ssbUri.isMessageSSBURI(exampleURI);
// true

ssbUri.toMessageSigil(exampleURI);
// '%g3hPVPDEO1Aj/uPl0+J2NlhFB2bbFLIHlty+YuqFZ3w=.sha256'
```

## Boolean APIs

### `isSSBURI(uri: string | uri): boolean`

### `isFeedSSBURI(uri: string | null): boolean`

### `isMessageSSBURI(uri: string | null): boolean`

### `isBlobSSBURI(uri: string | null): boolean`

### `isAddressSSBURI(uri: string | null): boolean`

### `isExperimentalSSBURI(uri: string | null): boolean`

### `isExperimentalSSBURIWithAction(action: string): (uri: string) => boolean`

## Conversion APIs

### `fromFeedSigil(sigil: string): string`

### `fromMessageSigil(sigil: string): string`

### `fromBlobSigil(sigil: string): string`

### `fromMultiserverAddress(msaddr: string): string`

### `toFeedSigil(uri: string): string | null`

### `toMessageSigil(uri: string): string | null`

### `toBlobSigil(uri: string): string | null`

### `toMultiserverAddress(uri: string): string | null`

### `compose(parts: {type, format, data}): string`

### `decompose(uri: string): {type, format, data}`

## License

LGPL-3.0

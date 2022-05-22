import {BlobId, FeedId, MsgId} from 'ssb-typescript';

type FeedTF =
  | ['feed', 'ed25519']
  | ['feed', 'bendybutt-v1']
  | ['feed', 'gabbygrove-v1']
  | ['feed', 'buttwoo-v1'];
type MessageTF =
  | ['message', 'sha256']
  | ['message', 'bendybutt-v1']
  | ['message', 'gabbygrove-v1']
  | ['message', 'buttwoo-v1'];
type BlobTF = ['blob', 'sha256'];
type AddressTF = ['address', 'multiserver'];
type EncryptionKeyTF = ['encryption-key', 'box2-dm-dh'];
type IdentityTF = ['identity', 'po-box'] | ['identity', 'fusion'];
type TF =
  | FeedTF
  | MessageTF
  | BlobTF
  | AddressTF
  | EncryptionKeyTF
  | IdentityTF;

const Base64 = {
  unsafeToSafe(input: string) {
    return input.replace(/\+/g, '-').replace(/\//g, '_');
  },

  safeToUnsafe(input: string) {
    return input.replace(/-/g, '+').replace(/_/g, '/');
  },
};

function extractBase64Data(pathname: string | null): string | null {
  if (!pathname) return null;
  const lastPortion = /(:|\/)([\w_\-=]+)$/.exec(pathname)?.[2];
  if (!lastPortion) return null;
  return Base64.safeToUnsafe(lastPortion);
}

export function fromFeedSigil(sigil: FeedId) {
  const data = Base64.unsafeToSafe(sigil.slice(1, -8));
  return `ssb:feed/ed25519/${data}`;
}

export function fromMessageSigil(sigil: MsgId) {
  const data = Base64.unsafeToSafe(sigil.slice(1, -7));
  return `ssb:message/sha256/${data}`;
}

export function fromBlobSigil(sigil: BlobId) {
  const data = Base64.unsafeToSafe(sigil.slice(1, -7));
  return `ssb:blob/sha256/${data}`;
}

export function fromMultiserverAddress(msaddr: string) {
  const encoded = encodeURIComponent(msaddr);
  return `ssb:address/multiserver?multiserverAddress=${encoded}`;
}

export function toFeedSigil(uri: string): FeedId | null {
  if (!isFeedSSBURI(uri)) return null;
  const base64Data = extractBase64Data(new URL(uri).pathname)!;
  if (!base64Data) return null;
  return `@${base64Data}.ed25519`;
}

export function toMessageSigil(uri: string): MsgId | null {
  if (!isMessageSSBURI(uri)) return null;
  const base64Data = extractBase64Data(new URL(uri).pathname)!;
  if (!base64Data) return null;
  return `%${base64Data}.sha256`;
}

export function toBlobSigil(uri: string): BlobId | null {
  const base64Data = extractBase64Data(new URL(uri).pathname)!;
  if (!base64Data) return null;
  return `&${base64Data}.sha256`;
}

export function toMultiserverAddress(uri: string): string | null {
  return new URL(uri).searchParams.get('multiserverAddress');
}

function checkTypeFormat(uri: string | null, ...args: TF): boolean {
  if (!uri) return false as any;
  const [type, format] = args;
  return ((uri.startsWith(`ssb:${type}:${format}:`) ||
    uri.startsWith(`ssb:${type}/${format}/`) ||
    uri.startsWith(`ssb://${type}/${format}/`)) &&
    !!extractBase64Data(new URL(uri).pathname)) as any;
}

export function isFeedSSBURI(uri: string | null) {
  return checkTypeFormat(uri, 'feed', 'ed25519');
}

export function isBendyButtV1FeedSSBURI(uri: string | null) {
  return checkTypeFormat(uri, 'feed', 'bendybutt-v1');
}

export function isGabbyGroveV1FeedSSBURI(uri: string | null) {
  return checkTypeFormat(uri, 'feed', 'gabbygrove-v1');
}

export function isButtwooV1FeedSSBURI(uri: string | null) {
  return checkTypeFormat(uri, 'feed', 'buttwoo-v1');
}

export function isMessageSSBURI(uri: string | null) {
  return checkTypeFormat(uri, 'message', 'sha256');
}

export function isBendyButtV1MessageSSBURI(uri: string | null) {
  return checkTypeFormat(uri, 'message', 'bendybutt-v1');
}

export function isGabbyGroveV1MessageSSBURI(uri: string | null) {
  return checkTypeFormat(uri, 'message', 'gabbygrove-v1');
}

export function isButtwooV1MessageSSBURI(uri: string | null) {
  return checkTypeFormat(uri, 'message', 'buttwoo-v1');
}

export function isBlobSSBURI(uri: string | null) {
  return checkTypeFormat(uri, 'blob', 'sha256');
}

export function isAddressSSBURI(uri: string | null) {
  if (!uri) return false;
  return (
    (uri.startsWith('ssb:address:multiserver') ||
      uri.startsWith('ssb:address/multiserver') ||
      uri.startsWith('ssb://address/multiserver')) &&
    !!new URL(uri).searchParams.get('multiserverAddress')
  );
}

export function isEncryptionKeyBox2DMDiffieHellmanSSBURI(uri: string | null) {
  return checkTypeFormat(uri, 'encryption-key', 'box2-dm-dh');
}

export function isIdentityPOBoxSSBURI(uri: string | null) {
  return checkTypeFormat(uri, 'identity', 'po-box');
}

export function isIdentityFusionSSBURI(uri: string | null) {
  return checkTypeFormat(uri, 'identity', 'fusion');
}

export function isExperimentalSSBURI(uri: string | null) {
  if (!uri) return false;
  return (
    uri.startsWith('ssb:experimental') || uri.startsWith('ssb://experimental')
  );
}

export function isExperimentalSSBURIWithAction(action: string) {
  return (uri: string | null) => {
    if (!uri) return false;
    return (
      isExperimentalSSBURI(uri) &&
      new URL(uri).searchParams.get('action') === action
    );
  };
}

export function isSSBURI(uri: string | null) {
  return (
    isFeedSSBURI(uri) ||
    isBendyButtV1FeedSSBURI(uri) ||
    isGabbyGroveV1FeedSSBURI(uri) ||
    isButtwooV1FeedSSBURI(uri) ||
    isMessageSSBURI(uri) ||
    isBendyButtV1MessageSSBURI(uri) ||
    isGabbyGroveV1MessageSSBURI(uri) ||
    isButtwooV1MessageSSBURI(uri) ||
    isBlobSSBURI(uri) ||
    isAddressSSBURI(uri) ||
    isEncryptionKeyBox2DMDiffieHellmanSSBURI(uri) ||
    isIdentityPOBoxSSBURI(uri) ||
    isIdentityFusionSSBURI(uri) ||
    isExperimentalSSBURI(uri)
  );
}

export function getFeedSSBURIRegex() {
  const type: FeedTF[0] = 'feed';
  const format: Array<FeedTF[1]> = ['ed25519', 'bendybutt-v1', 'gabbygrove-v1', 'buttwoo-v1'];
  return new RegExp(
    `ssb:(\/\/)?` +
      `${type}(\/|:)` +
      `(${format.join('|')})(\/|:)` +
      `[a-zA-Z0-9_\-]{43}=`,
  );
}

export function getMessageSSBURIRegex() {
  const type: MessageTF[0] = 'message';
  const format: Array<MessageTF[1]> = [
    'sha256',
    'bendybutt-v1',
    'gabbygrove-v1',
    'buttwoo-v1'
  ];
  return new RegExp(
    `ssb:(\/\/)?` +
      `${type}(\/|:)` +
      `(${format.join('|')})(\/|:)` +
      `[a-zA-Z0-9_\-]{43}=`,
  );
}

type PartsFor<X extends TF> = {
  type: X[0];
  format: X[1];
  data: string;
};

type CanonicalParts =
  | PartsFor<FeedTF>
  | PartsFor<MessageTF>
  | PartsFor<BlobTF>
  | PartsFor<AddressTF>
  | PartsFor<EncryptionKeyTF>
  | PartsFor<IdentityTF>;

function validateParts(parts: Partial<CanonicalParts>) {
  if (!parts.type) throw new Error('Missing required "type" property');
  if (!parts.format) throw new Error('Missing required "format" property');
  if (!parts.data) throw new Error('Missing required "data" property');

  if (parts.type === 'feed') {
    if (
      parts.format !== 'ed25519' &&
      parts.format !== 'bendybutt-v1' &&
      parts.format !== 'gabbygrove-v1' &&
      parts.format !== 'buttwoo-v1'
    ) {
      throw new Error('Unknown format for type "feed": ' + parts.format);
    } else return;
  }

  if (parts.type === 'message') {
    if (
      parts.format !== 'sha256' &&
      parts.format !== 'bendybutt-v1' &&
      parts.format !== 'gabbygrove-v1' &&
      parts.format !== 'buttwoo-v1'
    ) {
      throw new Error('Unknown format for type "message": ' + parts.format);
    } else return;
  }

  if (parts.type === 'blob') {
    if (parts.format !== 'sha256') {
      throw new Error('Unknown format for type "blob": ' + parts.format);
    } else return;
  }

  if (parts.type === 'address') {
    if (parts.format !== 'multiserver') {
      throw new Error('Unknown format for type "address": ' + parts.format);
    } else return;
  }

  if (parts.type === 'encryption-key') {
    if (parts.format !== 'box2-dm-dh') {
      throw new Error(
        'Unknown format for type "encryption-key": ' + parts.format,
      );
    } else return;
  }

  if (parts.type === 'identity') {
    if (parts.format !== 'po-box' && parts.format !== 'fusion') {
      throw new Error('Unknown format for type "identity": ' + parts.format);
    } else return;
  }
}

export function compose(parts: Partial<CanonicalParts>) {
  validateParts(parts as Partial<CanonicalParts>);
  const {type, format, data} = parts as CanonicalParts;
  return `ssb:${type}/${format}/${Base64.unsafeToSafe(data)}`;
}

export function decompose(uri: string): CanonicalParts {
  const pathname = new URL(uri).pathname;
  if (!pathname) {
    throw new Error('Invalid SSB URI: ' + uri);
  }
  let [type, format, data] = pathname.split('/');
  data = Base64.safeToUnsafe(data);
  const parts = {type, format, data} as CanonicalParts;
  validateParts(parts);
  return parts;
}

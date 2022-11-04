import { BlobId, FeedId, MsgId } from 'ssb-typescript';

type FeedTF =
  | ['feed', 'classic']
  | ['feed', 'ed25519']
  | ['feed', 'bendybutt-v1']
  | ['feed', 'gabbygrove-v1']
  | ['feed', 'buttwoo-v1']
  | ['feed', 'indexed-v1'];
type MessageTF =
  | ['message', 'classic']
  | ['message', 'sha256']
  | ['message', 'bendybutt-v1']
  | ['message', 'gabbygrove-v1']
  | ['message', 'buttwoo-v1']
  | ['message', 'indexed-v1']
  | ['message', 'cloaked'];
type BlobTF = ['blob', 'classic'] | ['blob', 'sha256'];
type AddressTF = ['address', 'multiserver'];
type EncryptionKeyTF = ['encryption-key', 'box2-dm-dh'];
type IdentityTF =
  | ['identity', 'po-box']
  | ['identity', 'group']
  | ['identity', 'fusion'];
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
  if (typeof sigil !== 'string') return null;
  if (!sigil.startsWith('@')) return null;
  const data = Base64.unsafeToSafe(sigil.slice(1, -8));
  return `ssb:feed/classic/${data}`;
}

export function fromMessageSigil(sigil: MsgId) {
  if (typeof sigil !== 'string') return null;
  if (!sigil.startsWith('%')) return null;
  const data = Base64.unsafeToSafe(sigil.slice(1, -7));
  return `ssb:message/classic/${data}`;
}

export function fromBlobSigil(sigil: BlobId) {
  if (typeof sigil !== 'string') return null;
  if (!sigil.startsWith('&')) return null;
  const data = Base64.unsafeToSafe(sigil.slice(1, -7));
  return `ssb:blob/classic/${data}`;
}

export function fromMultiserverAddress(msaddr: string) {
  const encoded = encodeURIComponent(msaddr);
  return `ssb:address/multiserver?multiserverAddress=${encoded}`;
}

export function toFeedSigil(uri: string): FeedId | null {
  if (!isClassicFeedSSBURI(uri)) return null;
  const base64Data = extractBase64Data(new URL(uri).pathname)!;
  if (!base64Data) return null;
  return `@${base64Data}.ed25519`;
}

export function toMessageSigil(uri: string): MsgId | null {
  if (!isClassicMessageSSBURI(uri)) return null;
  const base64Data = extractBase64Data(new URL(uri).pathname)!;
  if (!base64Data) return null;
  return `%${base64Data}.sha256`;
}

export function toBlobSigil(uri: string): BlobId | null {
  if (!isClassicBlobSSBURI(uri)) return null;
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

export function isClassicFeedSSBURI(uri: string | null) {
  return (
    checkTypeFormat(uri, 'feed', 'classic') ||
    checkTypeFormat(uri, 'feed', 'ed25519')
  );
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

export function isIndexedV1FeedSSBURI(uri: string | null) {
  return checkTypeFormat(uri, 'feed', 'indexed-v1');
}

export function isFeedSSBURI(uri: string | null) {
  return (
    isClassicFeedSSBURI(uri) ||
    isBendyButtV1FeedSSBURI(uri) ||
    isGabbyGroveV1FeedSSBURI(uri) ||
    isButtwooV1FeedSSBURI(uri) ||
    isIndexedV1FeedSSBURI(uri)
  );
}

export function isClassicMessageSSBURI(uri: string | null) {
  return (
    checkTypeFormat(uri, 'message', 'classic') ||
    checkTypeFormat(uri, 'message', 'sha256')
  );
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

export function isIndexedV1MessageSSBURI(uri: string | null) {
  return checkTypeFormat(uri, 'message', 'indexed-v1');
}

export function isCloakedV1MessageSSBURI(uri: string | null) {
  return checkTypeFormat(uri, 'message', 'cloaked');
}

export function isMessageSSBURI(uri: string | null) {
  return (
    isClassicMessageSSBURI(uri) ||
    isBendyButtV1MessageSSBURI(uri) ||
    isGabbyGroveV1MessageSSBURI(uri) ||
    isButtwooV1MessageSSBURI(uri) ||
    isIndexedV1MessageSSBURI(uri) ||
    isCloakedV1MessageSSBURI(uri)
  );
}

export function isClassicBlobSSBURI(uri: string | null) {
  return (
    checkTypeFormat(uri, 'blob', 'classic') ||
    checkTypeFormat(uri, 'blob', 'sha256')
  );
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

export function isIdentityGroupSSBURI(uri: string | null) {
  return checkTypeFormat(uri, 'identity', 'group');
}

export function isIdentityFusionSSBURI(uri: string | null) {
  return checkTypeFormat(uri, 'identity', 'fusion');
}

export function isIdentitySSBURI(uri: string | null) {
  return (
    isIdentityPOBoxSSBURI(uri) ||
    isIdentityGroupSSBURI(uri) ||
    isIdentityFusionSSBURI(uri)
  );
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
    isMessageSSBURI(uri) ||
    isClassicBlobSSBURI(uri) ||
    isAddressSSBURI(uri) ||
    isEncryptionKeyBox2DMDiffieHellmanSSBURI(uri) ||
    isIdentitySSBURI(uri) ||
    isExperimentalSSBURI(uri)
  );
}

export function getFeedSSBURIRegex() {
  const type: FeedTF[0] = 'feed';
  const formatsWith3Parts: Array<FeedTF[1]> = [
    'classic',
    'ed25519',
    'bendybutt-v1',
    'gabbygrove-v1',
    'buttwoo-v1',
    'indexed-v1',
  ];
  const formatsWith4Parts: Array<FeedTF[1]> = ['buttwoo-v1'];
  const ruleWith3 =
    `ssb:(\/\/)?` +
    `${type}(\/|:)` +
    `(${formatsWith3Parts.join('|')})(\/|:)` +
    `[a-zA-Z0-9_\-]{43}=`;
  const ruleWith4 =
    `ssb:(\/\/)?` +
    `${type}(\/|:)` +
    `(${formatsWith4Parts.join('|')})(\/|:)` +
    `[a-zA-Z0-9_\-]{43}=(\/|:)` +
    `[a-zA-Z0-9_\-]{43}=`;
  return new RegExp(`(${ruleWith4}|${ruleWith3})`);
}

export function getMessageSSBURIRegex() {
  const type: MessageTF[0] = 'message';
  const format: Array<MessageTF[1]> = [
    'classic',
    'sha256',
    'bendybutt-v1',
    'gabbygrove-v1',
    'buttwoo-v1',
    'indexed-v1',
    'cloaked',
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
  extraData?: string;
};

type CanonicalParts =
  | PartsFor<FeedTF>
  | PartsFor<MessageTF>
  | PartsFor<BlobTF>
  | PartsFor<AddressTF>
  | PartsFor<EncryptionKeyTF>
  | PartsFor<IdentityTF>;

function validateParts({ type, format, data }: Partial<CanonicalParts>) {
  if (!type) throw new Error('Missing required "type" property');
  if (!format) throw new Error('Missing required "format" property');
  if (!data) throw new Error('Missing required "data" property');

  if (type === 'feed') {
    if (
      format !== 'classic' &&
      format !== 'ed25519' &&
      format !== 'bendybutt-v1' &&
      format !== 'gabbygrove-v1' &&
      format !== 'buttwoo-v1' &&
      format !== 'indexed-v1'
    ) {
      throw new Error('Unknown format for type "feed": ' + format);
    } else return;
  }

  if (type === 'message') {
    if (
      format !== 'classic' &&
      format !== 'sha256' &&
      format !== 'bendybutt-v1' &&
      format !== 'gabbygrove-v1' &&
      format !== 'buttwoo-v1' &&
      format !== 'indexed-v1' &&
      format !== 'cloaked'
    ) {
      throw new Error('Unknown format for type "message": ' + format);
    } else return;
  }

  if (type === 'blob') {
    if (format !== 'classic' && format !== 'sha256') {
      throw new Error('Unknown format for type "blob": ' + format);
    } else return;
  }

  if (type === 'address') {
    if (format !== 'multiserver') {
      throw new Error('Unknown format for type "address": ' + format);
    } else return;
  }

  if (type === 'encryption-key') {
    if (format !== 'box2-dm-dh') {
      throw new Error('Unknown format for type "encryption-key": ' + format);
    } else return;
  }

  if (type === 'identity') {
    if (format !== 'po-box' && format !== 'group' && format !== 'fusion') {
      throw new Error('Unknown format for type "identity": ' + format);
    } else return;
  }
}

/**
 * *Mutates* the `parts` object to avoid deprecated URIs.
 * @param parts
 */
function fixParts(parts: Partial<CanonicalParts>) {
  const { type, format } = parts;
  if (type === 'feed' && format === 'ed25519') {
    parts.format = 'classic';
    return;
  }
  if (type === 'message' && format === 'sha256') {
    parts.format = 'classic';
    return;
  }
  if (type === 'blob' && format === 'sha256') {
    parts.format = 'classic';
    return;
  }
}

export function compose(parts: Partial<CanonicalParts>) {
  validateParts(parts as Partial<CanonicalParts>);
  const { type, format, data, extraData } = parts as CanonicalParts;
  const safeData = Base64.unsafeToSafe(data);
  if (extraData) {
    const safeExtraData = Base64.unsafeToSafe(extraData);
    return `ssb:${type}/${format}/${safeData}/${safeExtraData}`;
  } else {
    return `ssb:${type}/${format}/${safeData}`;
  }
}

export function decompose(uri: string): CanonicalParts {
  if (uri.length < 5) {
    throw new Error('Invalid SSB URI: ' + uri);
  }

  const pathname = uri.substring(4);
  const [type, format, safeData, safeExtraData] = pathname.split('/');
  const data = Base64.safeToUnsafe(safeData);
  const parts = { type, format, data } as CanonicalParts;
  validateParts(parts);
  fixParts(parts);
  if (safeExtraData) parts.extraData = Base64.safeToUnsafe(safeExtraData);
  return parts;
}

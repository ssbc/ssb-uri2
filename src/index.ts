import {BlobId, FeedId, MsgId} from 'ssb-typescript';

const urlParse = require('url-parse');

const Base64 = {
  unsafeToSafe(input: string) {
    return input.replace(/\+/g, '-').replace(/\//g, '_');
  },

  safeToUnsafe(input: string) {
    return input.replace(/-/g, '+').replace(/_/g, '/');
  },
};

function getSigilData(pathname: string | null): string | null {
  if (!pathname) return null;
  const ref = /(:|\/)([\w_\-=]+)$/.exec(pathname)?.[2];
  if (!ref) return null;
  return Base64.safeToUnsafe(ref);
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
  const sigilData = getSigilData(urlParse(uri, true).pathname)!;
  if (!sigilData) return null;
  return `@${sigilData}.ed25519`;
}

export function toMessageSigil(uri: string): MsgId | null {
  const sigilData = getSigilData(urlParse(uri, true).pathname)!;
  if (!sigilData) return null;
  return `%${sigilData}.sha256`;
}

export function toBlobSigil(uri: string): BlobId | null {
  const sigilData = getSigilData(urlParse(uri, true).pathname)!;
  if (!sigilData) return null;
  return `&${sigilData}.sha256`;
}

export function toMultiserverAddress(uri: string): string | null {
  return urlParse(uri, true).query!.multiserverAddress;
}

export function isFeedSSBURI(uri: string | null) {
  if (!uri) return false;
  return (
    (uri.startsWith('ssb:feed:ed25519:') ||
      uri.startsWith('ssb:feed/ed25519/') ||
      uri.startsWith('ssb://feed/ed25519/')) &&
    !!getSigilData(urlParse(uri, true).pathname)
  );
}

export function isMessageSSBURI(uri: string | null) {
  if (!uri) return false;
  return (
    (uri.startsWith('ssb:message:sha256:') ||
      uri.startsWith('ssb:message/sha256/') ||
      uri.startsWith('ssb://message/sha256/')) &&
    !!getSigilData(urlParse(uri, true).pathname)
  );
}

export function isBlobSSBURI(uri: string | null) {
  if (!uri) return false;
  return (
    (uri.startsWith('ssb:blob:sha256:') ||
      uri.startsWith('ssb:blob/sha256/') ||
      uri.startsWith('ssb://blob/sha256/')) &&
    !!getSigilData(urlParse(uri, true).pathname)
  );
}

export function isAddressSSBURI(uri: string | null) {
  if (!uri) return false;
  return (
    (uri.startsWith('ssb:address:multiserver') ||
      uri.startsWith('ssb:address/multiserver') ||
      uri.startsWith('ssb://address/multiserver')) &&
    !!urlParse(uri, true).query?.multiserverAddress
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
    return (
      isExperimentalSSBURI(uri) && urlParse(uri, true).query?.action === action
    );
  };
}

export function isSSBURI(uri: string | null) {
  return (
    isFeedSSBURI(uri) ||
    isMessageSSBURI(uri) ||
    isBlobSSBURI(uri) ||
    isAddressSSBURI(uri) ||
    isExperimentalSSBURI(uri)
  );
}

interface CanonicalFeedParts {
  type: 'feed';
  format: 'ed25519';
  data: string;
}

interface CanonicalMessageParts {
  type: 'message';
  format: 'sha256';
  data: string;
}

interface CanonicalBlobParts {
  type: 'blob';
  format: 'sha256';
  data: string;
}

interface CanonicalAddressParts {
  type: 'address';
  format: 'multiserver';
  data: string;
}

type CanonicalParts =
  | CanonicalFeedParts
  | CanonicalMessageParts
  | CanonicalBlobParts
  | CanonicalAddressParts;

type RoughlyParts = {
  [k in keyof CanonicalParts]?: string;
};

function validateParts(parts: Partial<CanonicalParts>) {
  if (!parts.type) throw new Error('Missing required "type" property');
  if (!parts.format) throw new Error('Missing required "format" property');
  if (!parts.data) throw new Error('Missing required "data" property');

  if (parts.type === 'feed' && parts.format !== 'ed25519') {
    throw new Error('Unknown format for type "feed": ' + parts.format);
  } else if (parts.type === 'message' && parts.format !== 'sha256') {
    throw new Error('Unknown format for type "message": ' + parts.format);
  } else if (parts.type === 'blob' && parts.format !== 'sha256') {
    throw new Error('Unknown format for type "blob": ' + parts.format);
  } else if (parts.type === 'address' && parts.format !== 'multiserver') {
    throw new Error('Unknown format for type "address": ' + parts.format);
  }
}

export function compose(parts: RoughlyParts) {
  validateParts(parts as Partial<CanonicalParts>);
  const {type, format, data} = parts as CanonicalParts;
  return `ssb:${type}/${format}/${Base64.unsafeToSafe(data)}`;
}

export function decompose(uri: string): CanonicalParts {
  const pathname = urlParse(uri, true).pathname;
  if (!pathname) {
    throw new Error('Invalid SSB URI: ' + uri);
  }
  const [type, format, data] = pathname.split('/');
  const parts = {type, format, data};
  validateParts(parts);
  return parts;
}

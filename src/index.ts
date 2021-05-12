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

function getSSBURIBase64Part(pathname: string | null): string | null {
  if (!pathname) return null;
  const ref = /(:|\/)([\w_\-=]+)$/.exec(pathname)?.[2];
  if (!ref) return null;
  return Base64.safeToUnsafe(ref);
}

export function fromFeedSigil(sigil: FeedId) {
  const ref = Base64.unsafeToSafe(sigil.slice(1, -8));
  return `ssb:feed/ed25519/${ref}`;
}

export function fromMessageSigil(sigil: MsgId) {
  const ref = Base64.unsafeToSafe(sigil.slice(1, -7));
  return `ssb:message/sha256/${ref}`;
}

export function fromBlobSigil(sigil: BlobId) {
  const ref = Base64.unsafeToSafe(sigil.slice(1, -7));
  return `ssb:blob/sha256/${ref}`;
}

export function fromMultiserverAddress(msaddr: string) {
  const encoded = encodeURIComponent(msaddr)
  return `ssb:address/multiserver?multiserverAddress=${encoded}`
}

export function toFeedSigil(uri: string): FeedId | null {
  const ref = getSSBURIBase64Part(urlParse(uri, true).pathname)!;
  if (!ref) return null;
  return `@${ref}.ed25519`;
}

export function toMessageSigil(uri: string): MsgId | null {
  const ref = getSSBURIBase64Part(urlParse(uri, true).pathname)!;
  if (!ref) return null;
  return `%${ref}.sha256`;
}

export function toBlobSigil(uri: string): BlobId | null {
  const ref = getSSBURIBase64Part(urlParse(uri, true).pathname)!;
  if (!ref) return null;
  return `&${ref}.sha256`;
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
    !!getSSBURIBase64Part(urlParse(uri, true).pathname)
  );
}

export function isMessageSSBURI(uri: string | null) {
  if (!uri) return false;
  return (
    (uri.startsWith('ssb:message:sha256:') ||
      uri.startsWith('ssb:message/sha256/') ||
      uri.startsWith('ssb://message/sha256/')) &&
    !!getSSBURIBase64Part(urlParse(uri, true).pathname)
  );
}

export function isBlobSSBURI(uri: string | null) {
  if (!uri) return false;
  return (
    (uri.startsWith('ssb:blob:sha256:') ||
      uri.startsWith('ssb:blob/sha256/') ||
      uri.startsWith('ssb://blob/sha256/')) &&
    !!getSSBURIBase64Part(urlParse(uri, true).pathname)
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

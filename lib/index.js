"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decompose = exports.compose = exports.getMessageSSBURIRegex = exports.getFeedSSBURIRegex = exports.isSSBURI = exports.isExperimentalSSBURIWithAction = exports.isExperimentalSSBURI = exports.isIdentityFusionSSBURI = exports.isIdentityPOBoxSSBURI = exports.isEncryptionKeyBox2DMDiffieHellmanSSBURI = exports.isAddressSSBURI = exports.isClassicBlobSSBURI = exports.isIndexedV1MessageSSBURI = exports.isButtwooV1MessageSSBURI = exports.isGabbyGroveV1MessageSSBURI = exports.isBendyButtV1MessageSSBURI = exports.isClassicMessageSSBURI = exports.isIndexedV1FeedSSBURI = exports.isButtwooV1FeedSSBURI = exports.isGabbyGroveV1FeedSSBURI = exports.isBendyButtV1FeedSSBURI = exports.isClassicFeedSSBURI = exports.toMultiserverAddress = exports.toBlobSigil = exports.toMessageSigil = exports.toFeedSigil = exports.fromMultiserverAddress = exports.fromBlobSigil = exports.fromMessageSigil = exports.fromFeedSigil = void 0;
const Base64 = {
    unsafeToSafe(input) {
        return input.replace(/\+/g, '-').replace(/\//g, '_');
    },
    safeToUnsafe(input) {
        return input.replace(/-/g, '+').replace(/_/g, '/');
    },
};
function extractBase64Data(pathname) {
    var _a;
    if (!pathname)
        return null;
    const lastPortion = (_a = /(:|\/)([\w_\-=]+)$/.exec(pathname)) === null || _a === void 0 ? void 0 : _a[2];
    if (!lastPortion)
        return null;
    return Base64.safeToUnsafe(lastPortion);
}
function fromFeedSigil(sigil) {
    const data = Base64.unsafeToSafe(sigil.slice(1, -8));
    return `ssb:feed/classic/${data}`;
}
exports.fromFeedSigil = fromFeedSigil;
function fromMessageSigil(sigil) {
    const data = Base64.unsafeToSafe(sigil.slice(1, -7));
    return `ssb:message/classic/${data}`;
}
exports.fromMessageSigil = fromMessageSigil;
function fromBlobSigil(sigil) {
    const data = Base64.unsafeToSafe(sigil.slice(1, -7));
    return `ssb:blob/classic/${data}`;
}
exports.fromBlobSigil = fromBlobSigil;
function fromMultiserverAddress(msaddr) {
    const encoded = encodeURIComponent(msaddr);
    return `ssb:address/multiserver?multiserverAddress=${encoded}`;
}
exports.fromMultiserverAddress = fromMultiserverAddress;
function toFeedSigil(uri) {
    if (!isClassicFeedSSBURI(uri))
        return null;
    const base64Data = extractBase64Data(new URL(uri).pathname);
    if (!base64Data)
        return null;
    return `@${base64Data}.ed25519`;
}
exports.toFeedSigil = toFeedSigil;
function toMessageSigil(uri) {
    if (!isClassicMessageSSBURI(uri))
        return null;
    const base64Data = extractBase64Data(new URL(uri).pathname);
    if (!base64Data)
        return null;
    return `%${base64Data}.sha256`;
}
exports.toMessageSigil = toMessageSigil;
function toBlobSigil(uri) {
    if (!isClassicBlobSSBURI(uri))
        return null;
    const base64Data = extractBase64Data(new URL(uri).pathname);
    if (!base64Data)
        return null;
    return `&${base64Data}.sha256`;
}
exports.toBlobSigil = toBlobSigil;
function toMultiserverAddress(uri) {
    return new URL(uri).searchParams.get('multiserverAddress');
}
exports.toMultiserverAddress = toMultiserverAddress;
function checkTypeFormat(uri, ...args) {
    if (!uri)
        return false;
    const [type, format] = args;
    return ((uri.startsWith(`ssb:${type}:${format}:`) ||
        uri.startsWith(`ssb:${type}/${format}/`) ||
        uri.startsWith(`ssb://${type}/${format}/`)) &&
        !!extractBase64Data(new URL(uri).pathname));
}
function isClassicFeedSSBURI(uri) {
    return (checkTypeFormat(uri, 'feed', 'classic') ||
        checkTypeFormat(uri, 'feed', 'ed25519'));
}
exports.isClassicFeedSSBURI = isClassicFeedSSBURI;
function isBendyButtV1FeedSSBURI(uri) {
    return checkTypeFormat(uri, 'feed', 'bendybutt-v1');
}
exports.isBendyButtV1FeedSSBURI = isBendyButtV1FeedSSBURI;
function isGabbyGroveV1FeedSSBURI(uri) {
    return checkTypeFormat(uri, 'feed', 'gabbygrove-v1');
}
exports.isGabbyGroveV1FeedSSBURI = isGabbyGroveV1FeedSSBURI;
function isButtwooV1FeedSSBURI(uri) {
    return checkTypeFormat(uri, 'feed', 'buttwoo-v1');
}
exports.isButtwooV1FeedSSBURI = isButtwooV1FeedSSBURI;
function isIndexedV1FeedSSBURI(uri) {
    return checkTypeFormat(uri, 'feed', 'indexed-v1');
}
exports.isIndexedV1FeedSSBURI = isIndexedV1FeedSSBURI;
function isClassicMessageSSBURI(uri) {
    return (checkTypeFormat(uri, 'message', 'classic') ||
        checkTypeFormat(uri, 'message', 'sha256'));
}
exports.isClassicMessageSSBURI = isClassicMessageSSBURI;
function isBendyButtV1MessageSSBURI(uri) {
    return checkTypeFormat(uri, 'message', 'bendybutt-v1');
}
exports.isBendyButtV1MessageSSBURI = isBendyButtV1MessageSSBURI;
function isGabbyGroveV1MessageSSBURI(uri) {
    return checkTypeFormat(uri, 'message', 'gabbygrove-v1');
}
exports.isGabbyGroveV1MessageSSBURI = isGabbyGroveV1MessageSSBURI;
function isButtwooV1MessageSSBURI(uri) {
    return checkTypeFormat(uri, 'message', 'buttwoo-v1');
}
exports.isButtwooV1MessageSSBURI = isButtwooV1MessageSSBURI;
function isIndexedV1MessageSSBURI(uri) {
    return checkTypeFormat(uri, 'message', 'indexed-v1');
}
exports.isIndexedV1MessageSSBURI = isIndexedV1MessageSSBURI;
function isClassicBlobSSBURI(uri) {
    return (checkTypeFormat(uri, 'blob', 'classic') ||
        checkTypeFormat(uri, 'blob', 'sha256'));
}
exports.isClassicBlobSSBURI = isClassicBlobSSBURI;
function isAddressSSBURI(uri) {
    if (!uri)
        return false;
    return ((uri.startsWith('ssb:address:multiserver') ||
        uri.startsWith('ssb:address/multiserver') ||
        uri.startsWith('ssb://address/multiserver')) &&
        !!new URL(uri).searchParams.get('multiserverAddress'));
}
exports.isAddressSSBURI = isAddressSSBURI;
function isEncryptionKeyBox2DMDiffieHellmanSSBURI(uri) {
    return checkTypeFormat(uri, 'encryption-key', 'box2-dm-dh');
}
exports.isEncryptionKeyBox2DMDiffieHellmanSSBURI = isEncryptionKeyBox2DMDiffieHellmanSSBURI;
function isIdentityPOBoxSSBURI(uri) {
    return checkTypeFormat(uri, 'identity', 'po-box');
}
exports.isIdentityPOBoxSSBURI = isIdentityPOBoxSSBURI;
function isIdentityFusionSSBURI(uri) {
    return checkTypeFormat(uri, 'identity', 'fusion');
}
exports.isIdentityFusionSSBURI = isIdentityFusionSSBURI;
function isExperimentalSSBURI(uri) {
    if (!uri)
        return false;
    return (uri.startsWith('ssb:experimental') || uri.startsWith('ssb://experimental'));
}
exports.isExperimentalSSBURI = isExperimentalSSBURI;
function isExperimentalSSBURIWithAction(action) {
    return (uri) => {
        if (!uri)
            return false;
        return (isExperimentalSSBURI(uri) &&
            new URL(uri).searchParams.get('action') === action);
    };
}
exports.isExperimentalSSBURIWithAction = isExperimentalSSBURIWithAction;
function isSSBURI(uri) {
    return (isClassicFeedSSBURI(uri) ||
        isBendyButtV1FeedSSBURI(uri) ||
        isGabbyGroveV1FeedSSBURI(uri) ||
        isButtwooV1FeedSSBURI(uri) ||
        isIndexedV1FeedSSBURI(uri) ||
        isClassicMessageSSBURI(uri) ||
        isBendyButtV1MessageSSBURI(uri) ||
        isGabbyGroveV1MessageSSBURI(uri) ||
        isButtwooV1MessageSSBURI(uri) ||
        isIndexedV1MessageSSBURI(uri) ||
        isClassicBlobSSBURI(uri) ||
        isAddressSSBURI(uri) ||
        isEncryptionKeyBox2DMDiffieHellmanSSBURI(uri) ||
        isIdentityPOBoxSSBURI(uri) ||
        isIdentityFusionSSBURI(uri) ||
        isExperimentalSSBURI(uri));
}
exports.isSSBURI = isSSBURI;
function getFeedSSBURIRegex() {
    const type = 'feed';
    const formatsWith3Parts = [
        'classic',
        'ed25519',
        'bendybutt-v1',
        'gabbygrove-v1',
        'buttwoo-v1',
        'indexed-v1',
    ];
    const formatsWith4Parts = ['buttwoo-v1'];
    const ruleWith3 = `ssb:(\/\/)?` +
        `${type}(\/|:)` +
        `(${formatsWith3Parts.join('|')})(\/|:)` +
        `[a-zA-Z0-9_\-]{43}=`;
    const ruleWith4 = `ssb:(\/\/)?` +
        `${type}(\/|:)` +
        `(${formatsWith4Parts.join('|')})(\/|:)` +
        `[a-zA-Z0-9_\-]{43}=(\/|:)` +
        `[a-zA-Z0-9_\-]{43}=`;
    return new RegExp(`(${ruleWith4}|${ruleWith3})`);
}
exports.getFeedSSBURIRegex = getFeedSSBURIRegex;
function getMessageSSBURIRegex() {
    const type = 'message';
    const format = [
        'classic',
        'sha256',
        'bendybutt-v1',
        'gabbygrove-v1',
        'buttwoo-v1',
        'indexed-v1',
    ];
    return new RegExp(`ssb:(\/\/)?` +
        `${type}(\/|:)` +
        `(${format.join('|')})(\/|:)` +
        `[a-zA-Z0-9_\-]{43}=`);
}
exports.getMessageSSBURIRegex = getMessageSSBURIRegex;
function validateParts({ type, format, data }) {
    if (!type)
        throw new Error('Missing required "type" property');
    if (!format)
        throw new Error('Missing required "format" property');
    if (!data)
        throw new Error('Missing required "data" property');
    if (type === 'feed') {
        if (format !== 'classic' &&
            format !== 'ed25519' &&
            format !== 'bendybutt-v1' &&
            format !== 'gabbygrove-v1' &&
            format !== 'buttwoo-v1' &&
            format !== 'indexed-v1') {
            throw new Error('Unknown format for type "feed": ' + format);
        }
        else
            return;
    }
    if (type === 'message') {
        if (format !== 'classic' &&
            format !== 'sha256' &&
            format !== 'bendybutt-v1' &&
            format !== 'gabbygrove-v1' &&
            format !== 'buttwoo-v1' &&
            format !== 'indexed-v1') {
            throw new Error('Unknown format for type "message": ' + format);
        }
        else
            return;
    }
    if (type === 'blob') {
        if (format !== 'classic' && format !== 'sha256') {
            throw new Error('Unknown format for type "blob": ' + format);
        }
        else
            return;
    }
    if (type === 'address') {
        if (format !== 'multiserver') {
            throw new Error('Unknown format for type "address": ' + format);
        }
        else
            return;
    }
    if (type === 'encryption-key') {
        if (format !== 'box2-dm-dh') {
            throw new Error('Unknown format for type "encryption-key": ' + format);
        }
        else
            return;
    }
    if (type === 'identity') {
        if (format !== 'po-box' && format !== 'fusion') {
            throw new Error('Unknown format for type "identity": ' + format);
        }
        else
            return;
    }
}
function fixParts(parts) {
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
function compose(parts) {
    validateParts(parts);
    const { type, format, data, extraData } = parts;
    const safeData = Base64.unsafeToSafe(data);
    if (extraData) {
        const safeExtraData = Base64.unsafeToSafe(extraData);
        return `ssb:${type}/${format}/${safeData}/${safeExtraData}`;
    }
    else {
        return `ssb:${type}/${format}/${safeData}`;
    }
}
exports.compose = compose;
function decompose(uri) {
    if (uri.length < 5) {
        throw new Error('Invalid SSB URI: ' + uri);
    }
    const pathname = uri.substring(4);
    const [type, format, safeData, safeExtraData] = pathname.split('/');
    const data = Base64.safeToUnsafe(safeData);
    const parts = { type, format, data };
    validateParts(parts);
    fixParts(parts);
    if (safeExtraData)
        parts.extraData = Base64.safeToUnsafe(safeExtraData);
    return parts;
}
exports.decompose = decompose;

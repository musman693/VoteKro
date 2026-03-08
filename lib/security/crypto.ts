import * as Crypto from 'expo-crypto';

const toHex = (bytes: Uint8Array): string => {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const sha256 = async (input: string): Promise<string> => {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, input);
};

export const randomNonce = async (size = 32): Promise<string> => {
  const bytes = Crypto.getRandomBytes(size);
  return toHex(bytes);
};

export const buildVoteCommitment = async (
  electionId: string,
  candidateId: string,
  nonce: string
): Promise<string> => {
  return sha256(`${electionId}|${candidateId}|${nonce}`);
};

export const verifyHash = async (payload: string, expectedHash: string): Promise<boolean> => {
  const actual = await sha256(payload);
  return actual === expectedHash;
};

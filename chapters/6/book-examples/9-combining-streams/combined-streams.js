/** 
 * To illustrate a simple example of combining streams, let's consider the case of the
following two Transform streams:
• One that both compresses and encrypts the data
• One that both decrypts and decompresses the data

Using a library such as pumpify, we can easily build these streams (in a file called
combined-streams.js) by combining some of the streams that we already have
available from the core libraries:
*/

import { createGzip, createGunzip } from "zlib";
import { createCipheriv, createDecipheriv, scryptSync } from "crypto";
import pumpify from "pumpify";

function createKey(password) {
  return scryptSync(password, "salt", 24);
}

export function createCompressAndEncrypt(password, iv) {
  const key = createKey(password);
  const combinedStream = pumpify(
    createGzip(),
    createCipheriv("aes192", key, iv)
  );
  combinedStream.iv = iv;
  return combinedStream;
}

export function createDecryptAndDecompress(password, iv) {
  const key = createKey(password);
  return pumpify(createDecipheriv("aes192", key, iv), createGunzip());
}

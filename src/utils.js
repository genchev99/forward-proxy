/**
 * Check if a string is a valid URL.
 * @param {string} url
 * @returns {boolean}
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get the size of a string in bytes.
 * @param {string} string
 * @param {BufferEncoding} encoding
 * @returns {number}
 */
function getSizeInBytes(string, encoding = "utf8") {
  return Buffer.byteLength(string, encoding);
}

module.exports = {
  isValidUrl,
  getSizeInBytes,
};

class RUID {
    static requestReference = {};

    static hash(str) {
        var hash = 0,
            i,
            chr;
        if (str.length === 0) return hash;
        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    /**
     * Generate UUID based on the  RFC4122
     * @link https://www.ietf.org/rfc/rfc4122.txt
     * @returns uuid {String}
     */
    static uuid() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
            (
                c ^
                (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
            ).toString(16)
        );
    }

    /**
     * Create a unique id for every url
     * @param {String} url
     * @returns {String} uuid
     */
    static reqUUID(url) {
        var newId;
        if (!RUID.requestReference[url]) {
            newId = RUID.hash(url);
            RUID.requestReference[url] = newId;
        } else {
            var index = 0;
            while (RUID.requestReference[url + index]) {
                index++;
            }
            newId = RUID.hash(url + index);
            RUID.requestReference[url + index] = newId;
        }
        return newId;
    }
}

export default RUID;

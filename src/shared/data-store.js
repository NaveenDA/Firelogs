class DataStorage {
    _storage = new WeakMap();

    put(element, key, obj) {
        if (!this._storage.has(element)) {
            this._storage.set(element, new Map());
        }
        this._storage.get(element).set(key, obj);
    }

    get(element, key) {
        return this._storage.get(element).get(key);
    }

    has(element, key) {
        return (
            this._storage.has(element) && this._storage.get(element).has(key)
        );
    }

    remove(element, key) {
        var ret = this._storage.get(element).delete(key);
        if (!this._storage.get(element).size === 0) {
            this._storage.delete(element);
        }
        return ret;
    }
}

export default DataStorage;

import localforage from "localforage";

localforage.config({
  driver: localforage.INDEXEDDB,
  name: "firelogs",
  version: 1.0,
  storeName: "firelogStore",
  description: "Database used for firelogs"
});

class Storage {
  /**
   * A method for save the data in the INDEXEDDB with key-pair model
   * @param  {string} key Key must be unique otherwise data got override
   * @param  {any} value If the value is available in the database,
   *  it will return otherwise it will return null
   * @return {any|null} Value from the database
   */
  static async get(key) {
    const value = await localforage.getItem(key);
    return value;
  }

  /**
   * A method is used to retrive the value from the database for the given key
   * @param  {string} key
   * @param  {any} value
   * @return  {} value
   */
  static async set(key, value) {
    // eslint-disable-next-line no-return-await
    return await localforage.setItem(key, value);
  }
}

export default Storage;

import localforage from "localforage";


const DB  = localforage.config({
    driver      : localforage.WEBSQL, 
    name        : 'firelogs',
    version     : 1.0,
    storeName   : 'firelogStore', 
    description : 'Database used for firelogs'
});



class Storage{

    static async get(key){
        const value = await localforage.getItem(key);
        return value;
    }

    static async set(key, value){
        return await localforage.setItem(key, value);
    }

}


export default Storage;
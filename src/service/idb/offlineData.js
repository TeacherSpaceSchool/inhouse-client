import { db } from '../idb'

export let initOfflineData = (db) => {
    try {
        db.deleteObjectStore('offlineData');
    }
    catch (error){
        console.error(error)
    }
    const store = db.createObjectStore('offlineData', {
        keyPath: 'id',
        autoIncrement: true,
    });
    store.createIndex('name', 'name', { unique: true });
}

export let getOfflineDataByName = async(name) => {
    if(db)
        return await db.getFromIndex('offlineData', 'name', name)
}

export let putOfflineDataByName = async(name, data) => {
    if(db!==undefined){
        let res = await db.getFromIndex('offlineData', 'name', name)
         if(!res){
            await db.add('offlineData', {
                name,
                data
            });
        } else {
            res.data = data
            await db.put('offlineData', res);
        }
    }
}

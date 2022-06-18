import { db } from '../idb'

export let initReceiveData = (db) => {
    try {
        db.deleteObjectStore('receiveData');
    }
    catch (error){
        console.error(error)
    }
    const store = db.createObjectStore('receiveData', {
        keyPath: 'id',
        autoIncrement: true,
    });
    store.createIndex('name', 'name', { unique: true });
}

export let getReceiveDataByName = async(name) => {
    if(db)
        return await db.getFromIndex('receiveData', 'name', name)
}

export let putReceiveDataByName = async(name, data, date) => {
    if(db!==undefined){
        let res = await db.getFromIndex('receiveData', 'name', name)
         if(!res){
            await db.add('receiveData', {
                name,
                data,
                date
            });
        } else {
            res.data = data
            res.date = date
            await db.put('receiveData', res);
        }
    }
}

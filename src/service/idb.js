import { openDB, deleteDB } from 'idb';
import { initReceiveData } from './idb/receiveData';
import { initOfflineData } from './idb/offlineData';
import { store } from '../redux/configureStore'

export let db = undefined
export let start = async () => {
    if (window.indexedDB) {
        /*if(store&&store.getState().user.profile.role&&store.getState().user.profile.role==='кассир') {
            db = await openDB('051c757c-5d7e-4b86-92fc-c3042ecdbcc8', 1, {
                upgrade(db) {
                    initReceiveData(db)
                    initOfflineData(db)
                },
            });
        }
        else {
            db = await openDB('051c757c-5d7e-4b86-92fc-c3042ecdbcc8', 1, {});
            if(db) {
                await deleteDB('051c757c-5d7e-4b86-92fc-c3042ecdbcc8', {});
            }
        }*/
    }
}




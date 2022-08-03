import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getStoreBalanceItems = async({item, skip, sort, store}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {item, skip, sort, store},
                query: gql`
                    query ($item: ID, $skip: Int, $sort: String, $store: ID) {
                        storeBalanceItems(item: $item, skip: $skip, sort: $sort, store: $store) {
                            _id
                            createdAt
                            item {_id name}
                            store {_id name}
                            amount
                            reservation
                            sale
                            free
                        }
                    }`,
            })
        return res.data.storeBalanceItems
    } catch(err){
        console.error(err)
    }
}

export const getStoreBalanceItemsCount = async({item, store}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {item, store},
                query: gql`
                    query ($item: ID, $store: ID) {
                        storeBalanceItemsCount(item: $item, store: $store)
                    }`,
            })
        return res.data.storeBalanceItemsCount
    } catch(err){
        console.error(err)
    }
}
import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getUnloadStoreBalanceItems = async({item, store}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {item, store},
            query: gql`
                    query ($item: ID, $store: ID) {
                        unloadStoreBalanceItems(item: $item, store: $store)
                    }`,
        })
        return res.data.unloadStoreBalanceItems
    } catch(err){
        console.error(err)
    }
}

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
                            item {_id name unit factory {name} category {name} priceUSD primeCostUSD priceKGS primeCostKGS}
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

export const repairBalanceItems = async()=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            mutation : gql`
                    mutation {
                        repairBalanceItems 
                    }`})
        return res.data.repairBalanceItems
    } catch(err){
        console.error(err)
    }
}
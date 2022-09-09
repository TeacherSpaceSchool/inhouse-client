import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getBalanceItems = async({item, skip, sort, warehouse, store}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {item, skip, sort, warehouse, store},
                query: gql`
                    query ($item: ID, $skip: Int, $sort: String, $warehouse: ID, $store: ID) {
                        balanceItems(item: $item, skip: $skip, sort: $sort, warehouse: $warehouse, store: $store) {
                            _id
                            createdAt
                            item {_id name}
                            warehouse {_id name}
                            store {_id name}
                            amount
                        }
                    }`,
            })
        return res.data.balanceItems
    } catch(err){
        console.error(err)
    }
}

export const getBalanceItemsCount = async({item, warehouse, store}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {item, warehouse, store},
                query: gql`
                    query ($item: ID, $warehouse: ID, $store: ID) {
                        balanceItemsCount(item: $item, warehouse: $warehouse, store: $store)
                    }`,
            })
        return res.data.balanceItemsCount
    } catch(err){
        console.error(err)
    }
}

export const getItemsForBalanceItem = async({search, warehouse}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, warehouse},
                query: gql`
                    query ($search: String, $warehouse: ID!) {
                        itemsForBalanceItem(search: $search, warehouse: $warehouse) {
                            _id
                            name
                        }
                    }`,
            })
        return res.data.itemsForBalanceItem
    } catch(err){
        console.error(err)
    }
}

export const addBalanceItem = async({item, warehouse, amount})=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {item, warehouse, amount},
            mutation : gql`
                    mutation ($item: ID!, $warehouse: ID!, $amount: Float!) {
                        addBalanceItem(item: $item, warehouse: $warehouse, amount: $amount) {
                            _id
                            createdAt
                            item {_id name}
                            warehouse {_id name}
                            store {_id name}
                            amount
                        }
                    }`})
        return res.data.addBalanceItem
    } catch(err){
        console.error(err)
    }
}

export const setBalanceItem = async({item, warehouse, amount, type, warehouse2, info})=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {item, warehouse, amount, type, warehouse2, info},
            mutation : gql`
                    mutation ($item: ID!, $warehouse: ID!, $amount: Float!, $type: String, $warehouse2: String, $info: String) {
                        setBalanceItem(item: $item, warehouse: $warehouse, amount: $amount, type: $type, warehouse2: $warehouse2, info: $info)
                    }`})
        return res.data.setBalanceItem
    } catch(err){
        console.error(err)
    }
}

export const getUnloadBalanceItems = async({item, warehouse, store}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {item, warehouse, store},
            query: gql`
                    query ($item: ID, $warehouse: ID, $store: ID) {
                        unloadBalanceItems(item: $item, warehouse: $warehouse, store: $store)
                    }`,
        })
        return res.data.unloadBalanceItems
    } catch(err){
        console.error(err)
    }
}

export const uploadBalanceItem = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($document: Upload!) {
                        uploadBalanceItem(document: $document) 
                    }`})
        return res.data.uploadBalanceItem
    } catch(err){
        console.error(err)
    }
}
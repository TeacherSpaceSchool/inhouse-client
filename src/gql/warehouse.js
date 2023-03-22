import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getUnloadWarehouses = async({search, store}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {search, store},
            query: gql`
                    query ($search: String, $store: ID) {
                        unloadWarehouses(search: $search, store: $store)
                    }`,
        })
        return res.data.unloadWarehouses
    } catch(err){
        console.error(err)
    }
}

export const uploadWarehouse = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($document: Upload!) {
                        uploadWarehouse(document: $document) 
                    }`})
        return res.data.uploadWarehouse
    } catch(err){
        console.error(err)
    }
}

export const getWarehouses = async({search, skip, store}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
                variables: {search, skip, store},
                query: gql`
                    query ($search: String, $skip: Int, $store: ID) {
                        warehouses(search: $search, skip: $skip, store: $store) {
                            _id
                            hide
                            createdAt
                            name
                            store {_id name}
                            amount
                        }
                    }`,
            })
        return res.data.warehouses
    } catch(err){
        console.error(err)
    }
}

export const getWarehousesCount = async({search, store}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, store},
                query: gql`
                    query ($search: String, $store: ID) {
                        warehousesCount(search: $search, store: $store)
                    }`,
            })
        return res.data.warehousesCount
    } catch(err){
        console.error(err)
    }
}

export const deleteWarehouse = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteWarehouse(_id: $_id)
                    }`})
        return res.data.deleteWarehouse
    } catch(err){
        console.error(err)
    }
}

export const setWarehouse = async(variables, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $name: String!) {
                        setWarehouse(_id: $_id, name: $name) 
                    }`})
        return res.data.setWarehouse
    } catch(err){
        console.error(err)
    }
}

export const addWarehouse = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($name: String!, $store: ID!, $hide: Boolean!) {
                        addWarehouse(name: $name, store: $store, hide: $hide)  {
                            _id
                            hide
                            createdAt
                            name
                            store {_id name}
                        }
                    }`})
        return res.data.addWarehouse
    } catch(err){
        console.error(err)
    }
}
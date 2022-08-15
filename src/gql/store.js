import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getUnloadStores = async({search}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {search},
            query: gql`
                    query ($search: String) {
                        unloadStores(search: $search)
                    }`,
        })
        return res.data.unloadStores
    } catch(err){
        console.error(err)
    }
}

export const uploadStore = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($document: Upload!) {
                        uploadStore(document: $document) 
                    }`})
        return res.data.uploadStore
    } catch(err){
        console.error(err)
    }
}

export const getStores = async({search, skip}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {search, skip},
            query: gql`
                    query ($search: String, $skip: Int) {
                        stores(search: $search, skip: $skip) {
                            _id
                            createdAt
                            name
                        }
                    }`,
        })
        return res.data.stores
    } catch(err){
        console.error(err)
    }
}

export const getStoresCount = async({search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query ($search: String) {
                        storesCount(search: $search)
                    }`,
            })
        return res.data.storesCount
    } catch(err){
        console.error(err)
    }
}

export const deleteStore = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteStore(_id: $_id)
                    }`})
        return res.data.deleteStore
    } catch(err){
        console.error(err)
    }
}

export const setStore = async(variables, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $name: String!) {
                        setStore(_id: $_id, name: $name) 
                    }`})
        return res.data.setStore
    } catch(err){
        console.error(err)
    }
}

export const addStore = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($name: String!) {
                        addStore(name: $name) {
                            _id
                            createdAt
                            name
                        }
                    }`})
        return res.data.addStore
    } catch(err){
        console.error(err)
    }
}
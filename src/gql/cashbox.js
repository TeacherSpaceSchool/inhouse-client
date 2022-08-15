import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getCashboxes = async({search, skip, store}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, skip, store},
                query: gql`
                    query ($skip: Int, $search: String, $store: ID) {
                        cashboxes(skip: $skip, search: $search, store: $store) {
                            _id
                            createdAt
                            name
                            balance {amount currency}
                            store {_id name}
                        }
                    }`,
            })
        return res.data.cashboxes
    } catch(err){
        console.error(err)
    }
}

export const getCashboxesCount = async({search, store}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, store},
                query: gql`
                    query ($search: String, $store: ID) {
                        cashboxesCount(search: $search, store: $store)
                    }`,
            })
        return res.data.cashboxesCount
    } catch(err){
        console.error(err)
    }
}

export const deleteCashbox = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteCashbox(_id: $_id)
                    }`})
        return res.data.deleteCashbox
    } catch(err){
        console.error(err)
    }
}

export const addCashbox = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($name: String!, $store: ID!) {
                        addCashbox(store: $store, name: $name) {
                            _id
                            createdAt
                            name
                            balance {amount currency}
                            store {_id name}
                        }
                    }`})
        return res.data.addCashbox
    } catch(err){
        console.error(err)
    }
}

export const setCashbox = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $name: String, $store: ID) {
                        setCashbox(_id: $_id, name: $name, store: $store)
                    }`})
        return res.data.setCashbox
    } catch(err){
        console.error(err)
    }
}

export const getUnloadCashboxes = async({search, store}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {search, store},
            query: gql`
                    query ($search: String, $store: ID) {
                        unloadCashboxes(search: $search, store: $store)
                    }`,
        })
        return res.data.unloadCashboxes
    } catch(err){
        console.error(err)
    }
}

export const uploadCashbox = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($document: Upload!) {
                        uploadCashbox(document: $document) 
                    }`})
        return res.data.uploadCashbox
    } catch(err){
        console.error(err)
    }
}
import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getCategorysCount = async({search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query ($search: String) {
                        categorysCount(search: $search)
                    }`,
            })
        return res.data.categorysCount
    } catch(err){
        console.error(err)
    }
}

export const getCategorys = async({skip, search, limit}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, search, limit},
                query: gql`
                    query ($search: String, $skip: Int) {
                        categorys(search: $search, skip: $skip) {
                            _id
                            createdAt
                            name
                        }
                    }`,
            })
        return res.data.categorys
    } catch(err){
        console.error(err)
    }
}

export const deleteCategory = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteCategory(_id: $_id)
                    }`})
        return res.data.deleteCategory
    } catch(err){
        console.error(err)
    }
}

export const addCategory = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($name: String!) {
                        addCategory(name: $name) {
                            _id
                            createdAt
                            name
                        }
                    }`})
        return res.data.addCategory
    } catch(err){
        console.error(err)
    }
}

export const setCategory = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $name: String!) {
                        setCategory(_id: $_id, name: $name)
                    }`})
        return res.data.setCategory
    } catch(err){
        console.error(err)
    }
}

export const uploadCategory = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($document: Upload!) {
                        uploadCategory(document: $document) 
                    }`})
        return res.data.uploadCategory
    } catch(err){
        console.error(err)
    }
}

export const getUnloadCategorys = async({search}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {search},
            query: gql`
                    query ($search: String) {
                        unloadCategorys(search: $search)
                    }`,
        })
        return res.data.unloadCategorys
    } catch(err){
        console.error(err)
    }
}
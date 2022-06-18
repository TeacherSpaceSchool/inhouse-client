import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getCategorysCount = async({ search, category, type}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, category, type},
                query: gql`
                    query ($search: String, $category: ID, $type: String) {
                        categorysCount(search: $search, category: $category, type: $type)
                    }`,
            })
        return res.data.categorysCount
    } catch(err){
        console.error(err)
    }
}

export const getCategorys = async({skip, search, category, type}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, search, category, type},
                query: gql`
                    query ($skip: Int, $search: String, $category: ID, $type: String) {
                        categorys(skip: $skip, search: $search, category: $category, type: $type) {
                            _id
                            createdAt
                            type
                            name
                            category {_id name}
                            del
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
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteCategory(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addCategory = async(element)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($name: String!, $category: ID, $type: String!) {
                        addCategory(name: $name, category: $category, type: $type) {
                            _id
                            createdAt
                            type
                            name
                            category {_id name}
                            del
                        }
                    }`})
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const setCategory = async(element)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $name: String) {
                        setCategory(_id: $_id, name: $name)
                    }`})
    } catch(err){
        console.error(err)
    }
}
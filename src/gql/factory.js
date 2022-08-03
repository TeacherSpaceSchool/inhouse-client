import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getFactorys = async({search, skip}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
                variables: {search, skip},
                query: gql`
                    query ($search: String, $skip: Int) {
                        factorys(search: $search, skip: $skip) {
                            _id
                            createdAt
                            name
                        }
                    }`,
            })
        return res.data.factorys
    } catch(err){
        console.error(err)
    }
}

export const getFactorysCount = async({search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query ($search: String) {
                        factorysCount(search: $search)
                    }`,
            })
        return res.data.factorysCount
    } catch(err){
        console.error(err)
    }
}

export const deleteFactory = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteFactory(_id: $_id)
                    }`})
        return res.data.deleteFactory
    } catch(err){
        console.error(err)
    }
}

export const setFactory = async(variables, client)=>{
    try{
        client = client? client : getClientGql()
        let res =  await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $name: String!) {
                        setFactory(_id: $_id, name: $name) 
                    }`})
        return res.data.setFactory
    } catch(err){
        console.error(err)
    }
}

export const addFactory = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($name: String!) {
                        addFactory(name: $name)  {
                            _id
                            createdAt
                            name
                        }
                    }`})
        return res.data.addFactory
    } catch(err){
        console.error(err)
    }
}
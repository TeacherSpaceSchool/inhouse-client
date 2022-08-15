import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getCharacteristicsCount = async({search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query ($search: String) {
                        characteristicsCount(search: $search)
                    }`,
            })
        return res.data.characteristicsCount
    } catch(err){
        console.error(err)
    }
}

export const getCharacteristics = async({skip, search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, search},
                query: gql`
                    query ($search: String, $skip: Int) {
                        characteristics(search: $search, skip: $skip) {
                            _id
                            createdAt
                            name
                        }
                    }`,
            })
        return res.data.characteristics
    } catch(err){
        console.error(err)
    }
}

export const deleteCharacteristic = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteCharacteristic(_id: $_id)
                    }`})
        return res.data.deleteCharacteristic
    } catch(err){
        console.error(err)
    }
}

export const addCharacteristic = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($name: String!) {
                        addCharacteristic(name: $name) {
                            _id
                            createdAt
                            name
                        }
                    }`})
        return res.data.addCharacteristic
    } catch(err){
        console.error(err)
    }
}

export const setCharacteristic = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $name: String!) {
                        setCharacteristic(_id: $_id, name: $name)
                    }`})
        return res.data.setCharacteristic
    } catch(err){
        console.error(err)
    }
}

export const uploadCharacteristic = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($document: Upload!) {
                        uploadCharacteristic(document: $document) 
                    }`})
        return res.data.uploadCharacteristic
    } catch(err){
        console.error(err)
    }
}

export const getUnloadCharacteristics = async({search}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {search},
            query: gql`
                    query ($search: String) {
                        unloadCharacteristics(search: $search)
                    }`,
        })
        return res.data.unloadCharacteristics
    } catch(err){
        console.error(err)
    }
}
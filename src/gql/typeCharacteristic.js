import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getTypeCharacteristicsCount = async({search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query ($search: String) {
                        typeCharacteristicsCount(search: $search)
                    }`,
            })
        return res.data.typeCharacteristicsCount
    } catch(err){
        console.error(err)
    }
}

export const getTypeCharacteristics = async({skip, search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, search},
                query: gql`
                    query ($search: String, $skip: Int) {
                        typeCharacteristics(search: $search, skip: $skip) {
                            _id
                            createdAt
                            name
                        }
                    }`,
            })
        return res.data.typeCharacteristics
    } catch(err){
        console.error(err)
    }
}

export const deleteTypeCharacteristic = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteTypeCharacteristic(_id: $_id)
                    }`})
        return res.data.deleteTypeCharacteristic
    } catch(err){
        console.error(err)
    }
}

export const addTypeCharacteristic = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($name: String!) {
                        addTypeCharacteristic(name: $name){
                            _id
                            createdAt
                            name
                        }
                    }`})
        return res.data.addTypeCharacteristic
    } catch(err){
        console.error(err)
    }
}

export const setTypeCharacteristic = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $name: String!) {
                        setTypeCharacteristic(_id: $_id, name: $name)
                    }`})
        return res.data.setTypeCharacteristic
    } catch(err){
        console.error(err)
    }
}
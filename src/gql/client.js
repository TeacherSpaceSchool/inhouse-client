import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getClient = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        client(_id: $_id) {
                            _id
                            createdAt
                            name
                            geo
                            emails
                            phones
                            address
                            address1
                            info
                            work
                            passport
                            inn
                            level
                            birthday
                            user {name role _id}
                        }
                    }`,
            })
        return res.data.client
    } catch(err){
        console.error(err)
    }
}

export const getClients = async({search, skip, level, limit}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client
            .query({
                variables: {search, skip, level, limit},
                query: gql`
                    query ($search: String, $skip: Int, $level: String, $limit: Int) {
                        clients(search: $search, skip: $skip, level: $level, limit: $limit) {
                            _id
                            createdAt
                            name
                            inn
                            geo
                            address
                            address1
                            level
                        }
                    }`,
            })
        return res.data.clients
    } catch(err){
        console.error(err)
    }
}

export const getClientsCount = async({search, level}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, level},
                query: gql`
                    query ($search: String, $level: String) {
                        clientsCount(search: $search, level: $level)
                    }`,
            })
        return res.data.clientsCount
    } catch(err){
        console.error(err)
    }
}

export const deleteClient = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteClient(_id: $_id)
                    }`})
        return res.data.deleteClient
    } catch(err){
        console.error(err)
    }
}

export const setClient = async(variables, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $name: String, $geo: [Float], $emails: [String], $phones: [String], $address: String, $address1: String, $info: String, $work: String, $passport: String, $inn: String, $level: String, $birthday: Date) {
                        setClient(_id: $_id, name: $name, geo: $geo, emails: $emails, phones: $phones, address: $address, address1: $address1, info: $info, work: $work, passport: $passport, inn: $inn, level: $level, birthday: $birthday) 
                    }`})
        return res.data.setClient
    } catch(err){
        console.error(err)
    }
}

export const addClient = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($name: String!, $emails: [String]!, $geo: [Float], $phones: [String]!, $address: String!, $address1: String!, $info: String!, $work: String!, $passport: String!, $inn: String!, $level: String!, $birthday: Date!) {
                        addClient(name: $name, emails: $emails, geo: $geo, phones: $phones, address: $address, address1: $address1, info: $info, work: $work, passport: $passport, inn: $inn, level: $level, birthday: $birthday) 
                    }`})
        return res.data.addClient
    } catch(err){
        console.error(err)
    }
}

export const getUnloadClients = async({search, level}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {search, level},
            query: gql`
                    query ($search: String, $level: String) {
                        unloadClients(search: $search, level: $level)
                    }`,
        })
        return res.data.unloadClients
    } catch(err){
        console.error(err)
    }
}

export const uploadClient = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($document: Upload!) {
                        uploadClient(document: $document) 
                    }`})
        return res.data.uploadClient
    } catch(err){
        console.error(err)
    }
}
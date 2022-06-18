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
                            legalObject {_id name}
                            phone
                            address
                            email
                            inn 
                            del
                            info
                        }
                    }`,
            })
        return res.data.client
    } catch(err){
        console.error(err)
    }
}

export const getClients = async({search, skip, legalObject}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client
            .query({
                variables: {search, skip, legalObject},
                query: gql`
                    query ($search: String, $skip: Int, $legalObject: ID) {
                        clients(search: $search, skip: $skip, legalObject: $legalObject) {
                            _id
                            createdAt
                            name
                            legalObject {_id name}
                            phone
                            address
                            email
                            inn 
                            del
                        }
                    }`,
            })
        return res.data.clients
    } catch(err){
        console.error(err)
    }
}

export const getClientsCount = async({search, legalObject}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, legalObject},
                query: gql`
                    query ($search: String, $legalObject: ID) {
                        clientsCount(search: $search, legalObject: $legalObject)
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
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteClient(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const setClient = async(element, client)=>{
    try{
        client = client? client : getClientGql()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $phone: [String], $name: String, $inn: String, $email: [String], $address: String, $info: String) {
                        setClient(_id: $_id, phone: $phone, inn: $inn, name: $name, email: $email, address: $address, info: $info) 
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addClient = async(element)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($legalObject: ID!, $phone: [String]!, $name: String!, $inn: String!, $email: [String]!, $address: String!, $info: String!) {
                        addClient(legalObject: $legalObject, phone: $phone, name: $name, inn: $inn, email: $email, address: $address, info: $info) {
                            _id
                            createdAt
                            name
                            legalObject {_id name}
                            phone
                            address
                            email
                            inn 
                            del
                            info
                        }
                    }`})
        return res.data.addClient
    } catch(err){
        console.error(err)
    }
}
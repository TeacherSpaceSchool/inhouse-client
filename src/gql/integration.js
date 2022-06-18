import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getLegalObjectsForIntegrations = async({search}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client
            .query({
                variables: {search},
                query: gql`
                    query ($search: String) {
                        legalObjectsForIntegrations(search: $search) {
                            _id
                            name
                        }
                    }`,
            })
        return res.data.legalObjectsForIntegrations
    } catch(err){
        console.error(err)
    }
}

export const getIntegrations = async({skip, search, legalObject}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client
            .query({
                variables: {skip, search, legalObject},
                query: gql`
                    query ($skip: Int, $search: String, $legalObject: ID) {
                        integrations(skip: $skip, search: $search, legalObject: $legalObject) {
                            _id
                            createdAt
                            legalObject {createdAt name inn address phone status _id del}
                            IP
                            password
                        }
                    }`,
            })
        return res.data.integrations
    } catch(err){
        console.error(err)
    }
}

export const getIntegrationsCount = async({search, legalObject}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, legalObject},
                query: gql`
                    query($search: String, $legalObject: ID) {
                        integrationsCount(search: $search, legalObject: $legalObject) 
                    }`,
            })
        return res.data.integrationsCount
    } catch(err){
        console.error(err)
    }
}

export const getIntegration = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id: _id},
                query: gql`
                    query ($_id: ID!) {
                        integration(_id: $_id) {
                            _id
                            createdAt
                            legalObject {_id name}
                            IP
                            password
                        }
                    }`,
            })
        return res.data.integration
    } catch(err){
        console.error(err)
    }
}

export const deleteIntegration = async(_id)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteIntegration(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addIntegration = async({legalObject, IP, password})=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {legalObject, IP, password},
            mutation : gql`
                    mutation ($legalObject: ID!, $IP: String!, $password: String!) {
                        addIntegration(legalObject: $legalObject, IP: $IP, password: $password)
                    }`})
        return res.data.addIntegration
    } catch(err){
        console.error(err)
    }
}

export const setIntegration = async({_id, IP, password})=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id, IP, password},
            mutation : gql`
                    mutation ($_id: ID!, $IP: String, $password: String) {
                        setIntegration(_id: $_id, IP: $IP, password: $password)
                    }`})
    } catch(err){
        console.error(err)
    }
}
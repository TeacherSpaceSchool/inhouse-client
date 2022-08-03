import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getCpa = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        cpa(_id: $_id) {
                            _id
                            createdAt
                            name
                            emails
                            phones
                            percent
                            info
                        }
                    }`,
            })
        return res.data.cpa
    } catch(err){
        console.error(err)
    }
}

export const getCpas = async({search, skip, limit}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
                variables: {search, skip, limit},
                query: gql`
                    query ($search: String, $skip: Int, $limit: Int) {
                        cpas(search: $search, skip: $skip, limit: $limit) {
                            _id
                            createdAt
                            name
                            percent
                        }
                    }`,
            })
        return res.data.cpas
    } catch(err){
        console.error(err)
    }
}

export const getCpasCount = async({search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query ($search: String) {
                        cpasCount(search: $search)
                    }`,
            })
        return res.data.cpasCount
    } catch(err){
        console.error(err)
    }
}

export const deleteCpa = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteCpa(_id: $_id)
                    }`})
        return res.data.deleteCpa
    } catch(err){
        console.error(err)
    }
}

export const setCpa = async(variables, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $name: String, $emails: [String], $phones: [String], $info: String, $percent: Float) {
                        setCpa(_id: $_id, name: $name, emails: $emails, phones: $phones, info: $info, percent: $percent) 
                    }`})
        return res.data.setCpa
    } catch(err){
        console.error(err)
    }
}

export const addCpa = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($name: String!, $emails: [String]!, $phones: [String]!, $info: String!, $percent: Float!) {
                        addCpa(name: $name, emails: $emails, phones: $phones, info: $info, percent: $percent) 
                    }`})
        return res.data.addCpa
    } catch(err){
        console.error(err)
    }
}
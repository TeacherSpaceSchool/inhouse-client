import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getMoneyRecipientsCount = async({search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query ($search: String) {
                        moneyRecipientsCount(search: $search)
                    }`,
            })
        return res.data.moneyRecipientsCount
    } catch(err){
        console.error(err)
    }
}

export const getMoneyRecipients = async({skip, search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, search},
                query: gql`
                    query ($search: String, $skip: Int) {
                        moneyRecipients(search: $search, skip: $skip) {
                            _id
                            createdAt
                            name
                        }
                    }`,
            })
        return res.data.moneyRecipients
    } catch(err){
        console.error(err)
    }
}

export const deleteMoneyRecipient = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteMoneyRecipient(_id: $_id)
                    }`})
        return res.data.deleteMoneyRecipient
    } catch(err){
        console.error(err)
    }
}

export const addMoneyRecipient = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($name: String!) {
                        addMoneyRecipient(name: $name) {
                            _id
                            createdAt
                            name
                        }
                    }`})
        return res.data.addMoneyRecipient
    } catch(err){
        console.error(err)
    }
}

export const setMoneyRecipient = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $name: String!) {
                        setMoneyRecipient(_id: $_id, name: $name)
                    }`})
        return res.data.setMoneyRecipient
    } catch(err){
        console.error(err)
    }
}
import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getPromotionsCount = async({search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query ($search: String) {
                        promotionsCount(search: $search)
                    }`,
            })
        return res.data.promotionsCount
    } catch(err){
        console.error(err)
    }
}

export const getPromotions = async({skip, search, limit}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, search, limit},
                query: gql`
                    query ($search: String, $skip: Int) {
                        promotions(search: $search, skip: $skip) {
                            _id
                            createdAt
                            name
                        }
                    }`,
            })
        return res.data.promotions
    } catch(err){
        console.error(err)
    }
}

export const deletePromotion = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deletePromotion(_id: $_id)
                    }`})
        return res.data.deletePromotion
    } catch(err){
        console.error(err)
    }
}

export const addPromotion = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($name: String!) {
                        addPromotion(name: $name) {
                            _id
                            createdAt
                            name
                        }
                    }`})
        return res.data.addPromotion
    } catch(err){
        console.error(err)
    }
}

export const setPromotion = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $name: String!) {
                        setPromotion(_id: $_id, name: $name)
                    }`})
        return res.data.setPromotion
    } catch(err){
        console.error(err)
    }
}

export const uploadPromotion = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($document: Upload!) {
                        uploadPromotion(document: $document) 
                    }`})
        return res.data.uploadPromotion
    } catch(err){
        console.error(err)
    }
}

export const getUnloadPromotions = async({search}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {search},
            query: gql`
                    query ($search: String) {
                        unloadPromotions(search: $search)
                    }`,
        })
        return res.data.unloadPromotions
    } catch(err){
        console.error(err)
    }
}
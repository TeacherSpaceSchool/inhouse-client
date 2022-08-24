import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getMoneyArticleByName = async(name, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {name},
                query: gql`
                    query ($name: String) {
                        moneyArticleByName(name: $name) {
                            _id
                            createdAt
                            name
                        }
                    }`,
            })
        return res.data.moneyArticleByName
    } catch(err){
        console.error(err)
    }
}

export const getMoneyArticlesCount = async({search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query ($search: String) {
                        moneyArticlesCount(search: $search)
                    }`,
            })
        return res.data.moneyArticlesCount
    } catch(err){
        console.error(err)
    }
}

export const getMoneyArticles = async({skip, search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, search},
                query: gql`
                    query ($search: String, $skip: Int) {
                        moneyArticles(search: $search, skip: $skip) {
                            _id
                            createdAt
                            name
                        }
                    }`,
            })
        return res.data.moneyArticles
    } catch(err){
        console.error(err)
    }
}

export const deleteMoneyArticle = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteMoneyArticle(_id: $_id)
                    }`})
        return res.data.deleteMoneyArticle
    } catch(err){
        console.error(err)
    }
}

export const addMoneyArticle = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($name: String!) {
                        addMoneyArticle(name: $name) {
                            _id
                            createdAt
                            name
                        }
                    }`})
        return res.data.addMoneyArticle
    } catch(err){
        console.error(err)
    }
}

export const setMoneyArticle = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $name: String!) {
                        setMoneyArticle(_id: $_id, name: $name)
                    }`})
        return res.data.setMoneyArticle
    } catch(err){
        console.error(err)
    }
}

export const uploadMoneyArticle = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($document: Upload!) {
                        uploadMoneyArticle(document: $document) 
                    }`})
        return res.data.uploadMoneyArticle
    } catch(err){
        console.error(err)
    }
}

export const getUnloadMoneyArticles = async({search}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {search},
            query: gql`
                    query ($search: String) {
                        unloadMoneyArticles(search: $search)
                    }`,
        })
        return res.data.unloadMoneyArticles
    } catch(err){
        console.error(err)
    }
}
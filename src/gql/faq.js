import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getFaqs = async({search, skip}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, skip},
                query: gql`
                    query ($search: String, $skip: Int) {
                        faqs(search: $search, skip: $skip) {
                            _id
                            url
                            name
                            video
                            text
                            createdAt
                        }
                    }`,
            })
        return res.data.faqs
    } catch(err){
        console.error(err)
    }
}

export const getFaqsCount = async({search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query ($search: String) {
                        faqsCount(search: $search) 
                    }`,
            })
        return res.data.faqsCount
    } catch(err){
        console.error(err)
    }
}

export const deleteFaq = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteFaq(_id: $_id)
                    }`})
        return res.data.deleteFaq
    } catch(err){
        console.error(err)
    }
}

export const addFaq = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($file: Upload, $name: String!, $text: String!, $video: String) {
                        addFaq(file: $file, name: $name, text: $text, video: $video) {
                            _id
                            url
                            name
                            video
                            createdAt
                            text
                        }
                    }`})
        return res.data.addFaq
    } catch(err){
        console.error(err)
    }
}

export const setFaq = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $file: Upload, $name: String, $text: String, $video: String, $delFile: Boolean) {
                        setFaq(_id: $_id, file: $file, name: $name, video: $video, text: $text, delFile: $delFile) {
                            _id
                            url
                        }
                    }`})
        return res.data.setFaq
    } catch(err){
        console.error(err)
    }
}
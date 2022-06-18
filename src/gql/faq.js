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
                            createdAt
                            roles
                        }
                    }`,
            })
        return res.data.faqs
    } catch(err){
        console.error(err)
    }
}

export const deleteFaq = async(_id)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteFaq(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addFaq = async(element)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($file: Upload, $name: String!, $video: String, $roles: [String]!) {
                        addFaq(file: $file, name: $name, video: $video, roles: $roles) {
                            _id
                            url
                            name
                            video
                            createdAt
                            roles
                        }
                    }`})
        return res.data.addFaq
    } catch(err){
        console.error(err)
    }
}

export const setFaq = async(element)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $file: Upload, $name: String, $video: String, $roles: [String]) {
                        setFaq(_id: $_id, file: $file, name: $name, video: $video, roles: $roles)
                    }`})
    } catch(err){
        console.error(err)
    }
}
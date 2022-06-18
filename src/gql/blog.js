import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getBlogs = async({search, skip}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, skip},
                query: gql`
                    query ($skip: Int, $search: String) {
                        blogs(skip: $skip, search: $search) {
                            _id
                            text
                            name
                            createdAt
                          }
                    }`,
            })
        return res.data.blogs
    } catch(err){
        console.error(err)
    }
}

export const deleteBlog = async(_id)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteBlog(_id: $_id) 
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addBlog = async(element)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($text: String!, $name: String!) {
                        addBlog(text: $text, name: $name) {
                            _id
                            text
                            name
                            createdAt
                        }
                    }`})
        return res.data.addBlog
    } catch(err){
        console.error(err)
    }
}

export const setBlog = async(element)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $text: String, $name: String) {
                        setBlog(_id: $_id, text: $text, name: $name) 
                    }`})
    } catch(err){
        console.error(err)
    }
}
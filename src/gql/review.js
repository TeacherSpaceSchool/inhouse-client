import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getReviews = async(element, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($skip: Int, $filter: String) {
                        reviews(skip: $skip, filter: $filter) {
                            _id
                            createdAt
                            legalObject {_id name}
                            taken
                            type
                            text                            
                            who {_id name role}
                        }
                    }`,
            })
        return res.data.reviews
    } catch(err){
        console.error(err)
    }
}

export const getReviewsCount = async(element, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($filter: String) {
                        reviewsCount(filter: $filter)
                    }`,
            })
        return res.data.reviewsCount
    } catch(err){
        console.error(err)
    }
}

export const addReview = async(element)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($text: String!, $type: String!) {
                        addReview(text: $text, type: $type) {
                            _id
                            createdAt
                            legalObject {_id name}
                            taken
                            type
                            text
                        }
                    }`})
        return res.data.addReview
    } catch(err){
        console.error(err)
    }
}

export const acceptReview = async(element)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!) {
                        acceptReview(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const deleteReview = async(_id)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteReview(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}
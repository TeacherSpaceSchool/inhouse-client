import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getFiles = async(filter, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {filter},
                query: gql`
                    query ($filter: String!) {
                        files(filter: $filter) {
                            name
                            url
                            size
                            createdAt
                            active
                            owner
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const clearAllDeactiveFiles = async()=>{
    try{
        const client = getClientGql()
        await client.mutate({
            mutation : gql`
                    mutation {
                        clearAllDeactiveFiles
                    }`})
    } catch(err){
        console.error(err)
    }
}

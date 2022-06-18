import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getSubscribers = async(client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                query: gql`
                    query {
                        subscribers {
                            _id
                            createdAt
                            user
                            number
                            status
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const deleteSubscriber = async(ids)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id: ids},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        deleteSubscriber(_id: $_id)
                    }`})
        return await getSubscribers()
    } catch(err){
        console.error(err)
    }
}
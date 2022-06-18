import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getHistory = async({where}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {where},
                query: gql`
                    query ($where: String!) {
                        history(where: $where) {
                            _id
                            who {_id name role}
                            where
                            what
                            createdAt
                          }
                    }`,
            })
        return res.data.history
    } catch(err){
        console.error(err)
    }
}

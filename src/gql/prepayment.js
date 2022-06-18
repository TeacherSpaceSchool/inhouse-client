import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getPrepayment = async(_id, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query($_id: ID!) {
                        prepayment(_id: $_id) {
                            _id
                            createdAt
                            legalObject {_id name}
                            client {_id name}
                            prepayment
                            used
                            balance
                        }
                    }`,
            })
        return res.data.prepayment
    } catch(err){
        console.error(err)
    }
}

export const getPrepayments = async({skip, search, legalObject}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, search, legalObject},
                query: gql`
                    query($search: String, $legalObject: ID, $skip: Int) {
                        prepayments(search: $search, legalObject: $legalObject, skip: $skip) {
                            _id
                            createdAt
                            legalObject {_id name}
                            client {_id name}
                            prepayment
                            used
                            balance
                        }
                    }`,
            })
        return res.data.prepayments
    } catch(err){
        console.error(err)
    }
}

export const getPrepaymentsCount = async({search, legalObject}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, legalObject},
                query: gql`
                    query($search: String, $legalObject: ID) {
                        prepaymentsCount(search: $search, legalObject: $legalObject)
                    }`,
            })
        return res.data.prepaymentsCount
    } catch(err){
        console.error(err)
    }
}
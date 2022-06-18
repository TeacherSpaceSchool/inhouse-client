import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getConsignation = async(_id, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query($_id: ID!) {
                        consignation(_id: $_id) {
                            _id
                            createdAt
                            legalObject {_id name}
                            client {_id name}
                            consignation
                            paid
                            debt
                        }
                    }`,
            })
        return res.data.consignation
    } catch(err){
        console.error(err)
    }
}

export const getConsignations = async({skip, search, legalObject}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, search, legalObject},
                query: gql`
                    query($search: String, $legalObject: ID, $skip: Int) {
                        consignations(search: $search, legalObject: $legalObject, skip: $skip) {
                            _id
                            createdAt
                            legalObject {_id name}
                            client {_id name}
                            consignation
                            paid
                            debt
                        }
                    }`,
            })
        return res.data.consignations
    } catch(err){
        console.error(err)
    }
}

export const getConsignationsCount = async({search, legalObject}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, legalObject},
                query: gql`
                    query($search: String, $legalObject: ID) {
                        consignationsCount(search: $search, legalObject: $legalObject)
                    }`,
            })
        return res.data.consignationsCount
    } catch(err){
        console.error(err)
    }
}
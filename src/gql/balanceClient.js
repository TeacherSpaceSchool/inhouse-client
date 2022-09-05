import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getUnloadBalanceClients = async({search, debtor, client}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
            variables: {search, debtor, client},
            query: gql`
                    query ($search: String, $debtor: String, $client: ID) {
                        unloadBalanceClients(search: $search, debtor: $debtor, client: $client)
                    }`,
        })
        return res.data.unloadBalanceClients
    } catch(err){
        console.error(err)
    }
}

export const getBalanceClients = async({search, skip, debtor, client}, clientGql)=>{
    try{
        clientGql = clientGql? clientGql : getClientGql()
        let res = await clientGql
            .query({
                variables: {search, skip, debtor, client},
                query: gql`
                    query ($search: String, $skip: Int, $debtor: String, $client: ID) {
                        balanceClients(skip: $skip, search: $search, debtor: $debtor, client: $client) {
                            _id
                            createdAt
                            client {_id name}
                            balance
                          }
                    }`,
            })
        return res.data.balanceClients
    } catch(err){
        console.error(err)
    }
}

export const getBalanceClientsCount = async({search, debtor, client}, clientGql)=>{
    try{
        clientGql = clientGql? clientGql : getClientGql()
        let res = await clientGql
            .query({
                variables: {search, debtor, client},
                query: gql`
                    query ($search: String, $debtor: String, $client: ID) {
                        balanceClientsCount(search: $search, debtor: $debtor, client: $client) 
                    }`,
            })
        return res.data.balanceClientsCount
    } catch(err){
        console.error(err)
    }
}
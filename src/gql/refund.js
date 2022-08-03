import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getRefund = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        refund(_id: $_id) {
                            _id
                            createdAt
                            paymentConfirmation
                            number
                            manager {_id name}
                            client {_id name}
                            itemsRefund {_id name item count price amount characteristics status unit images}
                            amount
                            store {_id name}
                            comment
                            discount
                            currency
                            status
                            sale {_id number}
                        }
                    }`,
            })
        return res.data.refund
    } catch(err){
        console.error(err)
    }
}

export const getRefunds = async({skip, limit, manager, client, store, date, status}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
                variables: {skip, limit, manager, client, store, date, status},
                query: gql`
                    query ($skip: Int, $limit: Int, $manager: ID, $client: ID, $store: ID, $date: Date, $status: String) {
                        refunds(skip: $skip, limit: $limit, manager: $manager, client: $client, store: $store, date: $date, status: $status) {
                            _id
                            createdAt
                            number
                            manager {_id name}
                            client {_id name}
                            amount
                            store {_id name}
                            comment
                            currency
                            status
                            sale {_id number}
                        }
                    }`,
            })
        return res.data.refunds
    } catch(err){
        console.error(err)
    }
}

export const getRefundsCount = async({manager, client, store, date, status}, clientGql)=>{
    try{
        clientGql = clientGql? clientGql : getClientGql()
        let res = await clientGql
            .query({
                variables: {manager, client, store, date, status},
                query: gql`
                    query ($manager: ID, $client: ID, $store: ID, $date: Date, $status: String) {
                        refundsCount(manager: $manager, client: $client, store: $store, date: $date, status: $status)
                    }`,
            })
        return res.data.refundsCount
    } catch(err){
        console.error(err)
    }
}

export const setRefund = async(variables, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $comment: String, $status: String) {
                        setRefund(_id: $_id, comment: $comment, status: $status) 
                    }`})
        return res.data.setRefund
    } catch(err){
        console.error(err)
    }
}

export const addRefund = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($client: ID!, $discount: Float!, $itemsRefund: [ItemFromListInput]!, $amount: Float!, $comment: String!, $currency: String!, $sale: ID!) {
                        addRefund(client: $client, discount: $discount, itemsRefund: $itemsRefund, amount: $amount, comment: $comment, currency: $currency, sale: $sale) 
                    }`})
        return res.data.addRefund
    } catch(err){
        console.error(err)
    }
}
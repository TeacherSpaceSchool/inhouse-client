import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getAttachmentRefund = async(_id, clientGql)=>{
    try{
        clientGql = clientGql? clientGql : getClientGql()
        let res = await clientGql
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        getAttachmentRefund(_id: $_id)
                    }`,
            })
        return res.data.getAttachmentRefund
    } catch(err){
        console.error(err)
    }
}

export const getUnloadRefunds = async({search, manager, item, client, store, dateStart, dateEnd, status, _id}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
            variables: {search, manager, client, item, store, dateStart, dateEnd, status, _id},
            query: gql`
                    query ($search: String, $manager: ID, $item: ID, $client: ID, $store: ID, $dateStart: Date, $dateEnd: Date, $status: String, $_id: ID) {
                        unloadRefunds(search: $search, manager: $manager, item: $item, client: $client, store: $store, dateStart: $dateStart, dateEnd: $dateEnd, status: $status, _id: $_id)
                    }`,
        })
        return res.data.unloadRefunds
    } catch(err){
        console.error(err)
    }
}

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
                            paymentAmount
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
                            sale {_id number order}
                        }
                    }`,
            })
        return res.data.refund
    } catch(err){
        console.error(err)
    }
}

export const getRefunds = async({search, skip, limit, item, manager, client, store, dateStart, dateEnd, status}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
                variables: {search, skip, limit, item, manager, client, store, dateStart, dateEnd, status},
                query: gql`
                    query ($search: String, $skip: Int, $item: ID, $limit: Int, $manager: ID, $client: ID, $store: ID, $dateStart: Date, $dateEnd: Date, $status: String) {
                        refunds(search: $search, skip: $skip, item: $item, limit: $limit, manager: $manager, client: $client, store: $store, dateStart: $dateStart, dateEnd: $dateEnd, status: $status) {
                            _id
                            createdAt
                            paymentAmount
                            number
                            manager {_id name}
                            client {_id name}
                            amount
                            store {_id name}
                            comment
                            currency
                            status
                            sale {_id number order}
                        }
                    }`,
            })
        return res.data.refunds
    } catch(err){
        console.error(err)
    }
}

export const getRefundsCount = async({search, manager, client, item, store, dateStart, dateEnd, status}, clientGql)=>{
    try{
        clientGql = clientGql? clientGql : getClientGql()
        let res = await clientGql
            .query({
                variables: {search, manager, client, item, store, dateStart, dateEnd, status},
                query: gql`
                    query ($search: String, $manager: ID, $item: ID, $client: ID, $store: ID, $dateStart: Date, $dateEnd: Date, $status: String) {
                        refundsCount(search: $search, item: $item, manager: $manager, client: $client, store: $store, dateStart: $dateStart, dateEnd: $dateEnd, status: $status)
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
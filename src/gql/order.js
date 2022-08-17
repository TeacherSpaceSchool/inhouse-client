import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getUnloadOrders = async({search, manager, client, store, date, status, _id}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
            variables: {search, manager, client, store, date, status, _id},
            query: gql`
                    query ($search: String, $manager: ID, $client: ID, $store: ID, $date: Date, $status: String, $_id: ID) {
                        unloadOrders(search: $search, manager: $manager, client: $client, store: $store, date: $date, status: $status, _id: $_id)
                    }`,
        })
        return res.data.unloadOrders
    } catch(err){
        console.error(err)
    }
}

export const getOrder = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        order(_id: $_id) {
                            _id
                            createdAt
                            number
                            manager {_id name}
                            client {_id name}
                            itemsOrder {_id name item count price amount characteristics status unit}
                            store {_id name}
                            amount
                            paid
                            typePayment
                            paymentConfirmation
                            comment
                            currency
                            status
                            sale {_id number}
                        }
                    }`,
            })
        return res.data.order
    } catch(err){
        console.error(err)
    }
}

export const prepareAcceptOrder = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        prepareAcceptOrder(_id: $_id) 
                    }`,
            })
        return res.data.prepareAcceptOrder
    } catch(err){
        console.error(err)
    }
}

export const getOrders = async({search, skip, limit, manager, client, store, date, status, items}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
                variables: {search, skip, limit, manager, client, store, date, status, items},
                query: gql`
                    query ($search: String, $skip: Int, $limit: Int, $manager: ID, $client: ID, $store: ID, $date: Date, $status: String, $items: Boolean) {
                        orders(search: $search, skip: $skip, limit: $limit, manager: $manager, client: $client, store: $store, date: $date, status: $status, items: $items) {
                            _id
                            createdAt
                            number
                            manager {_id name}
                            client {_id name}
                            store {_id name}
                            amount
                            paid
                            typePayment
                            comment
                            paymentConfirmation
                            currency
                            status
                            itemsOrder {_id name item count price amount characteristics status unit}
                            sale {_id number}
                        }
                    }`,
            })
        return res.data.orders
    } catch(err){
        console.error(err)
    }
}

export const getOrdersCount = async({search, manager, client, store, date, status}, clientGql)=>{
    try{
        clientGql = clientGql? clientGql : getClientGql()
        let res = await clientGql
            .query({
                variables: {search, manager, client, store, date, status},
                query: gql`
                    query ($search: String, $manager: ID, $client: ID, $store: ID, $date: Date, $status: String) {
                        ordersCount(search: $search, manager: $manager, client: $client, store: $store, date: $date, status: $status)
                    }`,
            })
        return res.data.ordersCount
    } catch(err){
        console.error(err)
    }
}

export const setOrder = async(variables, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $itemsOrder: [ItemFromListInput], $amount: Float, $paid: Float, $comment: String, $status: String) {
                        setOrder(_id: $_id, itemsOrder: $itemsOrder, amount: $amount, paid: $paid, comment: $comment, status: $status) 
                    }`})
        return res.data.setOrder
    } catch(err){
        console.error(err)
    }
}

export const addOrder = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($client: ID!, $itemsOrder: [ItemFromListInput]!, $amount: Float!, $paid: Float!, $typePayment: String!, $comment: String!, $currency: String) {
                        addOrder(client: $client, itemsOrder: $itemsOrder, amount: $amount, paid: $paid, typePayment: $typePayment, comment: $comment, currency: $currency) 
                    }`})
        return res.data.addOrder
    } catch(err){
        console.error(err)
    }
}
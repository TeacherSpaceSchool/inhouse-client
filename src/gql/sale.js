import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getUnloadSales = async({search, manager, client, promotion, cpa, date, delivery, status, store, _id}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
            variables: {search, manager, client, promotion, cpa, date, delivery, status, store, _id},
            query: gql`
                    query ($search: String, $manager: ID, $promotion: ID, $client: ID, $cpa: ID, $date: Date, $delivery: Date, $status: String, $store: ID, $_id: ID) {
                        unloadSales(search: $search, manager: $manager, promotion: $promotion, client: $client, cpa: $cpa, date: $date, delivery: $delivery, status: $status, store: $store, _id: $_id)
                    }`,
        })
        return res.data.unloadSales
    } catch(err){
        console.error(err)
    }
}

export const getSale = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        sale(_id: $_id) {
                            _id
                            createdAt
                            number
                            manager {_id name}
                            client {_id name}
                            deliverymans {_id name}
                            deliveryFact
                            promotion {_id name}
                            itemsSale {_id name item count price amount characteristics status unit}
                            discount 
                            paymentConfirmation
                            cpa {_id name}
                            geo
                            percentCpa 
                            bonusManager 
                            bonusCpa 
                            amountStart
                            amountEnd
                            typePayment
                            installment {_id status number}
                            address
                            prepaid
                            addressInfo
                            comment
                            currency
                            paid
                            delivery
                            status
                            store {_id name}
                            orders {_id number}
                            reservations {_id number}
                            refunds {_id number}
                        }
                    }`,
            })
        return res.data.sale
    } catch(err){
        console.error(err)
    }
}

export const getSales = async({search, skip, items, limit, promotion, manager, client, cpa, date, delivery, status, store}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
                variables: {search, skip, items, limit, manager, client, promotion, cpa, date, delivery, status, store},
                query: gql`
                    query ($search: String, $skip: Int, $items: Boolean, $limit: Int, $promotion: ID, $manager: ID, $client: ID, $cpa: ID, $date: Date, $delivery: Date, $status: String, $store: ID) {
                        sales(search: $search, skip: $skip, items: $items, limit: $limit, promotion: $promotion, manager: $manager, client: $client, cpa: $cpa, date: $date, delivery: $delivery, status: $status, store: $store) {
                            _id
                            createdAt
                            number
                            manager {_id name}
                            client {_id name}
                            deliverymans {_id name}
                            promotion {_id name}
                            itemsSale {_id name item count price amount characteristics status unit images}
                            discount 
                            geo
                            prepaid
                            cpa {_id name}
                            percentCpa 
                            paymentConfirmation
                            bonusManager 
                            bonusCpa 
                            amountStart
                            amountEnd
                            typePayment
                            installment {_id status number}
                            address
                            addressInfo
                            comment
                            currency
                            paid
                            deliveryFact
                            delivery
                            status
                            store {_id name}
                            orders {_id number}
                            reservations {_id number}
                            refunds {_id number}
                        }
                    }`,
            })
        return res.data.sales
    } catch(err){
        console.error(err)
    }
}

export const getSalesCount = async({search, manager, client, promotion, cpa, date, delivery, status, store}, clientGql)=>{
    try{
        clientGql = clientGql? clientGql : getClientGql()
        let res = await clientGql
            .query({
                variables: {search, manager, client, promotion, cpa, date, delivery, status, store},
                query: gql`
                    query ($search: String, $manager: ID, $client: ID, $promotion: ID, $cpa: ID, $date: Date, $delivery: Date, $status: String, $store: ID) {
                        salesCount(search: $search, manager: $manager, promotion: $promotion, client: $client, cpa: $cpa, date: $date, delivery: $delivery, status: $status, store: $store)
                    }`,
            })
        return res.data.salesCount
    } catch(err){
        console.error(err)
    }
}

export const getAttachment = async(_id, clientGql)=>{
    try{
        clientGql = clientGql? clientGql : getClientGql()
        let res = await clientGql
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        getAttachment(_id: $_id)
                    }`,
            })
        return res.data.getAttachment
    } catch(err){
        console.error(err)
    }
}

export const getSalesBonusManager = async(clientGql)=>{
    try{
        clientGql = clientGql? clientGql : getClientGql()
        let res = await clientGql
            .query({
                query: gql`
                    query {
                        salesBonusManager
                    }`,
            })
        return res.data.salesBonusManager
    } catch(err){
        console.error(err)
    }
}

export const setSale = async(variables, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $bonusManager: Float, $deliverymans: [ID], $geo: [Float], $itemsSale: [ItemFromListInput], $discount: Float, $percentCpa: Float, $amountStart: Float, $amountEnd: Float, $address: String, $addressInfo: String, $comment: String, $paid: Float, $delivery: Date, $status: String) {
                        setSale(_id: $_id, bonusManager: $bonusManager, deliverymans: $deliverymans, geo: $geo, itemsSale: $itemsSale, discount: $discount, percentCpa: $percentCpa, amountStart: $amountStart, amountEnd: $amountEnd, address: $address, addressInfo: $addressInfo, comment: $comment, paid: $paid, delivery: $delivery, status: $status) 
                    }`})
        return res.data.setSale
    } catch(err){
        console.error(err)
    }
}

export const addSale = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($client: ID!, $prepaid: Float, $promotion: ID, $geo: [Float], $itemsSale: [ItemFromListInput]!, $discount: Float!, $cpa:  ID, $amountStart: Float!, $amountEnd: Float!, $typePayment: String!,  $address: String!, $addressInfo: String!, $comment: String!, $currency: String, $paid: Float!, $delivery: Date, $orders: [ID], $reservations: [ID]!) {
                        addSale(client: $client, geo: $geo, prepaid: $prepaid, promotion: $promotion, itemsSale: $itemsSale, discount: $discount, cpa:  $cpa, amountStart: $amountStart, amountEnd: $amountEnd, typePayment: $typePayment,  address: $address, addressInfo: $addressInfo, comment: $comment, currency: $currency, paid: $paid, delivery: $delivery, orders: $orders, reservations: $reservations) 
                    }`})
        return res.data.addSale
    } catch(err){
        console.error(err)
    }
}
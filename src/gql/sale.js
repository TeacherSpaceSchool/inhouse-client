import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getUnloadBonusCpaSales = async({manager, promotion, client, cpa, dateStart, dateEnd, status, store}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
            variables: {manager, promotion, client, cpa, dateStart, dateEnd, status, store},
            query: gql`
                    query ($manager: ID, $promotion: ID, $client: ID, $cpa: ID, $dateStart: Date, $dateEnd: Date, $status: String, $store: ID) {
                        unloadBonusCpaSales(manager: $manager, promotion: $promotion, client: $client, cpa: $cpa, dateStart: $dateStart, dateEnd: $dateEnd, status: $status, store: $store)
                    }`,
        })
        return res.data.unloadBonusCpaSales
    } catch(err){
        console.error(err)
    }
}

export const getUnloadBonusManagerSales = async({manager, promotion, client, cpa, dateStart, dateEnd, status, store}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
            variables: {manager, promotion, client, cpa, dateStart, dateEnd, status, store},
            query: gql`
                    query ($manager: ID, $promotion: ID, $client: ID, $cpa: ID, $dateStart: Date, $dateEnd: Date, $status: String, $store: ID) {
                        unloadBonusManagerSales(manager: $manager, promotion: $promotion, client: $client, cpa: $cpa, dateStart: $dateStart, dateEnd: $dateEnd, status: $status, store: $store)
                    }`,
        })
        return res.data.unloadBonusManagerSales
    } catch(err){
        console.error(err)
    }
}

export const getUnloadClientSales = async({manager, promotion, client, cpa, dateStart, dateEnd, status, store}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
            variables: {manager, promotion, client, cpa, dateStart, dateEnd, status, store},
            query: gql`
                    query ($manager: ID, $promotion: ID, $client: ID, $cpa: ID, $dateStart: Date, $dateEnd: Date, $status: String, $store: ID) {
                        unloadClientSales(manager: $manager, promotion: $promotion, client: $client, cpa: $cpa, dateStart: $dateStart, dateEnd: $dateEnd, status: $status, store: $store)
                    }`,
        })
        return res.data.unloadClientSales
    } catch(err){
        console.error(err)
    }
}

export const getUnloadFactorySales = async({manager, promotion, type, category, client, cpa, dateStart, dateEnd, status, store}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
            variables: {manager, promotion, type, category, client, cpa, dateStart, dateEnd, status, store},
            query: gql`
                    query ($manager: ID, $promotion: ID, $type: String, $category: String, $client: ID, $cpa: ID, $dateStart: Date, $dateEnd: Date, $status: String, $store: ID) {
                        unloadFactorySales(manager: $manager, type: $type, category: $category, promotion: $promotion, client: $client, cpa: $cpa, dateStart: $dateStart, dateEnd: $dateEnd, status: $status, store: $store)
                    }`,
        })
        return res.data.unloadFactorySales
    } catch(err){
        console.error(err)
    }
}

export const getUnloadDeliveries = async({search, order, manager, client, promotion, cpa, dateStart, dateEnd, delivery, status, store, _id}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
            variables: {search, manager, order, client, promotion, cpa, dateStart, dateEnd, delivery, status, store, _id},
            query: gql`
                    query ($search: String, $manager: ID, $order: Boolean, $promotion: ID, $client: ID, $cpa: ID, $dateStart: Date, $dateEnd: Date, $delivery: Date, $status: String, $store: ID, $_id: ID) {
                        unloadDeliveries(search: $search, manager: $manager, order: $order, promotion: $promotion, client: $client, cpa: $cpa, dateStart: $dateStart, dateEnd: $dateEnd, delivery: $delivery, status: $status, store: $store, _id: $_id)
                    }`,
        })
        return res.data.unloadDeliveries
    } catch(err){
        console.error(err)
    }
}

export const getUnloadSales = async({search, order, type, category, manager, client, promotion, cost, cpa, dateStart, dateEnd, delivery, status, store, _id}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
            variables: {search, manager, order, type, category, client, promotion, cpa, dateStart, cost, dateEnd, delivery, status, store, _id},
            query: gql`
                    query ($search: String, $manager: ID, $type: String, $category: String, $order: Boolean, $cost: Boolean, $promotion: ID, $client: ID, $cpa: ID, $dateStart: Date, $dateEnd: Date, $delivery: Date, $status: String, $store: ID, $_id: ID) {
                        unloadSales(search: $search, manager: $manager, type: $type, category: $category, order: $order, cost: $cost, promotion: $promotion, client: $client, cpa: $cpa, dateStart: $dateStart, dateEnd: $dateEnd, delivery: $delivery, status: $status, store: $store, _id: $_id)
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
                            selfDelivery
                            manager {_id name}
                            client {_id name phones}
                            deliverymans {_id name}
                            promotion {_id name}
                            itemsSale {_id name item count price amount characteristics status unit cost type category factory size}
                            discount 
                            order
                            paymentConfirmation
                            cpa {_id name}
                            geo
                            divide
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

export const getSales = async({search, skip, items, order, limit, promotion, manager, client, cpa, dateStart, dateEnd, delivery, status, store}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
                variables: {search, skip, items, limit, order, manager, client, promotion, cpa, dateStart, dateEnd, delivery, status, store},
                query: gql`
                    query ($search: String, $skip: Int, $order: Boolean, $items: Boolean, $limit: Int, $promotion: ID, $manager: ID, $client: ID, $cpa: ID, $dateStart: Date, $dateEnd: Date, $delivery: Date, $status: String, $store: ID) {
                        sales(search: $search, order: $order, skip: $skip, items: $items, limit: $limit, promotion: $promotion, manager: $manager, client: $client, cpa: $cpa, dateStart: $dateStart, dateEnd: $dateEnd, delivery: $delivery, status: $status, store: $store) {
                            _id
                            createdAt
                            number
                            manager {_id name}
                            client {_id name phones}
                            deliverymans {_id name}
                            promotion {_id name}
                            itemsSale {_id name item count price amount characteristics status unit images cost type category factory size}
                            discount 
                            geo
                            divide
                            order
                            prepaid
                            selfDelivery
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

export const getSalesCount = async({search, manager, order, client, promotion, cpa, dateStart, dateEnd, delivery, status, store}, clientGql)=>{
    try{
        clientGql = clientGql? clientGql : getClientGql()
        let res = await clientGql
            .query({
                variables: {search, manager, order, client, promotion, cpa, dateStart, dateEnd, delivery, status, store},
                query: gql`
                    query ($search: String, $manager: ID, $order: Boolean, $client: ID, $promotion: ID, $cpa: ID, $dateStart: Date, $dateEnd: Date, $delivery: Date, $status: String, $store: ID) {
                        salesCount(search: $search, manager: $manager, order: $order, promotion: $promotion, client: $client, cpa: $cpa, dateStart: $dateStart, dateEnd: $dateEnd, delivery: $delivery, status: $status, store: $store)
                    }`,
            })
        return res.data.salesCount
    } catch(err){
        console.error(err)
    }
}

export const getAttachmentSale = async(_id, clientGql)=>{
    try{
        clientGql = clientGql? clientGql : getClientGql()
        let res = await clientGql
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        getAttachmentSale(_id: $_id)
                    }`,
            })
        return res.data.getAttachmentSale
    } catch(err){
        console.error(err)
    }
}

export const prepareAcceptOrder = async(_id, clientGql)=>{
    try{
        clientGql = clientGql? clientGql : getClientGql()
        let res = await clientGql
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
                    mutation ($_id: ID!, $deliverymans: [ID], $selfDelivery: Boolean, $percentManager: Float, $geo: [Float], $itemsSale: [ItemFromListInput], $discount: Float, $percentCpa: Float, $amountStart: Float, $amountEnd: Float, $address: String, $addressInfo: String, $comment: String, $paid: Float, $delivery: Date, $status: String) {
                        setSale(_id: $_id, deliverymans: $deliverymans, selfDelivery: $selfDelivery, percentManager: $percentManager, geo: $geo, itemsSale: $itemsSale, discount: $discount, percentCpa: $percentCpa, amountStart: $amountStart, amountEnd: $amountEnd, address: $address, addressInfo: $addressInfo, comment: $comment, paid: $paid, delivery: $delivery, status: $status) 
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
                    mutation ($client: ID!, $installment: Boolean, $prepaid: Float, $order: Boolean, $promotion: ID, $selfDelivery: Boolean, $geo: [Float], $itemsSale: [ItemFromListInput]!, $discount: Float!, $cpa:  ID, $amountStart: Float!, $amountEnd: Float!, $typePayment: String!,  $address: String!, $addressInfo: String!, $comment: String!, $currency: String, $paid: Float!, $delivery: Date, $reservations: [ID]!) {
                        addSale(client: $client, installment: $installment, geo: $geo, order: $order, prepaid: $prepaid, selfDelivery: $selfDelivery, promotion: $promotion, itemsSale: $itemsSale, discount: $discount, cpa:  $cpa, amountStart: $amountStart, amountEnd: $amountEnd, typePayment: $typePayment,  address: $address, addressInfo: $addressInfo, comment: $comment, currency: $currency, paid: $paid, delivery: $delivery, reservations: $reservations) 
                    }`})
        return res.data.addSale
    } catch(err){
        console.error(err)
    }
}

export const divideSale = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $newItems: [ItemFromListInput]!, $currentItems: [ItemFromListInput]!) {
                        divideSale(_id: $_id, newItems: $newItems, currentItems: $currentItems) 
                    }`})
        return res.data.divideSale
    } catch(err){
        console.error(err)
    }
}
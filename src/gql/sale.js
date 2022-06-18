import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getSales = async({skip, date, legalObject, branch, cashbox, client, type, cashier, workShift, limit}, apolloClient)=>{
    try{
        apolloClient = apolloClient? apolloClient : getClientGql()
        let res = await apolloClient
            .query({
                variables: {skip, date, legalObject, branch, cashbox, client, type, cashier, workShift, limit},
                query: gql`
                    query ($skip: Int, $limit: Int, $workShift: ID, $date: String, $legalObject: ID, $branch: ID, $cashbox: ID, $client: ID, $type: String, $cashier: ID) {
                        sales(skip: $skip, limit: $limit, workShift: $workShift, date: $date, legalObject: $legalObject, branch: $branch, cashbox: $cashbox, client: $client, type: $type, cashier: $cashier) {
                            _id
                            createdAt
                            number
                            legalObject {_id name}
                            branch {_id name}
                            cashier {_id name}
                            cashbox {_id name}
                            workShift {_id number}
                            client {_id name}
                            sale {_id number}
                            typePayment
                            type
                            returned
                            paid
                            usedPrepayment
                            change
                            extra
                            sync
                            syncMsg
                            discount
                            amountEnd
                            nds
                            nsp
                            comment
                            items {
                                name
                                unit
                                count
                                price
                                discount
                                extra
                                amountStart
                                amountEnd
                                nds
                                nsp
                                tnved
                                mark
                                nspType
                                ndsType
                            }
                        }
                    }`,
            })
        return res.data.sales
    } catch(err){
        console.error(err)
    }
}

export const getSalesCount = async({date, legalObject, workShift, branch, cashbox, client, type, cashier}, apolloClient)=>{
    try{
        apolloClient = apolloClient? apolloClient : getClientGql()
        let res = await apolloClient
            .query({
                variables: {date, legalObject, branch, workShift, cashbox, client, type, cashier},
                query: gql`
                    query ($date: String, $workShift: ID, $legalObject: ID, $branch: ID, $cashbox: ID, $client: ID, $type: String, $cashier: ID) {
                        salesCount(date: $date, workShift: $workShift, legalObject: $legalObject, branch: $branch, cashbox: $cashbox, client: $client, type: $type, cashier: $cashier) {
                            sale
                            returned
                            prepayment
                            consignation
                            paidConsignation
                            discount
                            extra  
                            count   
                        }
                    }`,
            })
        return res.data.salesCount
    } catch(err){
        console.error(err)
    }
}

export const getSale = async({_id, type, rnmNumber, number}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id, type, rnmNumber, number},
                query: gql`
                    query ($_id: ID!, $rnmNumber: String, $type: String, $number: String) {
                        sale(_id: $_id, rnmNumber: $rnmNumber, type: $type, number: $number) {
                            _id
                            createdAt
                            qr
                            number
                            legalObject {_id name inn rateTaxe}
                            branch {_id name address}
                            cashier {_id name}
                            cashbox {_id name rnmNumber}
                            workShift {_id number}
                            client {_id name}
                            sale {_id number}
                            typePayment
                            type
                            returned
                            ndsPrecent
                            nspPrecent
                            paid
                            usedPrepayment
                            change
                            comment
                            extra
                            discount
                            sync
                            syncMsg
                            amountEnd
                            nds
                            nsp
                            items {
                                name
                                unit
                                count
                                price
                                discount
                                extra
                                amountStart
                                amountEnd
                                nds
                                nsp
                                tnved
                                mark
                                nspType
                                ndsType
                            }
                        }
                    }`,
            })
        return res.data.sale
    } catch(err){
        console.error(err)
    }
}

export const addSale = async({ndsPrecent, nspPrecent, sale, client, typePayment, comment, type, paid, usedPrepayment, change, extra, discount, amountEnd, nds, nsp, items})=>{
    try{
        let res = await (getClientGql()).mutate({
            variables: {ndsPrecent, nspPrecent, sale, client, typePayment, type, comment, paid, usedPrepayment, change, extra, discount, amountEnd, nds, nsp, items},
            mutation : gql`
                    mutation ($sale: ID, $ndsPrecent: Float!, $nspPrecent: Float!, $client: ID, $typePayment: String!, $comment: String, $type: String!, $paid: Float!, $usedPrepayment: Float!, $change: Float!, $extra: Float!, $discount: Float!, $amountEnd: Float!, $nds: Float!, $nsp: Float!, $items: [InputItemSale]!) {
                        addSale(nspPrecent: $nspPrecent, ndsPrecent: $ndsPrecent, sale: $sale, client: $client, comment: $comment, typePayment: $typePayment, type: $type, paid: $paid, usedPrepayment: $usedPrepayment, change: $change, extra: $extra, discount: $discount, amountEnd: $amountEnd, nds: $nds, nsp: $nsp, items: $items)
                    }`})
        return res.data.addSale
    } catch(err){
        console.error(err)
    }
}

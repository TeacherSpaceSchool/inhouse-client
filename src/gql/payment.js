import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getPayments = async({search, filter, skip, legalObject, date}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, filter, skip, legalObject, date},
                query: gql`
                    query ($search: String, $date: String, $filter: String, $skip: Int, $legalObject: ID) {
                        payments(search: $search, date: $date, filter: $filter, skip: $skip, legalObject: $legalObject) {
                            _id
                            createdAt
                            paymentSystem
                            status
                            number
                            amount
                            months
                            days
                            paid
                            type
                            change
                            refund
                            legalObject {_id name}
                            cashboxes {
                                _id
                                createdAt
                                name
                                legalObject {name _id}
                                branch {name _id}
                                presentCashier {name _id role}
                                endPayment
                                cash
                                del
                            }
                            who {_id name role}
                        }
                    }`,
            })
        return res.data.payments
    } catch(err){
        console.error(err)
    }
}

export const getPaymentsCount = async({search, filter, legalObject, date}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, filter, legalObject, date},
                query: gql`
                    query ($search: String, $date: String, $filter: String, $legalObject: ID) {
                        paymentsCount(search: $search, date: $date, filter: $filter, legalObject: $legalObject)
                    }`,
            })
        return res.data.paymentsCount
    } catch(err){
        console.error(err)
    }
}

export const getPayment = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query($_id: ID!) {
                        payment(_id: $_id) {
                            _id
                            createdAt
                            status
                            paymentSystem
                            number
                            amount
                            data
                            months
                            days
                            qr
                            paid
                            type
                            change
                            refund
                            legalObject {_id name}
                            cashboxes {
                                _id
                                createdAt
                                rnmNumber
                                name
                                legalObject {name _id}
                                branch {name _id}
                                presentCashier {name _id role}
                                endPayment
                                cash
                                del
                            }
                            who {_id name role}
                        }
                    }`,
            })
        return res.data.payment
    } catch(err){
        console.error(err)
    }
}

export const addPayment = async({legalObject, months, days, paid, cashboxes})=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {legalObject, months, days, paid, cashboxes},
            mutation : gql`
                    mutation ($legalObject: ID!, $months: Int!, $days: Int!, $paid: Int, $cashboxes: [ID]!) {
                        addPayment(legalObject: $legalObject, months: $months, days: $days, paid: $paid, cashboxes: $cashboxes) 
                    }`})
        return res.data.addPayment
    } catch(err){
        console.error(err)
    }
}
export const refundPayment = async(_id)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation($_id: ID!) {
                        refundPayment(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}
export const deletePayment = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation($_id: ID!) {
                        deletePayment(_id: $_id)
                    }`})
        return res.data.deletePayment
    } catch(err){
        console.error(err)
    }
}
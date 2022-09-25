import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getUnloadReservations = async({search, client, store, manager, dateStart, dateEnd, soon, status, late, today, _id}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
            variables: {search, client, store, manager, dateStart, dateEnd, soon, status, late, today, _id},
            query: gql`
                    query ($search: String, $manager: ID, $client: ID, $store: ID, $soon: Boolean, $dateStart: Date, $dateEnd: Date, $status: String, $late: Boolean, $today: Boolean, $_id: ID) {
                        unloadReservations(search: $search, manager: $manager, client: $client, soon: $soon, store: $store, dateStart: $dateStart, dateEnd: $dateEnd, status: $status, late: $late, today: $today, _id: $_id)
                    }`,
        })
        return res.data.unloadReservations
    } catch(err){
        console.error(err)
    }
}

export const getReservation = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        reservation(_id: $_id) {
                            _id
                            createdAt
                            paymentAmount
                            number
                            manager {_id name}
                            client {_id name}
                            itemsReservation {_id name item count price amount characteristics status unit}
                            store {_id name}
                            term
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
        return res.data.reservation
    } catch(err){
        console.error(err)
    }
}

export const prepareAcceptReservation = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        prepareAcceptReservation(_id: $_id) 
                    }`,
            })
        return res.data.prepareAcceptReservation
    } catch(err){
        console.error(err)
    }
}

export const getReservations = async({search, skip, limit, manager, client, store, dateStart, dateEnd, status, soon, late, today, items}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
            variables: {search, skip, limit, manager, client, store, dateStart, dateEnd, status, soon, late, today, items},
            query: gql`
                    query ($search: String, $skip: Int, $limit: Int, $manager: ID, $soon: Boolean, $client: ID, $store: ID, $dateStart: Date, $dateEnd: Date, $status: String, $late: Boolean, $today: Boolean, $items: Boolean) {
                        reservations(search: $search, skip: $skip, items: $items, limit: $limit, soon: $soon, manager: $manager, client: $client, store: $store, dateStart: $dateStart, dateEnd: $dateEnd, status: $status, late: $late, today: $today) {
                            _id
                            createdAt
                            paymentAmount
                            number
                            term
                            manager {_id name}
                            client {_id name}
                            store {_id name}
                            amount
                            paid
                            paymentConfirmation
                            typePayment
                            comment
                            currency
                            status
                            sale {_id number}
                            itemsReservation {_id name item count price amount characteristics status unit}
                        }
                    }`,
        })
        return res.data.reservations
    } catch(err){
        console.error(err)
    }
}

export const getReservationsCount = async({search, manager, client, store, dateStart, dateEnd, status, soon, late, today}, clientGql)=>{
    try{
        clientGql = clientGql? clientGql : getClientGql()
        let res = await clientGql
            .query({
                variables: {search, manager, client, store, dateStart, dateEnd, status, soon, late, today},
                query: gql`
                    query ($search: String, $manager: ID, $client: ID, $store: ID, $soon: Boolean, $dateStart: Date, $dateEnd: Date, $status: String, $late: Boolean, $today: Boolean) {
                        reservationsCount(search: $search, manager: $manager, client: $client, soon: $soon, store: $store, dateStart: $dateStart, dateEnd: $dateEnd, status: $status, late: $late, today: $today)
                    }`,
            })
        return res.data.reservationsCount
    } catch(err){
        console.error(err)
    }
}

export const setReservation = async(variables, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $itemsReservation: [ItemFromListInput], $amount: Float, $term: Date, $paid: Float, $comment: String, $status: String) {
                        setReservation(_id: $_id, itemsReservation: $itemsReservation, amount: $amount, term: $term, paid: $paid, comment: $comment, status: $status) 
                    }`})
        return res.data.setReservation
    } catch(err){
        console.error(err)
    }
}

export const addReservation = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($client: ID!, $itemsReservation: [ItemFromListInput]!, $amount: Float!, $term: Date!, $paid: Float!, $typePayment: String!, $comment: String!, $currency: String) {
                        addReservation(client: $client, itemsReservation: $itemsReservation, amount: $amount, term: $term, paid: $paid, typePayment: $typePayment, comment: $comment, currency: $currency) 
                    }`})
        return res.data.addReservation
    } catch(err){
        console.error(err)
    }
}
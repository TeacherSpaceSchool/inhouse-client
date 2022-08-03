import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getWayItems = async({skip, item, store, status, late, soon, today, date}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {skip, item, store, status, late, soon, today, date},
            query: gql`
                    query ($skip: Int, $date: Date, $soon: Boolean, $item: ID, $store: ID, $status: String, $late: Boolean, $today: Boolean) {
                        wayItems(skip: $skip, date: $date, soon: $soon, item: $item, store: $store, status: $status, late: $late, today: $today) {
                            _id
                            createdAt
                            store {_id name}
                            item {_id name unit}
                            bookings {manager {_id name} client {_id name} amount}
                            amount
                            status
                            arrivalDate
                        }
                    }`,
        })
        return res.data.wayItems
    } catch(err){
        console.error(err)
    }
}

export const getWayItem = async({_id}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {_id},
            query: gql`
                    query ($_id: ID!) {
                        wayItem(_id: $_id) {
                            _id
                            createdAt
                            store {_id name}
                            item {_id name unit}
                            bookings {manager {_id name} client {_id name} amount}
                            amount
                            status
                            arrivalDate
                        }
                    }`,
        })
        return res.data.wayItem
    } catch(err){
        console.error(err)
    }
}

export const getWayItemsCount = async({item, store, status, late, soon, today, date}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {item, store, status, late, soon, today, date},
                query: gql`
                    query ($item: ID, $store: ID, $soon: Boolean, $date: Date, $status: String, $late: Boolean, $today: Boolean) {
                        wayItemsCount(item: $item, date: $date, store: $store, soon: $soon, status: $status, late: $late, today: $today)
                    }`,
            })
        return res.data.wayItemsCount
    } catch(err){
        console.error(err)
    }
}

export const setWayItem = async(variables, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $bookings: [WayItemBookingInput], $amount: Float, $arrivalDate: Date, $status: String) {
                        setWayItem(_id: $_id, bookings: $bookings, amount: $amount, arrivalDate: $arrivalDate, status: $status) 
                    }`})
        return res.data.setWayItem
    } catch(err){
        console.error(err)
    }
}

export const addWayItem = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($item: ID!, $store: ID!, $bookings: [WayItemBookingInput]!, $amount: Float!, $arrivalDate: Date) {
                        addWayItem(item: $item, store: $store, bookings: $bookings, amount: $amount, arrivalDate: $arrivalDate) {
                            _id
                            createdAt
                            store {_id name}
                            item {_id name unit}
                            bookings {manager {_id name} client {_id name} amount}
                            amount
                            status
                            arrivalDate
                        }
                    }`})
        return res.data.addWayItem
    } catch(err){
        console.error(err)
    }
}
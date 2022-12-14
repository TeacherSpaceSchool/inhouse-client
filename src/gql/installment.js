import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getUnloadInstallments = async({_id, search, client, status, date, late, soon, today, store}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
            variables: {_id, search, client, status, date, late, soon, today, store},
            query: gql`
                    query ($search: String, $_id: ID, $client: ID, $status: String, $date: Date, $late: Boolean, $soon: Boolean, $today: Boolean, $store: ID) {
                        unloadInstallments(search: $search, _id: $_id, client: $client, status: $status, date: $date, late: $late, soon: $soon, today: $today, store: $store)
                    }`,
        })
        return res.data.unloadInstallments
    } catch(err){
        console.error(err)
    }
}

export const getInstallments = async({search, _id, skip, client, status, date, late, soon, today, store}, _client)=>{
    let res
    try{
        _client = _client? _client : getClientGql()
        res = await _client
            .query({
                variables: {search, _id, skip, client, status, date, late, soon, today, store},
                query: gql`
                    query ($search: String, $_id: ID, $skip: Int, $client: ID, $status: String, $date: Date, $late: Boolean, $soon: Boolean,$today: Boolean, $store: ID) {
                        installments(search: $search, _id: $_id, skip: $skip, client: $client, status: $status, date: $date, late: $late, soon: $soon, today: $today, store: $store) {
                            _id
                            createdAt
                            amount
                            number
                            client {_id name}
                            grid {month amount paid datePaid}
                            info
                            status
                            debt
                            paid
                            store {_id name}
                            datePaid
                            sale {_id number order}
                        }
                    }`,
            })
        return res.data.installments
    } catch(err){
        console.error(err)
    }
}

export const getInstallmentsCount = async({_id, search, client, status, date, late, soon, today, store}, _client)=>{
    try{
        _client = _client? _client : getClientGql()
        let res = await _client
            .query({
                variables: {_id, search, client, status, date, late, soon, today, store},
                query: gql`
                    query($search: String, $_id: ID, $client: ID, $status: String, $date: Date, $late: Boolean, $soon: Boolean, $today: Boolean, $store: ID) {
                        installmentsCount(search: $search, _id: $_id, client: $client, status: $status, date: $date, late: $late, soon: $soon, today: $today, store: $store) 
                    }`,
            })
        return res.data.installmentsCount
    } catch(err){
        console.error(err)
    }
}

export const addInstallment = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($renew: Boolean, $grid: [InstallmentGridInput]!, $currency: String!, $amount: Float!, $client: ID!, $sale: ID, $debt: Float!, $paid: Float!, $datePaid: Date!, $store: ID!) {
                        addInstallment(renew: $renew, grid: $grid, client: $client, currency: $currency, amount: $amount, sale: $sale, debt: $debt, paid: $paid, datePaid: $datePaid, store: $store) {
                            _id
                            createdAt
                            amount
                            number
                            client {_id name}
                            grid {month amount paid datePaid}
                            info
                            status
                            debt
                            paid
                            store {_id name}
                            datePaid
                            sale {_id number order}
                        }
                    }`})
        return res.data.addInstallment
    } catch(err){
        console.error(err)
    }
}

export const setInstallment = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $info: String, $status: String, $grid: [InstallmentGridInput]) {
                        setInstallment(_id: $_id, info: $info, status: $status, grid: $grid)
                    }`})
        return res.data.setInstallment
    } catch(err){
        console.error(err)
    }
}
import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getEmploymentsForSalary = async({search, date, store, department, position}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, date, store, department, position},
                query: gql`
                    query ($search: String, $date: Date!, $store: ID, $department: String, $position: String) {
                        employmentsForSalary(search: $search, date: $date, store: $store, department: $department, position: $position) {
                            _id
                            role
                            name
                        }
                    }`,
            })
        return res.data.employmentsForSalary
    } catch(err){
        console.error(err)
    }
}

export const getSalarysCount = async({date, search, store, employment, department, position}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {date, search, store, employment, department, position},
                query: gql`
                    query ($date: Date, $search: String, $store: ID, $employment: ID, $department: String, $position: String) {
                        salarysCount(date: $date, search: $search, store: $store, employment: $employment, department: $department, position: $position)
                    }`,
            })
        return res.data.salarysCount
    } catch(err){
        console.error(err)
    }
}

export const getSalarys = async({skip, date, search, store, employment, last, department, position}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, date, search, store, employment, last, department, position},
                query: gql`
                    query ($skip: Int, $date: Date!, $search: String, $store: ID, $employment: ID, $last: Boolean, $department: String, $position: String) {
                        salarys(skip: $skip, date: $date, search: $search, store: $store, employment: $employment, last: $last, department: $department, position: $position) {
                            _id
                            createdAt
                            employment {_id name department position}
                            date
                            salary
                            bid
                            actualDays
                            accrued
                            workingDay
                            debtStart
                            bonus
                            premium
                            penaltie
                            advance
                            pay
                            paid
                            debtEnd
                        }
                    }`,
            })
        return res.data.salarys
    } catch(err){
        console.error(err)
    }
}

export const deleteSalary = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteSalary(_id: $_id)
                    }`})
        return res.data.deleteSalary
    } catch(err){
        console.error(err)
    }
}

export const addSalary = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($employment: ID!, $date: Date!, $salary: Float!, $bid: Float!, $actualDays: Float!, $accrued: Float!, $workingDay: Float!, $debtStart: Float!, $premium: Float!, $bonus: Float!, $penaltie: Float!, $advance: Float!, $pay: Float!, $paid: Float!, $debtEnd: Float!) {
                        addSalary(employment: $employment, date: $date, salary: $salary, bid: $bid, actualDays: $actualDays, accrued: $accrued, workingDay: $workingDay, debtStart: $debtStart, premium: $premium, bonus: $bonus, penaltie: $penaltie, advance: $advance, pay: $pay, paid: $paid, debtEnd: $debtEnd) {
                                _id
                                createdAt
                                employment {_id name}
                                date
                                salary
                                bid
                                actualDays
                                workingDay
                                debtStart
                                bonus
                                premium
                                accrued
                                penaltie
                                advance
                                pay
                                paid
                                debtEnd
                            }
                    }`})
        return res.data.addSalary
    } catch(err){
        console.error(err)
    }
}

export const setSalary = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $salary: Float, $bid: Float, $premium: Float, $accrued: Float, $actualDays: Float, $workingDay: Float, $debtStart: Float, $bonus: Float, $penaltie: Float, $advance: Float, $pay: Float, $paid: Float, $debtEnd: Float) {
                        setSalary(_id: $_id, salary: $salary, bid: $bid, premium: $premium, actualDays: $actualDays, accrued: $accrued, workingDay: $workingDay, debtStart: $debtStart, bonus: $bonus, penaltie: $penaltie, advance: $advance, pay: $pay, paid: $paid, debtEnd: $debtEnd)
                    }`})
        return res.data.setSalary
    } catch(err){
        console.error(err)
    }
}
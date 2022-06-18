import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getDepositHistory = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        depositHistory(_id: $_id) {
                            syncMsg
                            number
                            _id
                            createdAt
                            comment
                            amount
                            legalObject {name _id inn rateTaxe}
                            branch {name address _id}
                            cashier {name _id}
                            cashbox {name _id rnmNumber}
                            workShift {number _id}
                        }
                    }`,
            })
        return res.data.depositHistory
    } catch(err){
        console.error(err)
    }
}

export const getDepositHistorys = async({skip, date, legalObject, branch, cashier, cashbox, workShift}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, legalObject, branch, cashier, cashbox, workShift, date},
                query: gql`
                    query ($skip: Int, $date: String, $legalObject: ID, $branch: ID, $cashier: ID, $cashbox: ID, $workShift: ID) {
                        depositHistorys(skip: $skip, legalObject: $legalObject, branch: $branch, cashier: $cashier, cashbox: $cashbox, workShift: $workShift, date: $date) {
                            number
                            _id
                            createdAt
                            comment
                            amount
                            legalObject {name _id}
                            branch {name _id}
                            cashier {name _id}
                            cashbox {name _id}
                            workShift {number _id}
                        }
                    }`,
            })
        return res.data.depositHistorys
    } catch(err){
        console.error(err)
    }
}

export const getDepositHistorysCount = async({legalObject, branch, cashier, cashbox, workShift, date}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {legalObject, branch, cashier, cashbox, workShift, date},
                query: gql`
                    query ($date: String, $legalObject: ID, $branch: ID, $cashier: ID, $cashbox: ID, $workShift: ID) {
                        depositHistorysCount(legalObject: $legalObject, branch: $branch, cashier: $cashier, cashbox: $cashbox, workShift: $workShift, date: $date){
                              count
                              amount
                          }
                    }`,
            })
        return res.data.depositHistorysCount
    } catch(err){
        console.error(err)
    }
}
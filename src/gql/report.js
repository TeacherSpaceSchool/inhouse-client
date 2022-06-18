import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getReports = async({skip, date, legalObject, cashbox, filter, workShift}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, date, legalObject, cashbox, filter, workShift},
                query: gql`
                    query ($skip: Int, $date: String, $legalObject: ID, $cashbox: ID, $workShift: ID, $filter: String) {
                        reports(skip: $skip, cashbox: $cashbox, legalObject: $legalObject, workShift: $workShift, filter: $filter, date: $date) {
                            _id
                            number
                            createdAt
                            legalObject {_id name}
                            cashbox {_id name}
                            workShift {_id number}
                            branch {_id name address}
                            type
                            start
                            end
                            cashEnd
                            deposit
                            withdraw
                            discount
                            extra
                            cash
                            cashless
                            saleAll
                            consignationAll
                            paidConsignationAll
                            prepaymentAll
                            returnedAll
                            buyAll
                            returnedBuyAll
                            sale
                            saleCount
                            consignation
                            consignationCount
                            paidConsignation
                            paidConsignationCount
                            prepayment
                            prepaymentCount
                            returned
                            returnedCount
                            buy
                            buyCount
                            returnedBuy
                            returnedBuyCount
                            sync
                            syncMsg
                        }
                    }`,
            })
        return res.data.reports
    } catch(err){
        console.error(err)
    }
}

export const getReport = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        report(_id: $_id) {
                            _id
                            number
                            createdAt
                            legalObject {_id name address inn rateTaxe}
                            cashbox {_id name rnmNumber}
                            branch {_id name address}
                            workShift {_id number}
                            type
                            start
                            end
                            cashEnd
                            deposit
                            withdraw
                            discount
                            extra
                            cash
                            cashless
                            saleAll
                            consignationAll
                            paidConsignationAll
                            prepaymentAll
                            returnedAll
                            buyAll
                            returnedBuyAll
                            sale
                            saleCount
                            consignation
                            consignationCount
                            paidConsignation
                            paidConsignationCount
                            prepayment
                            prepaymentCount
                            returned
                            returnedCount
                            buy
                            buyCount
                            returnedBuy
                            returnedBuyCount
                            sync
                            syncMsg
                        }
                    }`,
            })
        return res.data.report
    } catch(err){
        console.error(err)
    }
}

export const getReportsCount = async({skip, date, legalObject, cashbox, filter, workShift}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, date, legalObject, cashbox, filter, workShift},
                query: gql`
                    query ($date: String, $legalObject: ID, $cashbox: ID, $filter: String, $workShift: ID) {
                        reportsCount(cashbox: $cashbox, legalObject: $legalObject, filter: $filter, date: $date, workShift: $workShift)
                    }`,
            })
        return res.data.reportsCount
    } catch(err){
        console.error(err)
    }
}

export const generateReportX = async({cashbox})=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {cashbox},
            mutation : gql`
                    mutation ($cashbox: ID!) {
                        generateReportX(cashbox: $cashbox)
                    }`})
        return res.data.generateReportX
    } catch(err){
        console.error(err)
    }
}
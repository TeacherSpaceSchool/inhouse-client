import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getMoneyFlowsCount = async({search, store, installment, order, sale, reservation, refund, client, cashbox, employment, moneyRecipient, moneyArticle, operation, currency, dateStart, dateEnd}, _client)=>{
    try{
        _client = _client? _client : getClientGql()
        let res = await _client
            .query({
                variables: {search, store, order, installment, sale, reservation, refund, client, cashbox, employment, moneyRecipient, moneyArticle, operation, currency, dateStart, dateEnd},
                query: gql`
                    query ($search: String, $store: ID, $order: ID, $installment: ID, $sale: ID, $reservation: ID, $refund: ID, $cashbox: ID, $client: ID, $employment: ID, $moneyRecipient: ID, $moneyArticle: ID, $operation: String, $currency: String, $dateStart: Date, $dateEnd: Date) {
                        moneyFlowsCount(search: $search, store: $store, installment: $installment, order: $order, sale: $sale, reservation: $reservation, refund: $refund, cashbox: $cashbox, client: $client, employment: $employment, moneyRecipient: $moneyRecipient, moneyArticle: $moneyArticle, operation: $operation, currency: $currency, dateStart: $dateStart, dateEnd: $dateEnd)
                    }`,
            })
        return res.data.moneyFlowsCount
    } catch(err){
        console.error(err)
    }
}

export const getPKO = async(_id, _client)=>{
    try{
        _client = _client? _client : getClientGql()
        let res = await _client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        getPKO(_id: $_id)
                    }`,
            })
        return res.data.getPKO
    } catch(err){
        console.error(err)
    }
}

export const getRKO = async(_id, _client)=>{
    try{
        _client = _client? _client : getClientGql()
        let res = await _client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        getRKO(_id: $_id)
                    }`,
            })
        return res.data.getRKO
    } catch(err){
        console.error(err)
    }
}

export const getMoneyFlows = async({search, store, order, sale, installment, reservation, refund, skip, cashbox, client, employment, moneyRecipient, moneyArticle, operation, currency, dateStart, dateEnd}, _client)=>{
    try{
        _client = _client? _client : getClientGql()
        let res = await _client
            .query({
                variables: {search, store, order, sale, reservation, installment, refund, skip, cashbox, client, employment, moneyRecipient, moneyArticle, operation, currency, dateStart, dateEnd},
                query: gql`
                    query ($search: String, $store: ID, $order: ID, $sale: ID, $installment: ID, $reservation: ID, $refund: ID, $cashbox: ID, $client: ID, $employment: ID, $moneyRecipient: ID, $moneyArticle: ID, $operation: String, $currency: String, $dateStart: Date, $dateEnd: Date, $skip: Int) {
                        moneyFlows(search: $search, store: $store, order: $order, installment: $installment, sale: $sale, reservation: $reservation, refund: $refund, skip: $skip, cashbox: $cashbox, client: $client, employment: $employment, moneyRecipient: $moneyRecipient, moneyArticle: $moneyArticle, operation: $operation, currency: $currency, dateStart: $dateStart, dateEnd: $dateEnd) {
                            _id
                            createdAt
                            client {_id name}
                            cashbox {_id name}
                            cashboxRecipient {_id name}
                            employment {_id name}
                            moneyRecipient {_id name}
                            moneyArticle {_id name}
                            operation
                            info
                            amount
                            exchangeRate
                            amountEnd
                            currency
                            number
                            date
                            order {_id number}
                            sale {_id number}
                            reservation {_id number}
                            refund {_id number}
                            installment {_id number}
                            installmentMonth
                        }
                    }`,
            })
        return res.data.moneyFlows
    } catch(err){
        console.error(err)
    }
}

export const deleteMoneyFlow = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteMoneyFlow(_id: $_id)
                    }`})
        return res.data.deleteMoneyFlow
    } catch(err){
        console.error(err)
    }
}

export const addMoneyFlow = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($order: ID, $installment: ID, $exchangeRate: Float!, $amountEnd: Float!, $installmentMonth: Date, $sale: ID, $reservation: ID, $refund: ID, $client: ID, $employment: ID, $cashboxRecipient: ID, $cashbox: ID!, $moneyRecipient: ID, $moneyArticle: ID!, $operation: String!, $info: String!, $amount: Float!, $currency: String!, $date: Date!) {
                        addMoneyFlow(order: $order, installment: $installment, exchangeRate: $exchangeRate, amountEnd: $amountEnd, installmentMonth: $installmentMonth, sale: $sale, reservation: $reservation, refund: $refund, client: $client, employment: $employment, cashboxRecipient: $cashboxRecipient, cashbox: $cashbox, moneyRecipient: $moneyRecipient, moneyArticle: $moneyArticle, operation: $operation, info: $info, amount: $amount, currency: $currency, date: $date) {
                            _id
                            createdAt
                            client {_id name}
                            cashbox {_id name}
                            cashboxRecipient {_id name}
                            employment {_id name}
                            moneyRecipient {_id name}
                            moneyArticle {_id name}
                            operation
                            info
                            amount
                            exchangeRate
                            amountEnd
                            number
                            currency
                            date
                            order {_id number}
                            sale {_id number}
                            reservation {_id number}
                            refund {_id number}
                            installment {_id number}
                            installmentMonth
                        }
                    }`})
        return res.data.addMoneyFlow
    } catch(err){
        console.error(err)
    }
}

export const setMoneyFlow = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $info: String, $amount: Float, $moneyArticle: ID, $exchangeRate: Float, $amountEnd: Float, $clearRecipient: Boolean, $client: ID, $employment: ID, $installment: ID, $installmentMonth: Date, $order: ID, $sale: ID, $reservation: ID, $refund: ID, $cashboxRecipient: ID, $moneyRecipient: ID) {
                        setMoneyFlow(_id: $_id, info: $info, amount: $amount, moneyArticle: $moneyArticle, exchangeRate: $exchangeRate, amountEnd: $amountEnd, clearRecipient: $clearRecipient, client: $client, employment: $employment, installment: $installment, installmentMonth: $installmentMonth, order: $order, sale: $sale, reservation: $reservation, refund: $refund, cashboxRecipient: $cashboxRecipient, moneyRecipient: $moneyRecipient)
                    }`})
        return res.data.setMoneyFlow
    } catch(err){
        console.error(err)
    }
}

export const getUnloadMoneyFlows = async({search, store, installment, order, sale, reservation, refund, client, cashbox, employment, moneyRecipient, moneyArticle, operation, currency, dateStart, dateEnd}, clientGql)=>{
    let res
    try{
        clientGql = clientGql? clientGql : getClientGql()
        res = await clientGql.query({
            variables: {search, store, installment, order, sale, reservation, refund, client, cashbox, employment, moneyRecipient, moneyArticle, operation, currency, dateStart, dateEnd},
            query: gql`
                    query ($search: String, $store: ID, $order: ID, $installment: ID, $sale: ID, $reservation: ID, $refund: ID, $cashbox: ID, $client: ID, $employment: ID, $moneyRecipient: ID, $moneyArticle: ID, $operation: String, $currency: String, $dateStart: Date, $dateEnd: Date) {
                        unloadMoneyFlows(search: $search, store: $store, installment: $installment, order: $order, sale: $sale, reservation: $reservation, refund: $refund, cashbox: $cashbox, client: $client, employment: $employment, moneyRecipient: $moneyRecipient, moneyArticle: $moneyArticle, operation: $operation, currency: $currency, dateStart: $dateStart, dateEnd: $dateEnd)
                    }`,
        })
        return res.data.unloadMoneyFlows
    } catch(err){
        console.error(err)
    }
}

export const uploadMoneyFlow = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($document: Upload!) {
                        uploadMoneyFlow(document: $document) 
                    }`})
        return res.data.uploadMoneyFlow
    } catch(err){
        console.error(err)
    }
}
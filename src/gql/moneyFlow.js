import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getMoneyFlowsCount = async({store, order, sale, reservation, refund, client, cashbox, employment, moneyRecipient, moneyArticle, operation, currency, date}, _client)=>{
    try{
        _client = _client? _client : getClientGql()
        let res = await _client
            .query({
                variables: {store, order, sale, reservation, refund, client, cashbox, employment, moneyRecipient, moneyArticle, operation, currency, date},
                query: gql`
                    query ($store: ID, $order: ID, $sale: ID, $reservation: ID, $refund: ID, $cashbox: ID, $client: ID, $employment: ID, $moneyRecipient: ID, $moneyArticle: ID, $operation: String, $currency: String, $date: Date) {
                        moneyFlowsCount(store: $store, order: $order, sale: $sale, reservation: $reservation, refund: $refund, cashbox: $cashbox, client: $client, employment: $employment, moneyRecipient: $moneyRecipient, moneyArticle: $moneyArticle, operation: $operation, currency: $currency, date: $date)
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

export const getMoneyFlows = async({store, order, sale, reservation, refund, skip, cashbox, client, employment, moneyRecipient, moneyArticle, operation, currency, date}, _client)=>{
    try{
        _client = _client? _client : getClientGql()
        let res = await _client
            .query({
                variables: {store, order, sale, reservation, refund, skip, cashbox, client, employment, moneyRecipient, moneyArticle, operation, currency, date},
                query: gql`
                    query ($store: ID, $order: ID, $sale: ID, $reservation: ID, $refund: ID, $cashbox: ID, $client: ID, $employment: ID, $moneyRecipient: ID, $moneyArticle: ID, $operation: String, $currency: String, $date: Date, $skip: Int) {
                        moneyFlows(store: $store, order: $order, sale: $sale, reservation: $reservation, refund: $refund, skip: $skip, cashbox: $cashbox, client: $client, employment: $employment, moneyRecipient: $moneyRecipient, moneyArticle: $moneyArticle, operation: $operation, currency: $currency, date: $date) {
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
                            currency
                            number
                            date
                            order {_id number}
                            sale {_id number}
                            reservation {_id number}
                            refund {_id number}
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
                    mutation ($order: ID, $sale: ID, $reservation: ID, $refund: ID, $client: ID, $employment: ID, $cashboxRecipient: ID, $cashbox: ID!, $moneyRecipient: ID, $moneyArticle: ID!, $operation: String!, $info: String!, $amount: Float!, $currency: String!, $date: Date!) {
                        addMoneyFlow(order: $order, sale: $sale, reservation: $reservation, refund: $refund, client: $client, employment: $employment, cashboxRecipient: $cashboxRecipient, cashbox: $cashbox, moneyRecipient: $moneyRecipient, moneyArticle: $moneyArticle, operation: $operation, info: $info, amount: $amount, currency: $currency, date: $date) {
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
                            number
                            currency
                            date
                            order {_id number}
                            sale {_id number}
                            reservation {_id number}
                            refund {_id number}
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
                    mutation ($_id: ID!, $info: String, $amount: Float) {
                        setMoneyFlow(_id: $_id, info: $info, amount: $amount)
                    }`})
        return res.data.setMoneyFlow
    } catch(err){
        console.error(err)
    }
}
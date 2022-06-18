import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getItemBarCodes = async({skip, search, filter}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, search, filter},
                query: gql`
                    query ($skip: Int, $search: String, $filter: String) {
                        itemBarCodes(skip: $skip, search: $search, filter: $filter) {
                            _id
                            createdAt
                            barCode
                            name
                            check
                        }
                    }`,
            })
        return res.data.itemBarCodes
    } catch(err){
        console.error(err)
    }
}

export const getItemBarCodesCount = async({search, category, type, legalObject}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, category, type, legalObject},
                query: gql`
                    query($search: String, $filter: String) {
                        itemBarCodesCount(search: $search, filter: $filter) 
                    }`,
            })
        return res.data.itemBarCodesCount
    } catch(err){
        console.error(err)
    }
}

export const getItemBarCode = async({barCode}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {barCode},
                query: gql`
                    query ($barCode: String!) {
                        itemBarCode(barCode: $barCode) {
                            _id
                            createdAt
                            barCode
                            name
                            check
                        }
                    }`,
            })
        return res.data.itemBarCode
    } catch(err){
        console.error(err)
    }
}

export const deleteItemBarCode = async(_id)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteItemBarCode(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addItemBarCode = async({category, currency, price, ndsType, nspType, unit, barCode, name, type})=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {category, currency, price, ndsType, nspType, unit, barCode, name, type},
            mutation : gql`
                    mutation ($barCode: String!, $name: String!) {
                        addItemBarCode(barCode: $barCode, name: $name) {
                            _id
                            createdAt
                            barCode
                            name
                            check
                        }
                    }`})
        return res.data.addItemBarCode
    } catch(err){
        console.error(err)
    }
}

export const setItemBarCode = async(element)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $name: String, $check: Boolean) {
                        setItemBarCode(_id: $_id, name: $name, check: $check)
                    }`})
    } catch(err){
        console.error(err)
    }
}
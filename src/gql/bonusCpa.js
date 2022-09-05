import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getStoreForBonusCpas = async({search, store}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, store},
                query: gql`
                    query ($search: String, $store: ID) {
                        storeForBonusCpas(search: $search, store: $store) {
                            _id
                            name
                        }
                    }`,
            })
        return res.data.storeForBonusCpas
    } catch(err){
        console.error(err)
    }
}

export const getBonusCpas = async({skip, store}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, store},
                query: gql`
                    query ($skip: Int, $store: ID) {
                        bonusCpas(skip: $skip, store: $store) {
                            _id
                            createdAt
                            store {_id name}
                            sale
                            order
                            installment
                        }
                    }`,
            })
        return res.data.bonusCpas
    } catch(err){
        console.error(err)
    }
}

export const getBonusCpasCount = async({store}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {store},
                query: gql`
                    query ($store: ID) {
                        bonusCpasCount(store: $store)
                    }`,
            })
        return res.data.bonusCpasCount
    } catch(err){
        console.error(err)
    }
}

export const deleteBonusCpa = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteBonusCpa(_id: $_id)
                    }`})
        return res.data.deleteBonusCpa
    } catch(err){
        console.error(err)
    }
}

export const addBonusCpa = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($store: ID!, $sale: [[Float]]!, $order: [[Float]]!, $installment: [[Float]]!) {
                        addBonusCpa(store: $store, sale: $sale, order: $order, installment: $installment){
                            _id
                            createdAt
                            store {_id name}
                            sale
                            order
                            installment
                        }
                    }`})
        return res.data.addBonusCpa
    } catch(err){
        console.error(err)
    }
}

export const setBonusCpa = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $sale: [[Float]], $order: [[Float]], $installment: [[Float]]) {
                        setBonusCpa(_id: $_id, sale: $sale, order: $order, installment: $installment)
                    }`})
        return res.data.setBonusCpa
    } catch(err){
        console.error(err)
    }
}

export const getUnloadBonusCpas = async({store}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {store},
            query: gql`
                    query ($store: ID) {
                        unloadBonusCpas(store: $store)
                    }`,
        })
        return res.data.unloadBonusCpas
    } catch(err){
        console.error(err)
    }
}

export const uploadBonusCpa = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($document: Upload!) {
                        uploadBonusCpa(document: $document) 
                    }`})
        return res.data.uploadBonusCpa
    } catch(err){
        console.error(err)
    }
}
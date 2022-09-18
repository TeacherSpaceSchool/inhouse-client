import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getStoreForBonusManagers = async({search, store}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, store},
                query: gql`
                    query ($search: String, $store: ID) {
                        storeForBonusManagers(search: $search, store: $store) {
                            _id
                            name
                        }
                    }`,
            })
        return res.data.storeForBonusManagers
    } catch(err){
        console.error(err)
    }
}

export const getBonusManagers = async({skip, store}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, store},
                query: gql`
                    query ($skip: Int, $store: ID) {
                        bonusManagers(skip: $skip, store: $store) {
                            _id
                            createdAt
                            store {_id name}
                            sale
                            saleInstallment
                            order
                            orderInstallment
                            promotion
                        }
                    }`,
            })
        return res.data.bonusManagers
    } catch(err){
        console.error(err)
    }
}

export const getBonusManagersCount = async({store}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {store},
                query: gql`
                    query ($store: ID) {
                        bonusManagersCount(store: $store)
                    }`,
            })
        return res.data.bonusManagersCount
    } catch(err){
        console.error(err)
    }
}

export const deleteBonusManager = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteBonusManager(_id: $_id)
                    }`})
        return res.data.deleteBonusManager
    } catch(err){
        console.error(err)
    }
}

export const addBonusManager = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($store: ID!, $sale: [[Float]]!, $saleInstallment: [[Float]]!, $order: [[Float]]!, $orderInstallment: [[Float]]!, $promotion: [[Float]]!) {
                        addBonusManager(store: $store, sale: $sale, saleInstallment: $saleInstallment, order: $order, orderInstallment: $orderInstallment, promotion: $promotion){
                            _id
                            createdAt
                            store {_id name}
                            sale
                            saleInstallment
                            order
                            orderInstallment
                            promotion
                        }
                    }`})
        return res.data.addBonusManager
    } catch(err){
        console.error(err)
    }
}

export const setBonusManager = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $sale: [[Float]], $saleInstallment: [[Float]], $order: [[Float]], $orderInstallment: [[Float]], $promotion: [[Float]]) {
                        setBonusManager(_id: $_id, sale: $sale, saleInstallment: $saleInstallment, order: $order, orderInstallment: $orderInstallment, promotion: $promotion)
                    }`})
        return res.data.setBonusManager
    } catch(err){
        console.error(err)
    }
}

export const getUnloadBonusManagers = async({store}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {store},
            query: gql`
                    query ($store: ID) {
                        unloadBonusManagers(store: $store)
                    }`,
        })
        return res.data.unloadBonusManagers
    } catch(err){
        console.error(err)
    }
}
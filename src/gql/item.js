import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getItems = async({skip, limit, search, category, factory, catalog}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client
            .query({
                variables: {skip, limit, search, category, factory, catalog},
                query: gql`
                    query ($skip: Int, $search: String, $limit: Int, $category: ID, $factory: ID, $catalog: Boolean) {
                        items(skip: $skip, search: $search, limit: $limit, category: $category, factory: $factory, catalog: $catalog) {
                            _id
                            createdAt
                            category {_id name}
                            ID
                            name
                            free
                            art
                            images
                            typeDiscount
                            priceUSD
                            primeCostUSD
                            priceKGS
                            primeCostKGS
                            discount
                            priceAfterDiscountKGS
                            info
                            unit
                            size
                            characteristics
                            factory {_id name}
                        }
                    }`,
            })
        return res.data.items
    } catch(err){
        console.error(err)
    }
}

export const getItemsCount = async({search, category, factory}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, category, factory},
                query: gql`
                    query ($search: String, $category: ID, $factory: ID) {
                        itemsCount(search: $search, category: $category, factory: $factory) 
                    }`,
            })
        return res.data.itemsCount
    } catch(err){
        console.error(err)
    }
}

export const getItem = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id: _id},
                query: gql`
                    query ($_id: String!) {
                        item(_id: $_id) {
                            _id
                            createdAt
                            category {_id name}
                            ID
                            name
                            images
                            typeDiscount
                            priceUSD
                            primeCostUSD
                            art
                            priceKGS
                            primeCostKGS
                            discount
                            priceAfterDiscountKGS
                            info
                            unit
                            size
                            characteristics
                            factory {_id name}
                        }
                    }`,
            })
        return res.data.item
    } catch(err){
        console.error(err)
    }
}

export const deleteItem = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteItem(_id: $_id)
                    }`})
        return res.data.deleteItem
    } catch(err){
        console.error(err)
    }
}

export const addItem = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($ID: String!, $art: String!, $typeDiscount: String!, $name: String!, $uploads: [Upload], $priceUSD: Float!, $primeCostUSD: Float!, $priceKGS: Float!, $primeCostKGS: Float!, $discount: Float!, $priceAfterDiscountKGS: Float!, $info: String!, $unit: String!, $size: String!, $characteristics: [[String]]!, $category: ID!, $factory: ID!) {
                        addItem(ID: $ID, name: $name, art: $art, typeDiscount: $typeDiscount, uploads: $uploads, priceUSD: $priceUSD, primeCostUSD: $primeCostUSD, priceKGS: $priceKGS, primeCostKGS: $primeCostKGS, discount: $discount, priceAfterDiscountKGS: $priceAfterDiscountKGS, info: $info, unit: $unit, size: $size, characteristics: $characteristics, category: $category, factory: $factory)
                    }`})
        return res.data.addItem
    } catch(err){
        console.error(err)
    }
}

export const setItem = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $ID: String, $art: String, $typeDiscount: String, $name: String, $uploads: [Upload], $images: [String], $priceUSD: Float, $primeCostUSD: Float, $priceKGS: Float, $primeCostKGS: Float, $discount: Float, $priceAfterDiscountKGS: Float, $info: String, $unit: String, $size: String, $characteristics: [[String]], $category: ID, $factory: ID) {
                        setItem(_id: $_id, ID: $ID, name: $name, art: $art, typeDiscount: $typeDiscount, uploads: $uploads, images: $images, priceUSD: $priceUSD, primeCostUSD: $primeCostUSD, priceKGS: $priceKGS, primeCostKGS: $primeCostKGS, discount: $discount, priceAfterDiscountKGS: $priceAfterDiscountKGS, info: $info, unit: $unit, size: $size, characteristics: $characteristics, category: $category, factory: $factory)
                    }`})
        return res.data.setItem
    } catch(err){
        console.error(err)
    }
}

export const kgsFromUsdItem = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($USD: Float!, $ceil: Boolean!) {
                        kgsFromUsdItem(USD: $USD, ceil: $ceil)
                    }`})
        return res.data.kgsFromUsdItem
    } catch(err){
        console.error(err)
    }
}
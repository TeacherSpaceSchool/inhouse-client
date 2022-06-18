import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getItems = async({skip, search, category, type, legalObject, limit, quick}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client
            .query({
                variables: {skip, search, category, type, legalObject, limit, quick},
                query: gql`
                    query ($skip: Int, $search: String, $category: ID, $type: String, $legalObject: ID, $limit: Int, $quick: Boolean) {
                        items(skip: $skip, search: $search, category: $category, type: $type, legalObject: $legalObject, limit: $limit, quick: $quick) {
                            _id
                            createdAt
                            category {_id name}
                            legalObject {_id name}
                            price 
                            editedPrice
                            quick
                            unit 
                            barCode
                            name
                            type
                            del
                            tnved
                            mark
                            priority
                        }
                    }`,
            })
        return res.data.items
    } catch(err){
        console.error(err)
    }
}

export const getItemsCount = async({search, category, type, legalObject}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, category, type, legalObject},
                query: gql`
                    query($search: String, $category: ID, $type: String, $legalObject: ID) {
                        itemsCount(search: $search, category: $category, type: $type, legalObject: $legalObject) 
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
                    query ($_id: ID!) {
                        item(_id: $_id) {
                            _id
                            createdAt
                            category {_id name}
                            legalObject {_id name}
                            price 
                            unit 
                            editedPrice
                            barCode
                            name
                            type
                            del
                            tnved
                            mark
                            quick
                            priority
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
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteItem(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addItem = async({legalObject, category, price, unit, barCode, name, type, editedPrice, tnved, mark, quick, priority})=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {legalObject, category, price, unit, barCode, name, type, editedPrice, tnved, mark, quick, priority},
            mutation : gql`
                    mutation ($legalObject: ID!, $category: ID, $tnved: String!, $mark: Boolean!, $priority: Int!, $quick: Boolean!, $price: Float!, $editedPrice: Boolean!, $unit: String!, $barCode: String, $name: String!, $type: String!) {
                        addItem(legalObject: $legalObject, category: $category, tnved: $tnved, mark: $mark, priority: $priority, quick: $quick, price: $price, editedPrice: $editedPrice, unit: $unit, barCode: $barCode, name: $name, type: $type)
                    }`})
        return res.data.addItem
    } catch(err){
        console.error(err)
    }
}

export const setItem = async({_id, category, price, unit, barCode, name, type, editedPrice, tnved, mark, quick, priority})=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id, category, price, unit, barCode, name, type, editedPrice, tnved, mark, quick, priority},
            mutation : gql`
                    mutation ($_id: ID!, $category: ID, $tnved: String, $mark: Boolean, $quick: Boolean, $price: Float, $priority: Int, $editedPrice: Boolean, $unit: String, $barCode: String, $name: String, $type: String) {
                        setItem(_id: $_id, category: $category, tnved: $tnved, mark: $mark, quick: $quick, priority: $priority, editedPrice: $editedPrice, price: $price, unit: $unit, barCode: $barCode, name: $name, type: $type)
                    }`})
    } catch(err){
        console.error(err)
    }
}
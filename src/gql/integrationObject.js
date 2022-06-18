import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getBranchsForIntegrationObjects = async({search, legalObject}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client
            .query({
                variables: {search, legalObject},
                query: gql`
                    query ($search: String, $legalObject: ID!) {
                        branchsForIntegrationObjects(search: $search, legalObject: $legalObject) {
                            _id
                            name
                        }
                    }`,
            })
        return res.data.branchsForIntegrationObjects
    } catch(err){
        console.error(err)
    }
}

export const getItemsForIntegrationObjects = async({search, legalObject}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client
            .query({
                variables: {search, legalObject},
                query: gql`
                    query ($search: String, $legalObject: ID!) {
                        itemsForIntegrationObjects(search: $search, legalObject: $legalObject) {
                            _id
                            name
                        }
                    }`,
            })
        return res.data.itemsForIntegrationObjects
    } catch(err){
        console.error(err)
    }
}

export const getDistrictsForIntegrationObjects = async({search, legalObject}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client
            .query({
                variables: {search, legalObject},
                query: gql`
                    query ($search: String, $legalObject: ID!) {
                        districtsForIntegrationObjects(search: $search, legalObject: $legalObject) {
                            _id
                            name
                        }
                    }`,
            })
        return res.data.districtsForIntegrationObjects
    } catch(err){
        console.error(err)
    }
}

export const getUsersForIntegrationObjects = async({search, legalObject}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client
            .query({
                variables: {search, legalObject},
                query: gql`
                    query ($search: String, $legalObject: ID!) {
                        usersForIntegrationObjects(search: $search, legalObject: $legalObject) {
                            _id
                            name
                        }
                    }`,
            })
        return res.data.usersForIntegrationObjects
    } catch(err){
        console.error(err)
    }
}

export const getCashboxesForIntegrationObjects = async({search, legalObject}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client
            .query({
                variables: {search, legalObject},
                query: gql`
                    query ($search: String, $legalObject: ID!) {
                        cashboxesForIntegrationObjects(search: $search, legalObject: $legalObject) {
                            _id
                            name
                        }
                    }`,
            })
        return res.data.cashboxesForIntegrationObjects
    } catch(err){
        console.error(err)
    }
}

export const getClientsForIntegrationObjects = async({search, legalObject}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client
            .query({
                variables: {search, legalObject},
                query: gql`
                    query ($search: String, $legalObject: ID!) {
                        clientsForIntegrationObjects(search: $search, legalObject: $legalObject) {
                            _id
                            name
                            inn
                        }
                    }`,
            })
        return res.data.clientsForIntegrationObjects
    } catch(err){
        console.error(err)
    }
}

export const getIntegrationObjects = async({skip, search, legalObject, type}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client
            .query({
                variables: {skip, search, legalObject, type},
                query: gql`
                    query ($skip: Int, $search: String, $legalObject: ID!, $type: String) {
                        integrationObjects(skip: $skip, search: $search, legalObject: $legalObject, type: $type) {
                            _id
                            createdAt
                            legalObject {_id name}
                            type
                            UUID
                            branch {_id name}
                            user {_id name}
                            cashbox {_id name}
                            client {_id name}
                            item {_id name}
                            district {_id name}
                        }
                    }`,
            })
        return res.data.integrationObjects
    } catch(err){
        console.error(err)
    }
}

export const getIntegrationObjectsCount = async({search, legalObject, type}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, legalObject, type},
                query: gql`
                    query($search: String, $legalObject: ID!, $type: String) {
                        integrationObjectsCount(search: $search, legalObject: $legalObject, type: $type) 
                    }`,
            })
        return res.data.integrationObjectsCount
    } catch(err){
        console.error(err)
    }
}

export const getIntegrationObject = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id: _id},
                query: gql`
                    query ($_id: ID!) {
                        integrationObject(_id: $_id) {
                            _id
                            createdAt
                            legalObject {_id name}
                            type
                            UUID
                            branch {_id name}
                            user {_id name}
                            cashbox {_id name}
                            client {_id name}
                            item {_id name}
                            district {_id name}
                        }
                    }`,
            })
        return res.data.integrationObject
    } catch(err){
        console.error(err)
    }
}

export const deleteIntegrationObject = async(_id)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteIntegrationObject(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addIntegrationObject = async({legalObject, UUID, branch, user, cashbox, client, type, district, item})=>{
    try{
        await (getClientGql()).mutate({
            variables: {legalObject, UUID, branch, user, cashbox, client, type, district, item},
            mutation : gql`
                    mutation ($legalObject: ID!, $UUID: String!, $branch: ID, $user: ID, $cashbox: ID, $client: ID, $district: ID, $item: ID, $type: String!) {
                        addIntegrationObject(legalObject: $legalObject, UUID: $UUID, branch: $branch, user: $user, district: $district, item: $item, cashbox: $cashbox, client: $client, type: $type)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const setIntegrationObject = async({_id, UUID,})=>{
    try{
        await (getClientGql()).mutate({
            variables: {_id, UUID},
            mutation : gql`
                    mutation ($_id: ID!, $UUID: String) {
                        setIntegrationObject(_id: $_id, UUID: $UUID)
                    }`})
    } catch(err){
        console.error(err)
    }
}
import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getCashboxes = async({search, skip, legalObject, branch, filter, all}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, skip, legalObject, branch, filter, all},
                query: gql`
                    query ($skip: Int, $search: String, $legalObject: ID, $branch: ID, $filter: String, $all: Boolean) {
                        cashboxes(skip: $skip, search: $search, legalObject: $legalObject, branch: $branch, filter: $filter, all: $all) {
                            _id
                            createdAt
                            rnmNumber
                            name
                            legalObject {name _id}
                            branch {name _id}
                            presentCashier {name _id role}
                            cash
                            endPayment
                            del
                            sync
                        }
                    }`,
            })
        return res.data.cashboxes
    } catch(err){
        console.error(err)
    }
}

export const getCashboxesCount = async({search, legalObject, branch, filter}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, legalObject, branch, filter},
                query: gql`
                    query ($search: String, $legalObject: ID, $branch: ID, $filter: String) {
                        cashboxesCount(search: $search, legalObject: $legalObject, branch: $branch, filter: $filter)
                    }`,
            })
        return res.data.cashboxesCount
    } catch(err){
        console.error(err)
    }
}

export const getCashboxesTrash = async({search, skip}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, skip},
                query: gql`
                    query ($skip: Int, $search: String) {
                        cashboxesTrash(skip: $skip, search: $search) {
                            _id
                            rnmNumber
                            createdAt
                            name
                            legalObject {name _id}
                            branch {name _id}
                            presentCashier {name _id role}
                            cash
                            del
                            sync
                        }
                    }`,
            })
        return res.data.cashboxesTrash
    } catch(err){
        console.error(err)
    }
}

export const getCashbox = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        cashbox(_id: $_id) {
                            _id
                            createdAt
                            rnmNumber
                            name
                            legalObject {name _id}
                            branch {name _id}
                            presentCashier {name _id role}
                            endPayment
                            cash
                            del
                            sync
                            syncMsg
                        }
                    }`,
            })
        return res.data.cashbox
    } catch(err){
        console.error(err)
    }
}

export const deleteCashbox = async(_id)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteCashbox(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const clearCashbox = async(_id)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        clearCashbox(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const restoreCashbox = async(_id)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        restoreCashbox(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addCashbox = async(element)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($legalObject: ID!, $name: String!, $branch: ID!) {
                        addCashbox(legalObject: $legalObject, name: $name, branch: $branch)
                    }`})
        return res.data.addCashbox
    } catch(err){
        console.error(err)
    }
}

export const _setCashbox = async(element)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $name: String, $branch: ID) {
                        setCashbox(_id: $_id, name: $name, branch: $branch)
                    }`})
    } catch(err){
        console.error(err)
    }
}
import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getBranchs = async({search, skip, legalObject}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, skip, legalObject},
                query: gql`
                    query ($skip: Int, $search: String, $legalObject: ID) {
                        branchs(skip: $skip, search: $search, legalObject: $legalObject) {
                            _id
                            createdAt
                            legalObject {name _id}
                            bType
                            pType
                            ugns
                            name
                            address
                            geo
                            sync
                            del
                        }
                    }`,
            })
        return res.data.branchs
    } catch(err){
        console.error(err)
    }
}

export const getBranchsCount = async({search, legalObject}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, legalObject},
                query: gql`
                    query ($search: String, $legalObject: ID) {
                        branchsCount(search: $search, legalObject: $legalObject)
                    }`,
            })
        return res.data.branchsCount
    } catch(err){
        console.error(err)
    }
}

export const getBranchsTrash = async({search, skip}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, skip},
                query: gql`
                    query ($skip: Int, $search: String) {
                        branchsTrash(skip: $skip, search: $search) {
                            _id
                            createdAt
                            legalObject {name _id}
                            bType
                            pType
                            ugns
                            name
                            address
                            geo
                            sync
                            del
                        }
                    }`,
            })
        return res.data.branchsTrash
    } catch(err){
        console.error(err)
    }
}

export const getBranch = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        branch(_id: $_id) {
                            _id
                            createdAt
                            legalObject {name _id}
                            bType
                            pType
                            ugns
                            name
                            address
                            geo
                            sync
                            syncMsg
                            del
                        }
                    }`,
            })
        return res.data.branch
    } catch(err){
        console.error(err)
    }
}

export const deleteBranch = async(_id)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteBranch(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const restoreBranch = async(_id)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation($_id: ID!) {
                        restoreBranch(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addBranch = async(element)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($legalObject: ID!, $bType: String!, $pType: String!, $ugns: String!, $name: String!, $address: String!, $geo: [Float]) {
                        addBranch(legalObject: $legalObject, bType: $bType, pType: $pType, ugns: $ugns, name: $name, address: $address, geo: $geo)
                    }`})
        return res.data.addBranch
    } catch(err){
        console.error(err)
    }
}

export const _setBranch = async(element)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $bType: String, $pType: String, $ugns: String, $name: String, $address: String, $geo: [Float]) {
                        setBranch(_id: $_id, bType: $bType, pType: $pType, ugns: $ugns, name: $name, address: $address, geo: $geo)
                    }`})
    } catch(err){
        console.error(err)
    }
}
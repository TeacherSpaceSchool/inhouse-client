import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getDistricts = async({search, skip, legalObject}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, skip, legalObject},
                query: gql`
                    query ($skip: Int, $search: String, $legalObject: ID) {
                        districts(skip: $skip, search: $search, legalObject: $legalObject) {
                            _id
                            createdAt
                            legalObject {name _id}
                            name
                            branchs {name _id}
                            cashiers {name _id}
                            supervisors {name _id}
                        }
                    }`,
            })
        return res.data.districts
    } catch(err){
        console.error(err)
    }
}

export const getDistrictsCount = async({search, legalObject}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, legalObject},
                query: gql`
                    query ($search: String, $legalObject: ID) {
                        districtsCount(search: $search, legalObject: $legalObject)
                    }`,
            })
        return res.data.districtsCount
    } catch(err){
        console.error(err)
    }
}

export const getCashiersForDistricts = async({skip, search, legalObject}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, search, legalObject},
                query: gql`
                    query($skip: Int, $search: String, $legalObject: ID!) {
                        cashiersForDistricts(skip: $skip, search: $search, legalObject: $legalObject) {
                            _id
                            createdAt
                            updatedAt
                            lastActive
                            role
                            status
                            name
                            phone
                            legalObject {_id name}
                            branch {_id name}
                            del
                            device
                            notification
                        }
                    }`,
            })
        return res.data.cashiersForDistricts
    } catch(err){
        console.error(err)
    }
}

export const getBranchsForDistricts = async({search, skip, legalObject}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, skip, legalObject},
                query: gql`
                    query ($skip: Int, $search: String, $legalObject: ID!) {
                        branchsForDistricts(skip: $skip, search: $search, legalObject: $legalObject) {
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
        return res.data.branchsForDistricts
    } catch(err){
        console.error(err)
    }
}

export const getDistrict = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        district(_id: $_id) {
                            _id
                            createdAt
                            legalObject {name _id}
                            name
                            branchs {
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
                            cashiers {name _id}
                            supervisors {name _id}
                        }
                    }`,
            })
        return res.data.district
    } catch(err){
        console.error(err)
    }
}

export const deleteDistrict = async(_id)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteDistrict(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addDistrict = async(element)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($legalObject: ID!, $name: String!, $branchs: [ID]!, $cashiers: [ID]!, $supervisors: [ID]!) {
                        addDistrict(legalObject: $legalObject, name: $name, branchs: $branchs, cashiers: $cashiers, supervisors: $supervisors)
                    }`})
        return res.data.addDistrict
    } catch(err){
        console.error(err)
    }
}

export const setDistrict = async(element)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $name: String, $branchs: [ID], $cashiers: [ID], $supervisors: [ID]) {
                        setDistrict(_id: $_id, name: $name, branchs: $branchs, cashiers: $cashiers, supervisors: $supervisors)
                    }`})
    } catch(err){
        console.error(err)
    }
}
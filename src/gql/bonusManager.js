import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getManagerForBonusManagers = async({search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query ($search: String) {
                        managerForBonusManagers(search: $search) {
                            _id
                            name
                        }
                    }`,
            })
        return res.data.managerForBonusManagers
    } catch(err){
        console.error(err)
    }
}

export const getBonusManagers = async({search, skip}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, skip},
                query: gql`
                    query ($skip: Int, $search: String) {
                        bonusManagers(skip: $skip, search: $search) {
                            _id
                            createdAt
                            manager {_id name}
                            bonus
                        }
                    }`,
            })
        return res.data.bonusManagers
    } catch(err){
        console.error(err)
    }
}

export const getBonusManagersCount = async({search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query ($search: String) {
                        bonusManagersCount(search: $search)
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
                    mutation ($manager: ID!, $bonus: [[Float]]!) {
                        addBonusManager(manager: $manager, bonus: $bonus){
                            _id
                            createdAt
                            manager {_id name}
                            bonus
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
                    mutation ($_id: ID!, $bonus: [[Float]]!) {
                        setBonusManager(_id: $_id, bonus: $bonus)
                    }`})
        return res.data.setBonusManager
    } catch(err){
        console.error(err)
    }
}
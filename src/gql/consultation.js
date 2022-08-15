import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getUnloadConsultations = async({manager, store, date}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {manager, store, date},
            query: gql`
                    query ($manager: ID, $store: ID, $date: Date) {
                        unloadConsultations(manager: $manager, store: $store, date: $date)
                    }`,
        })
        return res.data.unloadConsultations
    } catch(err){
        console.error(err)
    }
}

export const getConsultationsCount = async({manager, store, date}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {manager, store, date},
                query: gql`
                    query ($manager: ID, $store: ID, $date: Date) {
                        consultationsCount(manager: $manager, store: $store, date: $date)
                    }`,
            })
        return res.data.consultationsCount
    } catch(err){
        console.error(err)
    }
}

export const getConsultations = async({skip, manager, store, date, active}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, manager, store, date, active},
                query: gql`
                    query ($skip: Int, $manager: ID, $store: ID, $date: Date, $active: Boolean) {
                        consultations(skip: $skip, manager: $manager, store: $store, date: $date, active: $active) {
                            _id
                            createdAt
                            manager {name _id}
                            store {name _id}
                            end
                        }
                    }`,
            })
        return res.data.consultations
    } catch(err){
        console.error(err)
    }
}

export const startConsultation = async()=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            mutation : gql`
                    mutation {
                        startConsultation {
                            _id
                            createdAt
                            manager {name _id}
                            end
                        }
                    }`})
        return res.data.startConsultation
    } catch(err){
        console.error(err)
    }
}

export const endConsultation = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID) {
                        endConsultation(_id: $_id) 
                    }`})
        return res.data.endConsultation
    } catch(err){
        console.error(err)
    }
}
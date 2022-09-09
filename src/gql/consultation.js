import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getConsultations = async({skip, manager, store, active, dateStart, dateEnd, operation}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, manager, store, active, dateStart, dateEnd, operation},
                query: gql`
                    query ($skip: Int, $manager: ID, $store: ID, $active: Boolean, $dateStart: Date, $dateEnd: Date, $operation: String) {
                        consultations(skip: $skip, manager: $manager, active: $active, store: $store, dateStart: $dateStart, dateEnd: $dateEnd, operation: $operation) {
                            _id
                            createdAt
                            manager {name _id}
                            store {name _id}
                            client {name _id}
                            operation
                            info
                            end
                            statusClient
                        }
                    }`,
            })
        return res.data.consultations
    } catch(err){
        console.error(err)
    }
}

export const getUnloadConsultations = async({manager, store, dateStart, dateEnd, operation}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {manager, store, dateStart, dateEnd, operation},
            query: gql`
                    query ($manager: ID, $store: ID, $dateStart: Date, $dateEnd: Date, $operation: String) {
                        unloadConsultations(manager: $manager, store: $store, dateStart: $dateStart, dateEnd: $dateEnd, operation: $operation)
                    }`,
        })
        return res.data.unloadConsultations
    } catch(err){
        console.error(err)
    }
}

export const getConsultationsCount = async({manager, store, dateStart, dateEnd, operation}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {manager, store, dateStart, dateEnd, operation},
                query: gql`
                    query ($manager: ID, $store: ID, $dateStart: Date, $dateEnd: Date, $operation: String) {
                        consultationsCount(manager: $manager, store: $store, dateStart: $dateStart, dateEnd: $dateEnd, operation: $operation)
                    }`,
            })
        return res.data.consultationsCount
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
                            client {name _id}
                            operation
                            info
                            end
                            statusClient
                        }
                    }`})
        return res.data.startConsultation
    } catch(err){
        console.error(err)
    }
}

export const setConsultation = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($info: String, $client: ID, $statusClient: String, $operation: String) {
                        setConsultation(info: $info, client: $client, statusClient: $statusClient, operation: $operation) 
                    }`})
        return res.data.setConsultation
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


import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const uploadingClients = async({document, legalObject}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .mutate({
                variables: {document, legalObject},
                mutation: gql`
                    mutation ($document: Upload!, $legalObject: ID!) {
                        uploadingClients(document: $document, legalObject: $legalObject) 
                    }`,
            })
        return res.data.uploadingClients
    } catch(err){
        console.error(err)
    }
}

export const uploadingItems = async({document, legalObject}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .mutate({
                variables: {document, legalObject},
                mutation: gql`
                    mutation ($document: Upload!, $legalObject: ID!) {
                        uploadingItems(document: $document, legalObject: $legalObject) 
                    }`,
            })
        return res.data.uploadingItems
    } catch(err){
        console.error(err)
    }
}

export const uploadingDistricts = async({document, legalObject}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .mutate({
                variables: {document, legalObject},
                mutation: gql`
                    mutation ($document: Upload!, $legalObject: ID!) {
                        uploadingDistricts(document: $document, legalObject: $legalObject) 
                    }`,
            })
        return res.data.uploadingDistricts
    } catch(err){
        console.error(err)
    }
}

export const getStatisticStorageSize = async(client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                query: gql`
                    query {
                        statisticStorageSize {
                            columns
                            row 
                                {_id data}
                        }
                    }`,
            })
        return res.data.statisticStorageSize
    } catch(err){
        console.error(err)
    }
}

export const getStatisticActivityLegalObject = async({agent, type}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {agent, type},
                query: gql`
                    query($agent: ID, $type: String) {
                        statisticActivityLegalObject(agent: $agent, type: $type) {
                            columns
                            row 
                                {_id data}
                        }
                    }`,
            })
        return res.data.statisticActivityLegalObject
    } catch(err){
        console.error(err)
    }
}

export const getStatisticExpiredWorkShifts = async(client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                query: gql`
                    query {
                        statisticExpiredWorkShifts {
                            columns
                            row 
                                {_id data}
                        }
                    }`,
            })
        return res.data.statisticExpiredWorkShifts
    } catch(err){
        console.error(err)
    }
}

export const getStatisticPayment = async({dateStart}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {dateStart},
                query: gql`
                    query($dateStart: Date) {
                        statisticPayment(dateStart: $dateStart) {
                            columns
                            row 
                                {_id data}
                        }
                    }`,
            })
        return res.data.statisticPayment
    } catch(err){
        console.error(err)
    }
}

export const getStatisticIntegration = async(client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                query: gql`
                    query {
                        statisticIntegration {
                            columns
                            row 
                                {_id data}
                        }
                    }`,
            })
        return res.data.statisticIntegration
    } catch(err){
        console.error(err)
    }
}

export const getStatisticSyncKKM = async(client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                query: gql`
                    query {
                        statisticSyncKKM {
                            columns
                            row 
                                {_id data}
                        }
                    }`,
            })
        return res.data.statisticSyncKKM
    } catch(err){
        console.error(err)
    }
}

export const getStatisticSale = async({dateStart, dateType, type, legalObject, branch}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {dateStart, dateType, type, legalObject, branch},
                query: gql`
                    query($dateStart: Date, $dateType: String, $type: String, $legalObject: ID, $branch: ID) {
                        statisticSale(dateStart: $dateStart, dateType: $dateType, type: $type, legalObject: $legalObject, branch: $branch) {
                            columns
                            row 
                                {_id data}
                        }
                    }`,
            })
        return res.data.statisticSale
    } catch(err){
        console.error(err)
    }
}

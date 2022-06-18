import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const geTtpDataByINNforBusinessActivity = async(inn)=>{
    try{
        let client = getClientGql()
        let res = await client
            .query({
                variables: {inn},
                query: gql`
                    query($inn: String) {
                        tpDataByINNforBusinessActivity(inn: $inn) {
                            inn
                            rayonCode
                            fullName
                            ZIP
                            fullAddress
                            message
                        }
                    }`,
            })
        return res.data.tpDataByINNforBusinessActivity
    } catch(err){
        console.error(err)
    }
}

export const getFullDeleteLegalObjects = async({skip}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client.mutate({
            variables: {skip},
            mutation : gql`
                    query ($skip: Int) {
                        fullDeleteLegalObjects(skip: $skip) {
                            _id
                            createdAt
                            legalObject
                            status
                            end
                        }
                    }`})
        return res.data.fullDeleteLegalObjects
    } catch(err) {
        console.error(err)
    }
}

export const getLegalObjects = async({skip, search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, search},
                query: gql`
                    query($skip: Int, $search: String) {
                        legalObjects(skip: $skip, search: $search) {
                            _id
                            createdAt
                            name 
                            inn 
                            address 
                            email
                            phone 
                            status 
                            _id 
                            del
                            sync
                        }
                    }`,
            })
        return res.data.legalObjects
    } catch(err){
        console.error(err)
    }
}

export const getLegalObjectsCount = async({search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query($search: String) {
                        legalObjectsCount(search: $search) 
                    }`,
            })
        return res.data.legalObjectsCount
    } catch(err){
        console.error(err)
    }
}

export const getLegalObjectsTrash = async({skip, search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, search},
                query: gql`
                    query($skip: Int, $search: String) {
                        legalObjectsTrash(skip: $skip, search: $search) {
                            _id
                            createdAt
                            name 
                            inn 
                            address 
                            phone 
                            status 
                            email
                            sync
                            _id 
                            del
                        }
                    }`,
            })
        return res.data.legalObjectsTrash
    } catch(err){
        console.error(err)
    }
}


export const getLegalObject = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        legalObject(_id: $_id) {
                            _id
                            createdAt
                            name
                            inn
                            address
                            phone
                            status
                            taxpayerType
                            ugns
                            email
                            responsiblePerson
                            del
                            ofd
                            syncMsg
                            sync
                            rateTaxe
                            agent {_id name}
                            ndsType
                            nspType
                        }
                    }`,
            })
        return res.data.legalObject
    } catch(err){
        console.error(err)
    }
}

export const deleteLegalObject = async(_id)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteLegalObject(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const onoffLegalObject = async(_id)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        onoffLegalObject(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const restoreLegalObject = async(_id)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        restoreLegalObject(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const fullDeleteLegalObject = async(element)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!) {
                        fullDeleteLegalObject(_id: $_id)
                    }`})
        return res.data.fullDeleteLegalObject
    } catch(err){
        console.error(err)
    }
}

export const addLegalObject = async(element)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($agent: ID, $name: String!, $rateTaxe: String!, $ofd: Boolean!, $ndsType: String!, $nspType: String!, $inn: String!, $email: [String]!, $address: String!, $phone: [String]!, $taxpayerType: String!, $ugns: String!, $responsiblePerson: String!) {
                        addLegalObject(agent: $agent, name: $name, ofd: $ofd, rateTaxe: $rateTaxe, inn: $inn, ndsType: $ndsType, nspType: $nspType, email: $email, address: $address, phone: $phone, taxpayerType: $taxpayerType, ugns: $ugns, responsiblePerson: $responsiblePerson)
                    }`})
        return res.data.addLegalObject
    } catch(err){
        console.error(err)
    }
}

export const setLegalObject = async(element)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($agent: ID, $_id: ID!, $name: String, $rateTaxe: String, $ofd: Boolean, $email: [String], $ndsType: String, $nspType: String, $address: String, $phone: [String], $taxpayerType: String, $ugns: String, $responsiblePerson: String) {
                        setLegalObject(agent: $agent, _id: $_id, ofd: $ofd, name: $name, rateTaxe: $rateTaxe, email: $email, address: $address, ndsType: $ndsType, nspType: $nspType, phone: $phone, taxpayerType: $taxpayerType, ugns: $ugns, responsiblePerson: $responsiblePerson)
                    }`})
    } catch(err){
        console.error(err)
    }
}
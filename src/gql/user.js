import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getDepartments = async({search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: { search },
                query: gql`
                    query($search: String) {
                       departments(search: $search) {
                            name
                        }
                    }`,
            })
        return res.data.departments
    } catch(err){
        console.error(err)
    }
}

export const getPositions = async({search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: { search },
                query: gql`
                    query($search: String) {
                       positions(search: $search) {
                            name
                        }
                    }`,
            })
        return res.data.positions
    } catch(err){
        console.error(err)
    }
}

export const getUsers = async({skip, search, store, role, limit, department, position}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, search, store, role, limit, department, position},
                query: gql`
                    query($skip: Int, $search: String, $store: ID, $role: String, $limit: Int, $department: String, $position: String) {
                        users(skip: $skip, search: $search, store: $store, role: $role, limit: $limit, department: $department, position: $position) {
                            _id
                            role
                            name
                        }
                    }`,
            })
        return res.data.users
    } catch(err){
        console.error(err)
    }
}

export const getUsersCount = async({store, role, department, position}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {store, role, department, position},
                query: gql`
                    query($store: ID, $role: String, $department: String, $position: String) {
                        usersCount(store: $store, role: $role, department: $department, position: $position) 
                    }`,
            })
        return res.data.usersCount
    } catch(err){
        console.error(err)
    }
}

export const checkLogin = async({login}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {login},
                query: gql`
                    query($login: String!) {
                        checkLogin(login: $login) 
                    }`,
            })
        return res.data.checkLogin
    } catch(err){
        console.error(err)
    }
}

export const getUser = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        user(_id: $_id) {
                            _id
                            createdAt
                            updatedAt
                            lastActive
                            login
                            role
                            status
                            IP
                            name
                            phones
                            device
                            notification
                            store {_id name}
                            cashbox {_id name}
                            department
                            position
                            startWork
                            add
                            edit
                            deleted
                        }
                    }`,
            })
        return res.data.user
    } catch(err){
        console.error(err)
    }
}

export const deleteUser = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteUser(_id: $_id)
                    }`})
        return res.data.deleteUser
    } catch(err){
        console.error(err)
    }
}

export const addUser = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($add: Boolean!, $cashbox: ID, $edit: Boolean!, $deleted: Boolean!, $login: String!, $password: String!, $role: String!, $name: String!, $phones: [String]!, $store: ID, $department: String!, $position: String!, $startWork: Date) {
                        addUser(add: $add, cashbox: $cashbox, edit: $edit, deleted: $deleted, login: $login, password: $password, role: $role, name: $name, phones: $phones, store: $store, department: $department, position: $position, startWork: $startWork)
                    }`})
        return res.data.addUser
    } catch(err){
        console.error(err)
    }
}

export const setUser = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($add: Boolean, $cashbox: ID, $edit: Boolean, $deleted: Boolean, $_id: ID!, $status: String, , $login: String, $password: String, $name: String, $phones: [String], $store: ID, $department: String, $position: String, $startWork: Date) {
                        setUser(add: $add, cashbox: $cashbox, edit: $edit, deleted: $deleted, _id: $_id, status: $status, login: $login, password: $password, name: $name, phones: $phones, store: $store, department: $department, position: $position, startWork: $startWork)
                    }`})
        return res.data.setUser
    } catch(err){
        console.error(err)
    }
}

export const setDevice = async(device, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client.mutate({
            variables: {device},
            mutation : gql`
                    mutation ($device: String!) {
                        setDevice(device: $device)
                    }`})
        return res.data.setDevice
    } catch(err){
        console.error(err)
    }
}

export const getUnloadUsers = async({store, role, department, position}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {store, role, department, position},
            query: gql`
                    query ($store: ID, $role: String, $department: String, $position: String) {
                        unloadUsers(store: $store, role: $role, department: $department, position: $position)
                    }`,
        })
        return res.data.unloadUsers
    } catch(err){
        console.error(err)
    }
}

export const uploadUser = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($document: Upload!) {
                        uploadUser(document: $document) 
                    }`})
        return res.data.uploadUser
    } catch(err){
        console.error(err)
    }
}
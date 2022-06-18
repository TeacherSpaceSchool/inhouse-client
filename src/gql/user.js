import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getUsers = async({skip, search, legalObject, branch, role}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, search, branch, legalObject: legalObject==='super'?undefined:legalObject, role},
                query: gql`
                    query($skip: Int, $search: String, $branch: ID, $legalObject: ID, $role: String) {
                        users(skip: $skip, search: $search, branch: $branch, legalObject: $legalObject, role: $role) {
                            _id
                            createdAt
                            updatedAt
                            lastActive
                            role
                            status
                            statistic
                            add
                            credit
                            payment
                            email
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
        return res.data.users
    } catch(err){
        console.error(err)
    }
}

export const getUsersCount = async({search, legalObject, branch, role}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, branch, legalObject: legalObject==='super'?undefined:legalObject, role},
                query: gql`
                    query($search: String, $legalObject: ID, $branch: ID, $role: String) {
                        usersCount(search: $search, legalObject: $legalObject, branch: $branch, role: $role) 
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

export const getUsersTrash = async({skip, search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, search},
                query: gql`
                    query($skip: Int, $search: String) {
                        usersTrash(skip: $skip, search: $search) {
                            _id
                            createdAt
                            updatedAt
                            lastActive
                            login
                            role
                            status
                            name
                            email
                            statistic
                            add
                            credit
                            payment
                            phone
                            legalObject {_id name}
                            branch {_id name}
                            del
                            device
                            notification
                        }
                    }`,
            })
        return res.data.usersTrash
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
                            IP
                            createdAt
                            updatedAt
                            lastActive
                            enteredDate
                            login
                            role
                            status
                            statistic
                            add
                            credit
                            payment
                            name
                            phone
                            legalObject {_id name}
                            branch {_id name}
                            del
                            email
                            device
                            notification
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
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteUser(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const onoffUser = async(_id)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        onoffUser(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const restoreUser = async(_id)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        restoreUser(_id: $_id)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addUser = async(element)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($login: String!, $statistic: Boolean!, $email: [String]!, $add: Boolean!, $credit: Boolean!, $payment: Boolean!, $password: String!, $role: String!, $name: String!, $phone: [String]!, $legalObject: ID, $branch: ID) {
                        addUser(login: $login, password: $password, email: $email, statistic: $statistic, add: $add, credit: $credit, payment: $payment, role: $role, name: $name, phone: $phone, legalObject: $legalObject, branch: $branch)
                    }`})
        return res.data.addUser
    } catch(err){
        console.error(err)
    }
}

export const setUser = async(element)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $statistic: Boolean, $email: [String], $add: Boolean, $credit: Boolean, $payment: Boolean, $login: String, $password: String, $name: String, $phone: [String], $branch: ID) {
                        setUser(_id: $_id, login: $login, statistic: $statistic, email: $email, add: $add, credit: $credit, payment: $payment, password: $password, name: $name, phone: $phone, branch: $branch)
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const setDevice = async(device, client)=>{
    try{
        client = client? client : getClientGql()
        await client.mutate({
            variables: {device},
            mutation : gql`
                    mutation ($device: String!) {
                        setDevice(device: $device)
                    }`})
    } catch(err){
        console.error(err)
    }
}
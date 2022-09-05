import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getUnloadTasks = async({status, search, employment}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {status, search, employment},
            query: gql`
                    query ($status: String, $search: String, $employment: ID) {
                        unloadTasks(status: $status, search: $search, employment: $employment)
                    }`,
        })
        return res.data.unloadTasks
    } catch(err){
        console.error(err)
    }
}

export const getTask = async({_id}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {_id},
                query: gql`
                    query ($_id: ID!) {
                        task(_id: $_id) {
                            _id
                            createdAt
                            who {_id name}
                            whom {_id name}
                            date
                            status
                            info
                        }
                    }`,
            })
        return res.data.task
    } catch(err){
        console.error(err)
    }
}

export const getTasks = async({status, search, skip, limit, employment}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
                variables: {status, search, skip, limit, employment},
                query: gql`
                    query ($status: String, $search: String, $skip: Int, $limit: Int, $employment: ID) {
                        tasks(status: $status, search: $search, skip: $skip, limit: $limit, employment: $employment) {
                            _id
                            createdAt
                            who {_id name}
                            whom {_id name}
                            date
                            status
                            info
                        }
                    }`,
            })
        return res.data.tasks
    } catch(err){
        console.error(err)
    }
}

export const getTasksCount = async({search, status, employment}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search, status, employment},
                query: gql`
                    query ($search: String, $status: String, $employment: ID) {
                        tasksCount(search: $search, status: $status, employment: $employment)
                    }`,
            })
        return res.data.tasksCount
    } catch(err){
        console.error(err)
    }
}

export const deleteTask = async(_id)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {_id},
            mutation : gql`
                    mutation ($_id: ID!) {
                        deleteTask(_id: $_id)
                    }`})
        return res.data.deleteTask
    } catch(err){
        console.error(err)
    }
}

export const setTask = async(variables, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($_id: ID!, $date: Date, $status: String, $info: String) {
                        setTask(_id: $_id, date: $date, status: $status, info: $info) 
                    }`})
        return res.data.setTask
    } catch(err){
        console.error(err)
    }
}

export const addTask = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($whom: ID!, $date: Date!, $info: String!) {
                        addTask(whom: $whom, date: $date, info: $info) 
                    }`})
        return res.data.addTask
    } catch(err){
        console.error(err)
    }
}
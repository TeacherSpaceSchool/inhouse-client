import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getNotificationStatistics = async({skip, search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, search},
                query: gql`
                    query ($skip: Int, $search: String!){
                        notificationStatistics(skip: $skip, search: $search) {
                            _id
                            createdAt
                            title
                            text
                            delivered
                            failed
                            tag
                            url
                            click
                        }
                    }`,
            })
        return res.data.notificationStatistics
    } catch(err){
        console.error(err)
    }
}

export const getNotificationStatisticCount = async({search}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {search},
                query: gql`
                    query ($search: String!){
                        notificationStatisticsCount(search: $search)
                    }`,
            })
        return res.data.notificationStatisticsCount
    } catch(err){
        console.error(err)
    }
}

export const addNotificationStatistic = async(element)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($text: String!, $title: String!, $tag: String, $url: String, $icon: Upload) {
                        addNotificationStatistic(text: $text, title: $title, tag: $tag, url: $url, icon: $icon) {
                            _id
                            createdAt
                            title
                            text
                            delivered
                            failed
                            tag
                            url
                            click
                        }
                    }`})
        return res.data.addNotificationStatistic
    } catch(err){
        console.error(err)
    }
}
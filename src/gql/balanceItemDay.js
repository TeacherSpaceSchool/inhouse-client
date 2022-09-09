import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getBalanceItemDays = async({item, skip, sort, warehouse, store, dateStart, dateEnd}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {item, skip, sort, warehouse, store, dateStart, dateEnd},
                query: gql`
                    query ($item: ID, $skip: Int, $sort: String, $warehouse: ID, $store: ID, $dateStart: Date, $dateEnd: Date) {
                        balanceItemDays(item: $item, skip: $skip, sort: $sort, warehouse: $warehouse, store: $store, dateStart: $dateStart, dateEnd: $dateEnd) {
                            _id
                            date
                            item {_id name unit factory {name} category {name}}
                            warehouse {_id name}
                            store {_id name}
                            startAmount
                            endAmount
                            plus
                            minus
                        }
                    }`,
            })
        return res.data.balanceItemDays
    } catch(err){
        console.error(err)
    }
}

export const getBalanceItemDaysCount = async({item, warehouse, store, dateStart, dateEnd}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {item, warehouse, store, dateStart, dateEnd},
                query: gql`
                    query ($item: ID, $warehouse: ID, $store: ID, $dateStart: Date, $dateEnd: Date) {
                        balanceItemDaysCount(item: $item, warehouse: $warehouse, store: $store, dateStart: $dateStart, dateEnd: $dateEnd)
                    }`,
            })
        return res.data.balanceItemDaysCount
    } catch(err){
        console.error(err)
    }
}

export const getUnloadBalanceItemDays = async({item, warehouse, store, dateStart, dateEnd}, client)=>{
    let res
    try{
        client = client? client : getClientGql()
        res = await client.query({
            variables: {item, warehouse, store, dateStart, dateEnd},
            query: gql`
                    query ($item: ID, $warehouse: ID, $store: ID, $dateStart: Date, $dateEnd: Date) {
                        unloadBalanceItemDays(item: $item, warehouse: $warehouse, store: $store, dateStart: $dateStart, dateEnd: $dateEnd)
                    }`,
        })
        return res.data.unloadBalanceItemDays
    } catch(err){
        console.error(err)
    }
}
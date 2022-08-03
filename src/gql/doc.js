import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getDoc = async(client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                query: gql`
                    query {
                        doc {
                            _id
                            name
                            address
                            inn
                            okpo
                            bank
                            court
                            wallet
                            phoneCheckInstallment
                            bik
                            account
                            director
                        }
                    }`,
            })
        return res.data.doc
    } catch(err){
        console.error(err)
    }
}

export const setDoc = async(variables)=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables,
            mutation : gql`
                    mutation ($name: String!, $court: String!, $wallet: String!, $phoneCheckInstallment: String!, $address: String!, $inn: String!, $okpo: String!, $bank: String!, $bik: String!, $account: String!, $director: String!) {
                        setDoc(name: $name, address: $address, court: $court, wallet: $wallet, phoneCheckInstallment: $phoneCheckInstallment, inn: $inn, okpo: $okpo, bank: $bank, bik: $bik, account: $account, director: $director) 
                    }`})
        return res.data.setDoc
    } catch(err){
        console.error(err)
    }
}
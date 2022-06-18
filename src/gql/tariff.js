import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getTariffs = async({skip, last}, client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                variables: {skip, last},
                query: gql`
                    query ($skip: Int, $last: Boolean) {
                        tariffs(skip: $skip, last: $last) {
                            _id
                            createdAt
                            user {_id role name}
                            pkkm
                            ofd
                        }
                    }`,
            })
        return res.data.tariffs
    } catch(err){
        console.error(err)
    }
}

export const addTariff = async({pkkm, ofd})=>{
    try{
        const client = getClientGql()
        let res = await client.mutate({
            variables: {pkkm, ofd},
            mutation : gql`
                    mutation ($pkkm: Int!, $ofd: Int!) {
                        addTariff(pkkm: $pkkm, ofd: $ofd) {
                            _id
                            createdAt
                            user {_id role name}
                            pkkm
                            ofd
                        }
                    }`})
        return res.data.addTariff
    } catch(err){
        console.error(err)
    }
}
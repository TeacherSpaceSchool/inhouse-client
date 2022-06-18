import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const scanner = async(img)=>{
    try{
        const client = getClientGql()
        let res = await client
            .query({
                variables: {img},
                query: gql`
                    query ($img: String) {
                        scanner(img: $img)
                    }`,
            })
        return res.data.scanner
    } catch(err){
        console.error(err)
    }
}

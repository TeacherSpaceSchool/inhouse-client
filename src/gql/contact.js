import { gql } from '@apollo/client';
import { getClientGql } from '../apollo';

export const getContact = async(client)=>{
    try{
        client = client? client : getClientGql()
        let res = await client
            .query({
                query: gql`
                    query {
                        contact {
                            name
                            addresses {address geo}
                            email
                            phone
                            info
                            whatsapp
                            social
                            _id
                          }
                    }`,
            })
        return res.data.contact
    } catch(err){
        console.error(err)
    }
}

export const setContact = async(element)=>{
    try{
        const client = getClientGql()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ( $whatsapp: [Boolean]!, $name: String!, $addresses: [AddressInput]!, $info: String!, $email: [String]!, $phone: [String]!, $social: [String]!) {
                        setContact(name: $name, whatsapp: $whatsapp, addresses: $addresses, email: $email, info: $info, phone: $phone, social: $social)
                    }`})
    } catch(err){
        console.error(err)
    }
}
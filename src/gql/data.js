import { gql } from '@apollo/client';



export const subscriptionData = gql`
  subscription  {
    reloadData {
        type
        ids
        roles
        message
    }
  }
`
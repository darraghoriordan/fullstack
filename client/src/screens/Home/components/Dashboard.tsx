import * as React from 'react'
// import { View } from 'react-native'
// import { useDeployStatesQuery } from '../../../generated/graphql'
// import { distanceInWordsToNow } from 'date-fns'
import gql from 'graphql-tag'
import TestEnvironmentPanel from './TestEnvironmentPanel'
import environmentConfiguration from '../../../utils/environmentConfiguration'
import styled from 'styled-components'
import { View } from 'react-native'

export const GET_ALL_DEPLOYSTATES = gql`
  query DeployStates {
    deployStates {
      order
      name
      currentBranch
      currentBranchUri
      deployedOn
      deployedBy
      workItemNumber
      workItemTitle
      workItemUri
      buildNumer
      buildUri
    }
  }
`
const DashboardContainer = styled(View)`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`
const Dashboard = () => {
  // const { data, loading } = useDeployStatesQuery()

  //   return loading ? (
  //     <span>Loading...</span>
  //   ) : (
  //     <View>
  //       {data && (
  //         <table>
  //           <thead>
  //             <tr>
  //               <th>Environment</th>
  //               <th>Current Branch</th>
  //               <th>Deployed By</th>
  //               <th>Deployed</th>
  //               <th>Work Item</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {(data.deployStates as any[]).map(element => (
  //               <tr key={element.name}>
  //                 <td>{element.name}</td>
  //                 <td>
  //                   <a href={element.currentBranchUri}>{element.currentBranch}</a>
  //                 </td>
  //                 <td>{element.deployedBy}</td>
  //                 <td>{distanceInWordsToNow(new Date(element.deployedOn)) + ' ago'}</td>
  //                 <td>
  //                   (
  //                   <a title={element.workItemTitle} href={element.workItemUri}>
  //                     {element.workItemNumber}
  //                   </a>
  //                   ) {truncateTitle(element.workItemTitle, 30)}
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       )}
  //     </View>
  //   )
  return (
    <DashboardContainer>
      {environmentConfiguration.map(element => (
        <TestEnvironmentPanel {...element} />
      ))}
    </DashboardContainer>
  )
}

// const truncateTitle = (fullTitle: string, length: number) => {
//   if (fullTitle.length > length) {
//     return fullTitle.substring(0, length - 1) + '...'
//   }

//   return fullTitle
// }

export default Dashboard

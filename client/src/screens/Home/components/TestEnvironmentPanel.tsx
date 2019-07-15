import { View } from 'react-native'
import gql from 'graphql-tag'
import { useGetDeployStateQuery } from '../../../generated/graphql'
import { distanceInWordsToNow } from 'date-fns'

export const GET_SINGLE_DEPLOY_STATE = gql`
  query GetDeployState($deployStateRequest: DeployStateRequest!) {
    deployState(deployStateRequest: $deployStateRequest) {
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

const TestEnvironmentPanel = () => {
  const { data, loading } = useGetDeployStateQuery()

  return loading ? (
    <span>Loading...</span>
  ) : (
    <View>
      {data &&
        // <table>
        //   <thead>
        //     <tr>
        //       <th>Environment</th>
        //       <th>Current Branch</th>
        //       <th>Deployed By</th>
        //       <th>Deployed</th>
        //       <th>Work Item</th>
        //     </tr>
        //   </thead>
        //   <tbody>
        //     {(data.deployStates as any[]).map(element => (
        //       <tr key={element.name}>
        //         <td>{element.name}</td>
        //         <td>
        //           <a href={element.currentBranchUri}>{element.currentBranch}</a>
        //         </td>
        //         <td>{element.deployedBy}</td>
        //         <td>{distanceInWordsToNow(new Date(element.deployedOn)) + ' ago'}</td>
        //         <td>
        //           (
        //           <a title={element.workItemTitle} href={element.workItemUri}>
        //             {element.workItemNumber}
        //           </a>
        //           ) {truncateTitle(element.workItemTitle, 30)}
        //         </td>
        //       </tr>
        //     ))}
        //   </tbody>
        // </table>
        true}
    </View>
  )
}

const truncateTitle = (fullTitle: string, length: number) => {
  if (fullTitle.length > length) {
    return fullTitle.substring(0, length - 1) + '...'
  }

  return fullTitle
}

export default TestEnvironmentPanel

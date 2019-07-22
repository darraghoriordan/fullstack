import { View } from 'react-native'
import gql from 'graphql-tag'
import { useGetDeployStateQuery } from '../../../generated/graphql'
import { distanceInWordsToNow } from 'date-fns'
import * as React from 'react'
import styled from 'styled-components'

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
interface TestEnvironmentPanelProps {
  displayOrder: number
  displayName: string
  releaseEnvironmentName: string
  releaseDefinitionId: number
  definitionEnvironmentId: number
  artifactAlias: string
}

const TestEnvironmentContainer = styled(View)`
  width: 100%;
  margin: 10px;
  flex: 1 1 calc(33.33% - 20px);
`

const TestEnvironmentPanel = ({
  displayOrder,
  displayName,
  releaseEnvironmentName,
  releaseDefinitionId,
  definitionEnvironmentId,
  artifactAlias,
}: TestEnvironmentPanelProps) => {
  const { data, loading } = useGetDeployStateQuery({
    variables: {
      deployStateRequest: {
        displayOrder: displayOrder,
        displayName: displayName,
        releaseEnvironmentName: releaseEnvironmentName,
        releaseDefinitionId: releaseDefinitionId,
        definitionEnvironmentId: definitionEnvironmentId,
        artifactAlias: artifactAlias,
      },
    },
  })

  return loading ? (
    <span>Loading...</span>
  ) : (
    <TestEnvironmentContainer>
      {data && (
        <div>
          <h2>{data.deployState.name}</h2>
          <p>{data.deployState.deployedOn}</p>
          <p>{distanceInWordsToNow(new Date(data.deployState.deployedOn)) + ' ago'}</p>
          <p>{truncateTitle(data.deployState.workItemTitle, 30)}</p>
        </div>
      )}
    </TestEnvironmentContainer>
  )
}
// <td>
//   <a href={element.currentBranchUri}>{element.currentBranch}</a>
// </td>
// <td>{element.deployedBy}</td>
//
// <td>
//   (
//   <a title={element.workItemTitle} href={element.workItemUri}>
//     {element.workItemNumber}
//   </a>
//   ) {truncateTitle(element.workItemTitle, 30)}
// </td>
const truncateTitle = (fullTitle: string, length: number) => {
  if (fullTitle.length > length) {
    return fullTitle.substring(0, length - 1) + '...'
  }

  return fullTitle
}

export default TestEnvironmentPanel

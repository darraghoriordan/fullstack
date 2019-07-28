import { View } from 'react-native'
import gql from 'graphql-tag'
import { useGetDeployStateQuery } from '../../../generated/graphql'
import { distanceInWordsToNow, format } from 'date-fns'
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
const OverflowContainer = styled.div`
  overflow-y: auto;
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
    <TestEnvironmentContainer>
      <h2>{displayName}</h2>
      <span>Loading...</span>
    </TestEnvironmentContainer>
  ) : (
    <TestEnvironmentContainer>
      {data && (
        <OverflowContainer>
          <h2>{data.deployState.name}</h2>
          <p>
            <a href={data.deployState.buildUri}>{data.deployState.buildNumer}</a> by{' '}
            {data.deployState.deployedBy}
          </p>
          <p title={format(new Date(data.deployState.deployedOn), 'YYYY-MM-DD hh:mma')}>
            {distanceInWordsToNow(new Date(data.deployState.deployedOn)) + ' ago'}
          </p>
          <p>
            see branch{' '}
            <a href={data.deployState.currentBranchUri}>{data.deployState.currentBranch}</a>
          </p>
          <p></p>
          <p>{data.deployState.workItemNumber}</p>
          <p>{data.deployState.workItemUri}</p>
        </OverflowContainer>
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
// const truncateTitle = (fullTitle: string, length: number) => {
//   if (fullTitle.length > length) {
//     return fullTitle.substring(0, length - 1) + '...'
//   }

//   return fullTitle
// }

export default TestEnvironmentPanel

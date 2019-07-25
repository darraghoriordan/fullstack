import * as React from 'react'
// import styled from 'styled-components'
import { View } from 'react-native'
import gql from 'graphql-tag'
import { useGetStagingStateQuery } from '../../../generated/graphql'
import environmentConfiguration from '../../../utils/environmentConfiguration'

export const GET_STAGING_STATE = gql`
  query GetStagingState($stagingEnvironmentStateRequest: StagingEnvironmentStateRequest!) {
    stagingEnvironmentState(stagingEnvironmentStateRequest: $stagingEnvironmentStateRequest) {
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

// const DashboardContainer = styled(View)`
//   display: flex;
//   flex-flow: row wrap;
//   justify-content: space-between;
// `
interface StagingStateProps {
  releaseEnvironmentName: string
  releaseDefinitionId: number
  definitionEnvironmentId: number
  artifactAlias: string
}

const Staging = () => {
  var stagingConfig = environmentConfiguration.filter(x => x.displayName.startsWith('Staging'))
  var testState: StagingStateProps = { ...stagingConfig[0] }

  const { data, loading } = useGetStagingStateQuery({
    variables: {
      stagingEnvironmentStateRequest: {
        artifactAlias: testState.artifactAlias,
        definitionEnvironmentId: testState.definitionEnvironmentId,
        releaseDefinitionId: testState.releaseDefinitionId,
        releaseEnvironmentName: testState.releaseEnvironmentName,
      },
    },
  })

  return loading ? (
    <div>
      <span>Loading...</span>
    </div>
  ) : (
    <View>
      {data && (
        <div>
          <h1>Staging</h1>
          <div>
            <h2> Current State</h2>
            <p>
              <a href={data.stagingEnvironmentState.buildUri}>
                {data.stagingEnvironmentState.buildNumer}
              </a>{' '}
              by {data.stagingEnvironmentState.deployedBy}
            </p>
            <p>5 hours ago</p>
            <p>State of build</p>
          </div>
          <div>
            <h2>Deploy new</h2>
            <p>Build 1 by doriordan</p>
            <ul>
              <li>work item</li>
              <li>work item</li>
            </ul>
            <p>Build 2 by doriordan</p>
            <ul>
              <li>work item</li>
              <li>work item</li>
            </ul>
          </div>
        </div>
      )}
    </View>
  )
}

export default Staging

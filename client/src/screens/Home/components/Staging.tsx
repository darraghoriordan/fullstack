import * as React from 'react'
// import styled from 'styled-components'
import { View } from 'react-native'
import gql from 'graphql-tag'
import { useGetStagingStateQuery } from '../../../generated/graphql'
import environmentConfiguration from '../../../utils/environmentConfiguration'
import { format, distanceInWordsToNow } from 'date-fns'

export const GET_STAGING_STATE = gql`
  query GetStagingState($stagingEnvironmentStateRequest: StagingEnvironmentStateRequest!) {
    stagingEnvironmentState(stagingEnvironmentStateRequest: $stagingEnvironmentStateRequest) {
      currentBranch
      deployedOn
      deployedBy
      buildNumer
      buildUri
      workitems {
        title
        id
        testerName
        creator
        url
      }
      releaseName
      releaseId
      releaseUrl
      deployState
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
              <a href={data.stagingEnvironmentState.releaseUrl}>
                {data.stagingEnvironmentState.releaseName} ({data.stagingEnvironmentState.releaseId}
                )
              </a>
              <a href={data.stagingEnvironmentState.buildUri}>
                {data.stagingEnvironmentState.buildNumer}
              </a>{' '}
              by {data.stagingEnvironmentState.deployedBy}
            </p>
            <p
              title={format(new Date(data.stagingEnvironmentState.deployedOn), 'YYYY-MM-DD hh:mma')}
            >
              {distanceInWordsToNow(new Date(data.stagingEnvironmentState.deployedOn)) + ' ago'}
            </p>
            <p>{data.stagingEnvironmentState.deployState}</p>
            <h3>Work Items</h3>
            <ul>
              {data.stagingEnvironmentState.workitems.map(wi => {
                return (
                  <li key={wi.id}>
                    <p>
                      <a href={wi.url}>
                        {wi.id} - {wi.title}
                      </a>
                    </p>
                    <p>by {wi.creator} for AREA</p>
                    <p>tested by {wi.testerName}</p>
                  </li>
                )
              })}
            </ul>
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

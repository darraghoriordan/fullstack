import * as React from 'react'
import TestEnvironmentPanel from './TestEnvironmentPanel'
import environmentConfiguration from '../../../utils/environmentConfiguration'
import styled from 'styled-components'
import { View } from 'react-native'

const DashboardContainer = styled(View)`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`
const Dashboard = () => {
  return (
    <div>
      <h1>Test Environments</h1>
      <DashboardContainer>
        {environmentConfiguration
          .filter(x => x.displayName.startsWith('Test'))
          .map(element => (
            <TestEnvironmentPanel {...element} />
          ))}
      </DashboardContainer>
    </div>
  )
}

export default Dashboard

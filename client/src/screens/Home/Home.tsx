import * as React from 'react'
import { View, Text, Dimensions } from 'react-native'
import gql from 'graphql-tag'
import styled from 'styled-components'
import { useMeQuery } from '../../generated/graphql'
import { SidebarContext } from '../../components/MainLayout'
import Dashboard from './components/Dashboard'
import Onboard from './components/Onboard'
import { DeployState } from './components/DeployState'

const { width } = Dimensions.get('window')

export const GET_USER = gql`
  query Me {
    me {
      _id
      profile {
        firstName
        lastName
      }
      emails {
        address
      }
      isOnboarded
    }
  }
`

const Wrapper = styled(View)<{ sidebarOpen: boolean }>`
  flex: 1;
  align-items: center;
  margin-top: 97px;
  ${props => props.sidebarOpen && 'margin-left: 300px;'}
  transition: margin-left 0.3s ease;
`

const Title = styled(Text)`
  font-family: AvantGardePro;
  font-weight: 900;
  font-size: 30px;
  color: var(--dark-blue);
  letter-spacing: -1.36px;
  line-height: 47px;
  margin-bottom: 60px;
`

const Home = () => {
  const { data, loading, refetch } = useMeQuery()
  const { sidebarOpen } = React.useContext(SidebarContext)
  const firstName = data && data.me && data.me.profile.firstName
  const isOnboarded = data && data.me && data.me.isOnboarded
  const deployStates: DeployState[] = [
    {
      order: 1,
      name: 'Production',
      currentBranch: 'master',
      currentBranchUri: 'https://#',
      deployedOn: new Date(2019, 1, 1),
      deployedBy: 'Darragh',
      workItemNumber: '12345',
      workItemTitle: 'how will this work for a build on master - it wont',
      workItemUri: 'https://#',
    },
    {
      order: 2,
      name: 'Staging',
      currentBranch: 'master',
      currentBranchUri: 'https://#',
      deployedOn: new Date(2019, 1, 1),
      deployedBy: 'Darragh',
      workItemNumber: '12345',
      workItemTitle: 'how will this work for a build on master - it wont',
      workItemUri: 'https://#',
    },
    {
      order: 3,
      name: 'Test 01',
      currentBranch: 'darragh/this-is-a-branch',
      currentBranchUri: 'https://#',
      deployedOn: new Date(2019, 1, 2),
      deployedBy: 'Darragh',
      workItemNumber: '54321',
      workItemTitle: 'this is a fairly long title',
      workItemUri: 'https://#',
    },
    {
      order: 4,
      name: 'Test 02',
      currentBranch: 'darragh/this-is-a-branch',
      currentBranchUri: 'https://#',
      deployedOn: new Date(2019, 1, 2),
      deployedBy: 'Darragh',
      workItemNumber: '54321',
      workItemTitle: 'this is a fairly long title',
      workItemUri: 'https://#',
    },
    {
      order: 5,
      name: 'Test 03',
      currentBranch: 'darragh/this-is-a-branch',
      currentBranchUri: 'https://#',
      deployedOn: new Date(2019, 1, 2),
      deployedBy: 'Darragh',
      workItemNumber: '54321',
      workItemTitle: 'this is a fairly long title',
      workItemUri: 'https://#',
    },
    {
      order: 6,
      name: 'Test 04',
      currentBranch: 'darragh/this-is-a-branch',
      currentBranchUri: 'https://#',
      deployedOn: new Date(2019, 1, 2),
      deployedBy: 'Darragh',
      workItemNumber: '54321',
      workItemTitle: 'this is a fairly long title',
      workItemUri: 'https://#',
    },
    {
      order: 7,
      name: 'Test 05',
      currentBranch: 'darragh/this-is-a-branch',
      currentBranchUri: 'https://#',
      deployedOn: new Date(2019, 1, 2),
      deployedBy: 'Darragh',
      workItemNumber: '54321',
      workItemTitle: 'this is a fairly long title',
      workItemUri: 'https://#',
    },
  ]
  return (
    <Wrapper sidebarOpen={sidebarOpen && width > 930}>
      {loading ? null : (
        <View style={{ position: 'relative', width: '75%', height: '85%' }}>
          <Title>{`Hello, ${firstName}!`}</Title>
          {isOnboarded ? <Dashboard deployStates={deployStates} /> : <Onboard done={refetch} />}
        </View>
      )}
    </Wrapper>
  )
}

export default Home

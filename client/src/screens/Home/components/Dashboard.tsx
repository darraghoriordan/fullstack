import * as React from 'react'
import { View } from 'react-native'
import { Flex, Box as FlexBox } from '@rebass/grid'
import ContentBox, { Variants as ContentBoxVariants } from './ContentBox'
import { DeployState } from './DeployState'
const truncateTitle = (fullTitle: string, length: number) => {
  if (fullTitle.length > length) {
    return fullTitle.substring(0, length - 1) + '...'
  }

  return fullTitle
}
const Dashboard = (props: { deployStates: DeployState[] }) => {
  return (
    <View>
      <table>
        <thead>
          <tr>
            <th>Env</th>
            <th>Current Branch</th>
            <th>Deployed By</th>
            <th>Deployed On</th>
            <th>Work Item</th>
            <td />
          </tr>
        </thead>
        <tbody>
          {props.deployStates.map(element => (
            <tr key={element.name}>
              <td>{element.name}</td>
              <td>
                <a href={element.currentBranchUri}>{element.currentBranch}</a>
              </td>
              <td>{element.deployedBy}</td>
              <td>{element.deployedOn.toDateString()}</td>
              <td>
                (
                <a title={element.workItemTitle} href={element.workItemUri}>
                  {element.workItemNumber}
                </a>
                ) {truncateTitle(element.workItemTitle, 30)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Flex
        width={1}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mb={50}
      >
        <FlexBox width={1} pr="15px">
          <ContentBox title="4.8" subtitle="Your Rating" variant={ContentBoxVariants.rating} />
        </FlexBox>
        <FlexBox width={1} px="15px">
          <ContentBox title="$8420" subtitle="Balance" />
        </FlexBox>
        <FlexBox width={1} pl="15px">
          <ContentBox title="$4210" subtitle="Total Savings" />
        </FlexBox>
      </Flex>
      <Flex width={1} flexDirection="row" justifyContent="space-between" alignItems="center">
        <FlexBox width={2 / 3} pr="10px">
          <ContentBox title="" subtitle="Leave a star on GitHub if you like this project" />
        </FlexBox>
        <FlexBox width={1 / 3} pl="15px">
          <ContentBox
            title="$262"
            subtitle="Earned Interest"
            variant={ContentBoxVariants.cyanTitle}
          />
        </FlexBox>
      </Flex>
    </View>
  )
}

export default Dashboard

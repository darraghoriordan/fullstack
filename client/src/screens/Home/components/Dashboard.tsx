import * as React from 'react'
import { View } from 'react-native'

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
    </View>
  )
}

export default Dashboard

import * as ri from 'azure-devops-node-api/interfaces/ReleaseInterfaces'
import * as wit from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces'
import * as bi from 'azure-devops-node-api/interfaces/BuildInterfaces'
import { ConfigItem } from '../Common/ConfigItem'
import { DeployState } from './DeployState'

export class DeployStateMapper {
  map(
    devopsDeployment: ri.Deployment,
    configItem: ConfigItem,
    releasedArtifact: ri.Artifact,
    build: bi.Build,
    workItem: wit.WorkItem
  ): DeployState {
    let mappedDeploy: DeployState = {
      order: configItem.displayOrder,
      deployedOn: devopsDeployment.completedOn,
      buildNumer: devopsDeployment.release.name,
      buildUri: build._links.web.href, // devopsDeployment.release.url,
      deployedBy: devopsDeployment.requestedFor.displayName,
      name: configItem.displayName,
      workItemNumber: workItem ? workItem.id.toString() : '',
      workItemTitle: workItem ? workItem.fields['System.Title'] : '',
      workItemUri: workItem ? workItem.url : '',
      currentBranchUri: releasedArtifact.definitionReference.artifactSourceVersionUrl.id,
      currentBranch: releasedArtifact.definitionReference.branch.name.substring(10),
    }
    return mappedDeploy
  }
}

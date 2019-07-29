import * as ri from 'azure-devops-node-api/interfaces/ReleaseInterfaces'
import { StagingEnvironmentState } from './StagingEnvironmentState'
import WorkItemDetails from '../Common/WorkItemDetails'

class StagingStateMapper {
  map = (release: ri.Release, workItems: WorkItemDetails[]): StagingEnvironmentState => {
    let cloudArtifact = release.artifacts.find(
      x => x.alias == '[ALPHA] Continuous Build & Packaging CloudApp'
    )
    let stagingEnvironment = release.environments.find(x => x.name == 'New Staging')
    let approval = stagingEnvironment.preDeployApprovals.find(
      x => (x.approvalType = ri.ApprovalType.PreDeploy)
    )

    let stagingState = new StagingEnvironmentState()
    stagingState.buildNumer = cloudArtifact.definitionReference.version.id
    stagingState.buildUri = cloudArtifact.definitionReference.artifactSourceVersionUrl.id
    stagingState.currentBranch = cloudArtifact.definitionReference.branch.name
    stagingState.deployedBy = approval.approvedBy.displayName
    stagingState.deployedOn = approval.modifiedOn
    stagingState.releaseName = release.name
    stagingState.releaseId = release.id
    stagingState.releaseUrl = release._links.web.href
    stagingState.deployState =
      stagingEnvironment.status == ri.EnvironmentStatus.Succeeded ? 'Success' : 'Failure'
    stagingState.workitems = workItems

    return stagingState
  }
}

export default StagingStateMapper

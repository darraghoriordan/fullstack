import * as azdev from 'azure-devops-node-api'
import { ReleaseApi } from 'azure-devops-node-api/ReleaseApi'
import * as ri from 'azure-devops-node-api/interfaces/ReleaseInterfaces'
import { StagingEnvironmentStateRequest } from './StagingEnvironmentResolver'
import logger from '../logging/logger'

export class StagingEnvironmentService {
  // to deploy this release to the next stage you would approve job01 and web05 pre-deploy approvals
  getCurrentStagingRelease = async (
    connection: azdev.WebApi,
    projectName: string,
    environmentConfiguration: StagingEnvironmentStateRequest
  ): Promise<ri.Release> => {
    logger.info('staging env request', { requestConfig: environmentConfiguration })
    const releaseApi: ReleaseApi = await connection.getReleaseApi()
    // this could be faster/more efficient if we set tags for the various deploy stages
    const stagingStatusFilter = ri.ReleaseStatus.Active
    const orderBy = ri.ReleaseQueryOrder.Descending
    let releaseExpands =
      ri.ReleaseExpands.Environments | ri.ReleaseExpands.Artifacts | ri.ReleaseExpands.Approvals

    let lastProductionReleases = await releaseApi.getReleases(
      projectName,
      environmentConfiguration.releaseDefinitionId,
      environmentConfiguration.definitionEnvironmentId,
      null, // searchText
      null, // createdBy
      stagingStatusFilter,
      null,
      null,
      null,
      orderBy,
      30,
      null,
      releaseExpands
    )

    //now filter them to only the first one that looks like a staging release
    var stagingRelease = lastProductionReleases.find(x => this.stagingReleasesFilter(x))

    if (!stagingRelease) {
      throw new Error('Could not find a relevant release!')
    }

    return stagingRelease
  }

  stagingReleasesFilter = (item: ri.Release): boolean => {
    return this.environmentHasPreApprovalAtStage(item, 'New Staging')
  }
  environmentHasPreApprovalAtStage = (item: ri.Release, environmentName: string): boolean => {
    let environmentState = item.environments.find(x => x.name == environmentName)
    if (!environmentState) {
      return false
    }
    let approval = environmentState.preDeployApprovals.find(
      x => (x.approvalType = ri.ApprovalType.PreDeploy)
    )
    if (!approval) {
      return false
    }
    return approval.status == ri.ApprovalStatus.Approved
  }
  environmentStateIsAsExpected = (
    item: ri.Release,
    environmentName: string,
    expectedStatesMask: ri.EnvironmentStatus
  ): boolean => {
    logger.info('The suspect item!', { theitem: item })
    var environmentState = item.environments.find(x => x.name == environmentName)
    if (!environmentState) {
      return false
    }
    //quick blog post on checking bitwise in typescript
    return environmentState.status === (environmentState.status & expectedStatesMask)
  }
}

export default StagingEnvironmentService

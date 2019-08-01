import * as azdev from 'azure-devops-node-api'
import { ReleaseApi } from 'azure-devops-node-api/ReleaseApi'
import * as ri from 'azure-devops-node-api/interfaces/ReleaseInterfaces'
import { BuildApi } from 'azure-devops-node-api/BuildApi'
import { WorkItemTrackingApi } from 'azure-devops-node-api/WorkItemTrackingApi'
import { StagingEnvironmentStateRequest } from './StagingEnvironmentResolver'
import { ResourceRef } from 'azure-devops-node-api/interfaces/common/VSSInterfaces'
import WorkItemDetails from '../Common/WorkItemDetails'
import { environmentHasPreApprovalAtStage } from '../Common/EnvironmentStateService'
import WorkItemDetailsMapper from '../Common/WorkItemDetailsMapper'

export class StagingEnvironmentService {
  private readonly workItemDetailsMapper: WorkItemDetailsMapper
  constructor() {
    this.workItemDetailsMapper = new WorkItemDetailsMapper()
  }
  // to deploy this release to the next stage you would approve job01 and web05 pre-deploy approvals
  getCurrentStagingRelease = async (
    connection: azdev.WebApi,
    projectName: string,
    environmentConfiguration: StagingEnvironmentStateRequest
  ): Promise<ri.Release> => {
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
    let stagingRelease = lastProductionReleases.find(x => this.stagingReleasesFilter(x))

    if (!stagingRelease) {
      throw new Error('Could not find a relevant release!')
    }

    return stagingRelease
  }
  async approveCurrentStagingRelease(
    connection: azdev.WebApi,
    projectName: string,
    environmentConfiguration: StagingEnvironmentStateRequest
  ) {}

  async getWorkItemsBetween(
    connection: azdev.WebApi,
    projectName: string,
    artifactAlias: string,
    stagingRelease: ri.Release,
    productionRelease: ri.Release
  ): Promise<WorkItemDetails[]> {
    const buildApi: BuildApi = await connection.getBuildApi()
    const workItemApi: WorkItemTrackingApi = await connection.getWorkItemTrackingApi()
    let stagingArtifact = stagingRelease.artifacts.find(x => x.alias == artifactAlias)
    let productionArtifact = productionRelease.artifacts.find(x => x.alias == artifactAlias)
    let workItemRefs = await buildApi.getWorkItemsBetweenBuilds(
      projectName,
      parseInt(stagingArtifact.definitionReference.version.id),
      parseInt(productionArtifact.definitionReference.version.id)
    )

    let workItems = await Promise.all(
      workItemRefs.map(async (x: ResourceRef) => {
        return workItemApi.getWorkItem(parseInt(x.id))
      })
    )

    return this.workItemDetailsMapper.map(workItems)
  }

  stagingReleasesFilter = (item: ri.Release): boolean => {
    return environmentHasPreApprovalAtStage(item, 'New Staging')
  }
}

export default StagingEnvironmentService

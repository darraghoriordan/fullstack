import * as azdev from 'azure-devops-node-api'
import { ReleaseApi } from 'azure-devops-node-api/ReleaseApi'
import * as ri from 'azure-devops-node-api/interfaces/ReleaseInterfaces'
import { StagingEnvironmentStateRequest } from './StagingEnvironment/StagingEnvironmentResolver'
import logger from '../logging/logger'
import { environmentStateIsAsExpected } from './Common/EnvironmentStateService'

export class ProductionEnvironmentService {
  getCurrentProductionelease = async (
    connection: azdev.WebApi,
    projectName: string,
    environmentConfiguration: StagingEnvironmentStateRequest
  ): Promise<ri.Release> => {
    logger.info('production env request', { requestConfig: environmentConfiguration })
    const releaseApi: ReleaseApi = await connection.getReleaseApi()
    // this could be faster/more efficient if we set tags for the letious deploy stages
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
    let foundRelease = lastProductionReleases.find(x => this.releasesIdentifiationFilter(x))

    if (!foundRelease) {
      throw new Error('Could not find a relevant release!')
    }

    return foundRelease
  }

  releasesIdentifiationFilter = (item: ri.Release): boolean => {
    return (
      environmentStateIsAsExpected(item, '@pr-auea-job01', ri.EnvironmentStatus.Succeeded) &&
      environmentStateIsAsExpected(item, '@pr-auea-web05', ri.EnvironmentStatus.Succeeded)
    )
  }
}

export default ProductionEnvironmentService

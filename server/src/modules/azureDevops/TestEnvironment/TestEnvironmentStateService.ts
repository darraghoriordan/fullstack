import * as azdev from 'azure-devops-node-api'
import { ReleaseApi } from 'azure-devops-node-api/ReleaseApi'
import * as ri from 'azure-devops-node-api/interfaces/ReleaseInterfaces'
import * as wit from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces'
import { DeployState } from './DeployState'
import { ConfigItem } from '../Common/ConfigItem'
import { DeployStateMapper } from './DeployStateMapper'

export class TestEnvironmentStateService {
  private readonly deployStateMapper: DeployStateMapper
  constructor() {
    this.deployStateMapper = new DeployStateMapper()
  }
  async getSingleDeployment(
    connection: azdev.WebApi,
    projectName: string,
    environmentConfiguration: ConfigItem
  ): Promise<DeployState> {
    const releaseApiPromise = connection.getReleaseApi()
    const buildApiPromise = connection.getBuildApi()
    const witApiPromise = connection.getWorkItemTrackingApi()

    let [releaseApi, buildApi, witApi] = await Promise.all([
      releaseApiPromise,
      buildApiPromise,
      witApiPromise,
    ])

    let deployment = await this.getRecentDeployment(
      releaseApi,
      projectName,
      environmentConfiguration
    )

    let releasedArtifact = deployment.release.artifacts.find(
      x => x.alias === environmentConfiguration.artifactAlias
    )

    let build = await buildApi.getBuild(
      projectName,
      parseInt(releasedArtifact.definitionReference.version.id)
    )
    let workItems = await buildApi.getBuildWorkItemsRefs(projectName, build.id, 1)

    let workItem: wit.WorkItem
    if (workItems.length > 0) {
      workItem = await witApi.getWorkItem(parseInt(workItems[0].id), ['System.Title'])
    }

    let result = this.deployStateMapper.map(
      deployment,
      environmentConfiguration,
      releasedArtifact,
      build,
      workItem
    )

    return result
  }

  async getRecentDeployment(
    releaseApi: ReleaseApi,
    projectName: string,
    configItem: ConfigItem
  ): Promise<ri.Deployment> {
    const deployments: ri.Deployment[] = await releaseApi.getDeployments(
      projectName,
      configItem.releaseDefinitionId,
      configItem.definitionEnvironmentId,
      null,
      null,
      null,
      null,
      null,
      null,
      ri.ReleaseQueryOrder.Descending,
      1,
      null,
      null
    )

    return deployments[0]
  }
}

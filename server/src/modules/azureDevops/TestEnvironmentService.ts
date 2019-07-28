import * as azdev from 'azure-devops-node-api'
import * as bi from 'azure-devops-node-api/interfaces/BuildInterfaces'
import { BuildApi } from 'azure-devops-node-api/BuildApi'
import { ReleaseApi } from 'azure-devops-node-api/ReleaseApi'
import * as ri from 'azure-devops-node-api/interfaces/ReleaseInterfaces'
import * as wit from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces'
import { DeployState } from './DeployState'
import { ConfigItem } from './ConfigItem'
import { WorkItemTrackingApi } from 'azure-devops-node-api/WorkItemTrackingApi'
import logger from '../logging/logger'

export class TestEnvironmentService {
  async getSingleDeployment(
    connection: azdev.WebApi,
    projectName: string,
    environmentConfiguration: ConfigItem
  ): Promise<DeployState> {
    const releaseApi: ReleaseApi = await connection.getReleaseApi()
    const buildApi: BuildApi = await connection.getBuildApi()
    const witApi: WorkItemTrackingApi = await connection.getWorkItemTrackingApi()
    return await this.getDeploymentData(
      projectName,
      environmentConfiguration,
      releaseApi,
      witApi,
      buildApi
    )
  }

  async getDeploymentData(
    projectName: string,
    environmentConfiguration: ConfigItem,
    releaseApi: ReleaseApi,
    witApi: WorkItemTrackingApi,
    buildApi: BuildApi
  ): Promise<DeployState> {
    let deploymentPromise = this.getRecentDeployment(
      releaseApi,
      projectName,
      environmentConfiguration
    )
    let productionReleasePromise = releaseApi.getReleases(
      projectName,
      16,
      140,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      1
    )
    logger.profile('DEP and RELEASE')
    let [deployment, productionRelease] = await Promise.all([
      deploymentPromise,
      productionReleasePromise,
    ])
    logger.profile('DEP and RELEASE')
    let releasedArtifact = deployment.release.artifacts.find(
      x => x.alias === environmentConfiguration.artifactAlias
    )

    let workItemsPromise = releaseApi.getReleaseWorkItemsRefs(
      projectName,
      deployment.release.id,
      productionRelease[0].id
    )
    let buildPromise = buildApi.getBuild(
      projectName,
      parseInt(releasedArtifact.definitionReference.version.id)
    )
    logger.profile('WI and BUILD')
    let [workItems, build] = await Promise.all([workItemsPromise, buildPromise])
    logger.profile('WI and BUILD')
    let workItem: wit.WorkItem
    if (workItems.length > 0) {
      workItem = await witApi.getWorkItem(parseInt(workItems[0].id), ['System.Title'])
    }

    this.logOBj('RELEASE', productionRelease)
    this.logOBj('ARTIFACT', releasedArtifact)
    this.logOBj('WORKITEM', workItem)
    this.logOBj('BUILD', build)

    logger.profile('MAP')
    let result = this.mapToSimple(
      deployment,
      environmentConfiguration,
      releasedArtifact,
      build,
      workItem
    )
    logger.profile('MAP')
    return result
  }

  logOBj(title: string, obj: any) {
    logger.info(title, { response: obj })
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

    return deployments[0] // filteredResults;
  }
  mapToSimple(
    devopsDeployment: ri.Deployment,
    configItem: ConfigItem,
    releasedArtifact: ri.Artifact,
    build: bi.Build,
    workItem: wit.WorkItem
  ): DeployState {
    var mappedDeploy: DeployState = {
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

import * as azdev from 'azure-devops-node-api'
import * as bi from 'azure-devops-node-api/interfaces/BuildInterfaces'
import { BuildApi } from 'azure-devops-node-api/BuildApi'
import { ReleaseApi } from 'azure-devops-node-api/ReleaseApi'
import * as ri from 'azure-devops-node-api/interfaces/ReleaseInterfaces'
import * as wit from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces'
import { DeployState } from './DeployState'
import { ConfigItem } from './ConfigItem'
import logger from '../logging/logger'
import PreProductionEnvironmentService from './PreProductionEnvironmentService'
import ProductionEnvironmentService from './ProductionEnvironmentService'
import { connection } from 'mongoose'

export class TestEnvironmentService {
  private readonly productionEnvironmentService: PreProductionEnvironmentService

  constructor() {
    this.productionEnvironmentService = new ProductionEnvironmentService()
  }

  async getSingleDeployment(
    connection: azdev.WebApi,
    projectName: string,
    environmentConfiguration: ConfigItem
  ): Promise<DeployState> {
    const releaseApiPromise = connection.getReleaseApi()
    const buildApiPromise = connection.getBuildApi()
    const witApiPromise = connection.getWorkItemTrackingApi()
    let productionReleasePromise = this.productionEnvironmentService.getCurrentProductionelease(
      connection,
      projectName,
      {
        releaseEnvironmentName: '@pr-auea-web05',
        releaseDefinitionId: 16,
        definitionEnvironmentId: 106,
        artifactAlias: '[ALPHA] Continuous Build & Packaging CloudApp',
      }
    )
    let [releaseApi, buildApi, witApi, productionRelease] = await Promise.all([
      releaseApiPromise,
      buildApiPromise,
      witApiPromise,
      productionReleasePromise,
    ])

    return await this.getDeploymentData(
      projectName,
      environmentConfiguration,
      releaseApi,
      buildApi,
      productionRelease
    )
  }

  async getDeploymentData(
    projectName: string,
    environmentConfiguration: ConfigItem,
    releaseApi: ReleaseApi,
    buildApi: BuildApi,
    productionRelease: ri.Release
  ): Promise<DeployState> {
    let deploymentPromise = this.getRecentDeployment(
      releaseApi,
      projectName,
      environmentConfiguration
    )

    let deployment = await deploymentPromise

    let releasedArtifact = deployment.release.artifacts.find(
      x => x.alias === environmentConfiguration.artifactAlias
    )

    let buildPromise = buildApi.getBuild(
      projectName,
      parseInt(releasedArtifact.definitionReference.version.id)
    )
    logger.profile('WI and BUILD')
    let [build] = await Promise.all([buildPromise])
    logger.profile('WI and BUILD')
    let workItem: wit.WorkItem
    // if (workItems.length > 0) {
    //     workItem = await witApi.getWorkItem(parseInt(workItems[0].id), ['System.Title'])
    // }
    // else {
    //     logger.info("no work items between " + deployment.release.id + " and " + productionRelease.id)
    // }

    this.logOBj('RELEASE', productionRelease)
    this.logOBj('ARTIFACT', releasedArtifact)
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

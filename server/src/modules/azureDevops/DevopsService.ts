import * as azdev from 'azure-devops-node-api'
import * as bi from 'azure-devops-node-api/interfaces/BuildInterfaces'
import { BuildApi } from 'azure-devops-node-api/BuildApi'
import { CoreApi } from 'azure-devops-node-api/CoreApi'
import { ReleaseApi } from 'azure-devops-node-api/ReleaseApi'
import * as ri from 'azure-devops-node-api/interfaces/ReleaseInterfaces'
import * as wit from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces'
import { TeamProjectReference } from 'azure-devops-node-api/interfaces/CoreInterfaces'
import { DeployState } from './DeployState'
import configuration from './environmentConfiguration'
import { ConfigItem } from './ConfigItem'
import { WorkItemTrackingApi } from 'azure-devops-node-api/WorkItemTrackingApi'

export class DevopsService {
  // const cloudReleasesDefinitioinId = 16
  // const testSlotsReleasesDefinitionId = 21
  // const testSlotsBuildDefinitionId = 109
  // const cloudBuildsDefinitionId = 94

  // put a build on a test environment
  // put a build on staging
  // put a build on production test
  // put a build on production
  // given a release def id
  // select a pipeline
  // pipeline to deploy to: New Test01 CI
  // artifact to deploy
  // then control the steps of the deploy

  async getProjects(connection: azdev.WebApi): Promise<TeamProjectReference[]> {
    const projectApi: CoreApi = await connection.getCoreApi()
    let projects = projectApi.getProjects()
    return projects
  }
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
    let deployment = await this.getRecentDeployment(
      releaseApi,
      projectName,
      environmentConfiguration
    )
    let releasedArtifact = deployment.release.artifacts.find(
      x => x.alias === environmentConfiguration.artifactAlias
    )
    let workItems = await releaseApi.getReleaseWorkItemsRefs(
      projectName,
      deployment.release.id,
      deployment.release.id - 1
    )

    let workItem: wit.WorkItem
    if (workItems.length > 0) {
      workItem = await witApi.getWorkItem(parseInt(workItems[0].id), ['System.Title'])
    }
    let build = await buildApi.getBuild(
      projectName,
      parseInt(releasedArtifact.definitionReference.version.id)
    )

    return this.mapToSimple(deployment, environmentConfiguration, releasedArtifact, build, workItem)
  }
  async getSimpleRecentDeployments(
    connection: azdev.WebApi,
    projectName: string
  ): Promise<DeployState[]> {
    // gets the work items between deploys
    //  https://<accountUrl>/<Project>/_apis/Release/releases/<ReleaseID>/workitems?baseReleaseId=<ReleaseToCompareAgainst>&%24top=250
    const releaseApi: ReleaseApi = await connection.getReleaseApi()
    const buildApi: BuildApi = await connection.getBuildApi()
    const witApi: WorkItemTrackingApi = await connection.getWorkItemTrackingApi()
    const results = await Promise.all(
      configuration.map(async item => {
        return await this.getDeploymentData(projectName, item, releaseApi, witApi, buildApi)
      })
    )
    return results.sort((a, b) => (a.order > b.order ? 1 : -1))
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

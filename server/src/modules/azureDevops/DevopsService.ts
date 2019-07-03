import * as azdev from 'azure-devops-node-api'
import * as bi from 'azure-devops-node-api/interfaces/BuildInterfaces'
import { BuildApi } from 'azure-devops-node-api/BuildApi'
import { CoreApi } from 'azure-devops-node-api/CoreApi'
import { ReleaseApi } from 'azure-devops-node-api/ReleaseApi'
import * as ri from 'azure-devops-node-api/interfaces/ReleaseInterfaces'
import { TeamProjectReference } from 'azure-devops-node-api/interfaces/CoreInterfaces'
import { DeployState } from './DeployState'
import configuration from './environmentConfiguration'
import { ConfigItem } from './ConfigItem'

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
    var projects = projectApi.getProjects()
    return projects
  }

  async getRecentBuilds(connection: azdev.WebApi, projectName: string): Promise<bi.Build[]> {
    const buildApi: BuildApi = await connection.getBuildApi()
    const builds: bi.Build[] = await buildApi.getBuilds(projectName)
    return builds
  }

  async mapToBuilds(devopsBuilds: bi.Build[]) {
    return devopsBuilds.map(x => {
      buildNumber: x.buildNumber
    })
  }

  async getSimpleRecentDeployments(
    connection: azdev.WebApi,
    projectName: string
  ): Promise<DeployState[]> {
    const results = await Promise.all(
      configuration.map(async item => {
        return this.mapToSimple(await this.getRecentDeployment(connection, projectName, item), item)
      })
    )
    return results.sort((a, b) => (a.order > b.order ? 1 : -1))
  }

  async getRecentDeployment(
    connection: azdev.WebApi,
    projectName: string,
    configItem: ConfigItem
  ): Promise<ri.Deployment> {
    const releaseApi: ReleaseApi = await connection.getReleaseApi()
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
  mapToSimple(devopsDeployment: ri.Deployment, configItem: ConfigItem): DeployState {
    var releasedArtifcate = devopsDeployment.release.artifacts.find(
      x => x.alias === configItem.artifactAlias
    )
    var mappedDeploy: DeployState = {
      order: configItem.displayOrder,
      deployedOn: devopsDeployment.completedOn,
      buildNumer: devopsDeployment.release.name,
      buildUri: devopsDeployment.release.url,
      deployedBy: devopsDeployment.requestedFor.displayName,
      name: configItem.displayName,
      workItemNumber: '',
      workItemTitle: '',
      workItemUri: '',
      currentBranchUri: releasedArtifcate.definitionReference.artifactSourceVersionUrl.id,
      currentBranch: releasedArtifcate.definitionReference.branch.name.substring(10),
    }
    return mappedDeploy
  }
}

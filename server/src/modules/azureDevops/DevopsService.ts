import * as azdev from 'azure-devops-node-api'
import * as bi from 'azure-devops-node-api/interfaces/BuildInterfaces'
import { BuildApi } from 'azure-devops-node-api/BuildApi'
import { CoreApi } from 'azure-devops-node-api/CoreApi'
import { ReleaseApi } from 'azure-devops-node-api/ReleaseApi'
import * as ri from 'azure-devops-node-api/interfaces/ReleaseInterfaces'
import { TeamProjectReference } from 'azure-devops-node-api/interfaces/CoreInterfaces'
import { DeployState } from './DeployState'

interface ConfigItem {
  displayName: string
  releaseEnvironmentName: string
  releaseDefinitionId: number
  definitionEnvironmentId: number
  artifactAlias: string
}
export class DevopsService {
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
  async getReleaseDefinitions(
    connection: azdev.WebApi,
    projectName: string
  ): Promise<ri.DefinitionEnvironmentReference[]> {
    const releaseApi: ReleaseApi = await connection.getReleaseApi()

    const envs: ri.DefinitionEnvironmentReference[] = await releaseApi.getDefinitionEnvironments(
      projectName,
      null,
      ['id', 'name']
    )
    return envs
  }
  async mapToBuilds(devopsBuilds: bi.Build[]) {
    return devopsBuilds.map(x => {
      buildNumber: x.buildNumber
    })
  }
  config: ConfigItem[] = [
    {
      displayName: 'Test Slot 1',
      releaseEnvironmentName: 'New Test01 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 260,
      artifactAlias: '[TestSlot] CloudApp',
      // pipelineName: 'New Test01 CI'
      // artifactFilter: 'Test'
    },
    {
      displayName: 'Test Slot 2',
      releaseEnvironmentName: 'New Test02 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 266,
      artifactAlias: '[TestSlot] CloudApp',
    },
    {
      displayName: 'Test Slot 3',
      releaseEnvironmentName: 'New Test03 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 267,
      artifactAlias: '[TestSlot] CloudApp',
    },
    {
      displayName: 'Test Slot 4',
      releaseEnvironmentName: 'New Test04 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 273,
      artifactAlias: '[TestSlot] CloudApp',
    },
    {
      displayName: 'Test Slot 5',
      releaseEnvironmentName: 'New Test05 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 268,
      artifactAlias: '[TestSlot] CloudApp',
    },
    {
      displayName: 'Test Slot 6',
      releaseEnvironmentName: 'New Test06 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 269,
      artifactAlias: '[TestSlot] CloudApp',
    },
    {
      displayName: 'Test Slot 7',
      releaseEnvironmentName: 'New Test07 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 270,
      artifactAlias: '[TestSlot] CloudApp',
    },
    {
      displayName: 'Test Slot 8',
      releaseEnvironmentName: 'New Test08 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 271,
      artifactAlias: '[TestSlot] CloudApp',
    },
    {
      displayName: 'Test Slot 9',
      releaseEnvironmentName: 'New Test09 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 272,
      artifactAlias: '[TestSlot] CloudApp',
    },
    {
      displayName: 'Test Slot 10',
      releaseEnvironmentName: 'New Test10 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 274,
      artifactAlias: '[TestSlot] CloudApp',
    },
    {
      displayName: 'Test Slot 11',
      releaseEnvironmentName: 'New Test11 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 275,
      artifactAlias: '[TestSlot] CloudApp',
    },
    {
      displayName: 'Test Slot 12',
      releaseEnvironmentName: 'New Test12 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 276,
      artifactAlias: '[TestSlot] CloudApp',
    },
    {
      displayName: 'Test Slot 13',
      releaseEnvironmentName: 'New Test13 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 277,
      artifactAlias: '[TestSlot] CloudApp',
    },
    {
      displayName: 'Test Slot 14',
      releaseEnvironmentName: 'New Test14 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 276,
      artifactAlias: '[TestSlot] CloudApp',
    },
    {
      displayName: 'Test Slot 15',
      releaseEnvironmentName: 'New Test15 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 279,
      artifactAlias: '[TestSlot] CloudApp',
    },
    {
      displayName: 'Test Slot 16',
      releaseEnvironmentName: 'New Test16 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 280,
      artifactAlias: '[TestSlot] CloudApp',
    },
    {
      displayName: 'Test Slot 17',
      releaseEnvironmentName: 'New Test17 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 281,
      artifactAlias: '[TestSlot] CloudApp',
    },
    {
      displayName: 'Test Slot 18',
      releaseEnvironmentName: 'New Test18 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 282,
      artifactAlias: '[TestSlot] CloudApp',
    },
    {
      displayName: 'Test Slot 19',
      releaseEnvironmentName: 'New Test19 CI',
      releaseDefinitionId: 21,
      definitionEnvironmentId: 283,
      artifactAlias: '[TestSlot] CloudApp',
    },
    {
      displayName: 'Staging',
      releaseEnvironmentName: 'New Staging',
      releaseDefinitionId: 16,
      definitionEnvironmentId: 250,
      artifactAlias: '[ALPHA] Continuous Build & Packaging CloudApp',
    },
    {
      displayName: 'Web1',
      releaseEnvironmentName: '@pr-auea-web01',
      releaseDefinitionId: 16,
      definitionEnvironmentId: 140,
      artifactAlias: '[ALPHA] Continuous Build & Packaging CloudApp',
    },
    {
      displayName: 'Web2',
      releaseEnvironmentName: '@pr-auea-web02',
      releaseDefinitionId: 16,
      definitionEnvironmentId: 141,
      artifactAlias: '[ALPHA] Continuous Build & Packaging CloudApp',
    },
    {
      displayName: 'Web3',
      releaseEnvironmentName: '@pr-auea-web03',
      releaseDefinitionId: 16,
      definitionEnvironmentId: 142,
      artifactAlias: '[ALPHA] Continuous Build & Packaging CloudApp',
    },
    {
      displayName: 'Web4',
      releaseEnvironmentName: '@pr-auea-web04',
      releaseDefinitionId: 16,
      definitionEnvironmentId: 143,
      artifactAlias: '[ALPHA] Continuous Build & Packaging CloudApp',
    },
    {
      displayName: 'Web5',
      releaseEnvironmentName: '@pr-auea-web05',
      releaseDefinitionId: 16,
      definitionEnvironmentId: 106,
      artifactAlias: '[ALPHA] Continuous Build & Packaging CloudApp',
    },
    {
      displayName: 'Job1',
      releaseEnvironmentName: '@pr-auea-job01',
      releaseDefinitionId: 16,
      definitionEnvironmentId: 164,
      artifactAlias: '[ALPHA] Continuous Build & Packaging CloudApp',
    },
    {
      displayName: 'Job2',
      releaseEnvironmentName: '@pr-auea-job02',
      releaseDefinitionId: 16,
      definitionEnvironmentId: 165,
      artifactAlias: '[ALPHA] Continuous Build & Packaging CloudApp',
    },

    //,
    // {
    //     releaseEnvironmentName: 'New Test20 CI', releaseDefinitioinId: 21, definitionEnvironmentId: 0
    // }
  ]
  async getSimpleRecentDeployments(
    connection: azdev.WebApi,
    projectName: string
  ): Promise<DeployState[]> {
    const results = await Promise.all(
      this.config.map(async item => {
        return this.mapToSimple(await this.getRecentDeployment(connection, projectName, item), item)
      })
    )
    return results.sort((a, b) => (a.name > b.name ? 1 : -1))
  }

  async getds(connection: azdev.WebApi, projectName: string): Promise<ri.Deployment[]> {
    const releaseApi: ReleaseApi = await connection.getReleaseApi()

    // await releaseApi.getDeploymentsForMultipleEnvironments({environments:this.config.map(x=> x.definitionEnvironmentId)})
    const deployments: ri.Deployment[] = await releaseApi.getDeployments(
      projectName,
      16,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      ri.ReleaseQueryOrder.Descending,
      200,
      null,
      null
    )
    return deployments
  }
  async getRecentDeployment(
    connection: azdev.WebApi,
    projectName: string,
    configItem: ConfigItem
  ): Promise<ri.Deployment> {
    const releaseApi: ReleaseApi = await connection.getReleaseApi()

    // await releaseApi.getDeploymentsForMultipleEnvironments({environments:this.config.map(x=> x.definitionEnvironmentId)})
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
    // var filteredResults: ri.Deployment[] = []
    // this.config.forEach(element => {
    //     const foundDeployment = deployments.find(x => x.releaseEnvironment.name === element.releaseEnvironmentName);
    //     if (!foundDeployment) {
    //         return;
    //     }
    //     filteredResults.push(foundDeployment);

    // });

    return deployments[0] // filteredResults;
  }
  mapToSimple(devopsDeployment: ri.Deployment, configItem: ConfigItem): DeployState {
    var releasedArtifcate = devopsDeployment.release.artifacts.find(
      x => x.alias === configItem.artifactAlias
    )
    var mappedDeploy: DeployState = {
      order: 0,
      deployedOn: devopsDeployment.completedOn,
      buildNumer: devopsDeployment.release.name,
      buildUri: devopsDeployment.release.url,
      deployedBy: devopsDeployment.requestedBy.displayName,
      name: configItem.displayName,
      workItemNumber: '',
      workItemTitle: '',
      workItemUri: '',
      currentBranchUri: releasedArtifcate.definitionReference.artifactSourceVersionUrl.id,
      currentBranch: releasedArtifcate.definitionReference.branch.name.substring(10),
    }
    return mappedDeploy
  }
  // async getPipelines(connection: azdev.WebApi, projectName: string, releaseDefinitionId: number): Promise<ri.Deployment[]> {
  //     const releaseApi: ReleaseApi = await connection.getReleaseApi();
  //     const deployments: ri.Deployment[] = await releaseApi.get(projectName, releaseDefinitionId, null, null, null, null, null, null, null, ri.ReleaseQueryOrder.Descending, 100);
  //     return deployments;
  // }
  async getReleases(connection: azdev.WebApi, projectName: string) {
    const cloudReleasesDefinitioinId = 16
    const testSlotsReleasesDefinitionId = 21
    const testSlotsBuildDefinitionId = 109
    const cloudBuildsDefinitionId = 94

    // put a build on a test environment
    // put a build on staging
    // put a build on production test
    // put a build on production
    {
      name: 'Test 01'
      cloudReleaseDefinitioinId: 21
      pipelineName: 'New Test01 CI'
      artifactFilter: 'Test'
    }
    // given a release def id
    // select a pipeline
    // pipeline to deploy to: New Test01 CI
    // artifact to deploy
    // then control the steps of the deploy
  }

  // const mapDeploymentsToEnvironments = async () => {
  //     foreach (var g in releaseDefs.GroupBy(x => x.ReleaseEnvironmentReference.Name))
  //     {
  //         var slotName = g.Key;
  //         var lastDeployed = g.OrderByDescending(y => y.QueuedOn).First();
  //         var definition = lastDeployed.Release.Artifacts.Where(x => x.Alias == "[TestSlot] CloudApp").First().DefinitionReference;
  //         results.Add(new TestSlotSummary()
  //         {
  //             Name = slotName,
  //             BuildNumber = definition["version"].Name,
  //             Commit = definition["sourceVersion"].Id,
  //             CurrentBranch = definition["branch"].Name,
  //             DisplayName = lastDeployed.RequestedBy.DisplayName,
  //             QueuedOn = lastDeployed.QueuedOn.ToString()
  //         });

  //     }
  //     var strings = releaseDefs.Select(x => $"{ x.CompletedOn} - {x.Id} ");

  //     return View(results.OrderBy(x => x.Name).ToList());
  // }
  // }
}

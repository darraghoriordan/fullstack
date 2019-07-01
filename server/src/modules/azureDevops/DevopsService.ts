import * as azdev from 'azure-devops-node-api'
import * as bi from 'azure-devops-node-api/interfaces/BuildInterfaces'
import { BuildApi } from 'azure-devops-node-api/BuildApi'
import { CoreApi } from 'azure-devops-node-api/CoreApi'
import { ReleaseApi } from 'azure-devops-node-api/ReleaseApi'
import * as ri from 'azure-devops-node-api/interfaces/ReleaseInterfaces'
import { TeamProjectReference } from 'azure-devops-node-api/interfaces/CoreInterfaces'

export class DevopsService {
  async getProjects(connection: azdev.WebApi): Promise<TeamProjectReference[]> {
    const projectApi: CoreApi = await connection.getCoreApi()
    return projectApi.getProjects()
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

  async getDeployments(
    connection: azdev.WebApi,
    projectName: string,
    releaseDefinitionId: number
  ): Promise<ri.Deployment[]> {
    const releaseApi: ReleaseApi = await connection.getReleaseApi()
    const deployments: ri.Deployment[] = await releaseApi.getDeployments(
      projectName,
      releaseDefinitionId,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      ri.ReleaseQueryOrder.Descending,
      100
    )
    return deployments
  }
  // async getPipelines(connection: azdev.WebApi, projectName: string, releaseDefinitionId: number): Promise<ri.Deployment[]> {
  //     const releaseApi: ReleaseApi = await connection.getReleaseApi();
  //     const deployments: ri.Deployment[] = await releaseApi.get(projectName, releaseDefinitionId, null, null, null, null, null, null, null, ri.ReleaseQueryOrder.Descending, 100);
  //     return deployments;
  // }
  async getReleases(connection: azdev.WebApi, projectName: string) {
    const cloudReleaseDefinitioinId = 16
    const testSlotsDefinitionId = 21
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

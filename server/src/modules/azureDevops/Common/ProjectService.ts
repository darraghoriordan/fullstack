import { TeamProjectReference } from 'azure-devops-node-api/interfaces/CoreInterfaces'
import { CoreApi } from 'azure-devops-node-api/CoreApi'
import { WebApi } from 'azure-devops-node-api'

export default class ProjectService {
  async getFirstProject(connection: WebApi): Promise<TeamProjectReference> {
    const projectApi: CoreApi = await connection.getCoreApi()
    let projects = await projectApi.getProjects()
    return projects[0]
  }
}

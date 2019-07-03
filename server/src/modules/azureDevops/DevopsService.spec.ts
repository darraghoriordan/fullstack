import { DevopsService } from './DevopsService'
import { getConnection } from './connectionFactory'
import { DevopsAccount } from '../user/UserEntity'

describe('The DevopsService', () => {
  describe('when getting a list of builds', () => {
    test('should return a list of builds', async () => {
      const fakeDevopsAccount: DevopsAccount = {}
      const connection = getConnection(fakeDevopsAccount)
      const devopsService = new DevopsService()
      const firstProject = (await devopsService.getProjects(connection))[0]
      const result = await devopsService.getSimpleRecentDeployments(connection, firstProject.name)
      expect(result.length).toBeGreaterThan(0)
    })
  })
})

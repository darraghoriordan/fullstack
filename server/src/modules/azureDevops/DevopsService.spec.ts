import { DevopsService } from './DevopsService'
import { getConnection } from './connectionFactory'
import { DevopsAccount } from '../user/UserEntity'

describe('The DevopsService', () => {
  describe('when getting a list of builds', () => {
    test('should return a list of builds', async () => {
      const fakeDevopsAccount: DevopsAccount = {
        accessToken: 'aibzx5mcn57iftl5ufd45ltw5m634jsxrlwp25jobyxt7wxhvyqq',
        organisationName: 'darraghor',
      }
      const connection = getConnection(fakeDevopsAccount)
      const devopsService = new DevopsService()
      const firstProject = (await devopsService.getProjects(connection))[0]
      const result = await devopsService.getRecentBuilds(connection, firstProject.name)
      console.log(result)
      expect(result.length).toBeGreaterThan(0)
    })
  })
})

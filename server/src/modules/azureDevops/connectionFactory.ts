import * as azdev from 'azure-devops-node-api'
import { DevopsAccount } from '../user/UserEntity'

export const getConnection = (devopsAccount: DevopsAccount): azdev.WebApi => {
  let token: string = devopsAccount.accessToken

  let authHandler = azdev.getPersonalAccessTokenHandler(token)
  return new azdev.WebApi(devopsAccount.organisationUrl, authHandler)
}

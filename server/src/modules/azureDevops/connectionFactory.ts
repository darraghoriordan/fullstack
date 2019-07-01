import * as azdev from 'azure-devops-node-api'
import { User, DevopsAccount } from '../user/UserEntity'

export const getConnection = (devopsAccount: DevopsAccount): azdev.WebApi => {
  // your collection url
  let orgUrl = `https://dev.azure.com/${devopsAccount.organisationName}`

  let token: string = devopsAccount.accessToken

  let authHandler = azdev.getPersonalAccessTokenHandler(token)
  return new azdev.WebApi(orgUrl, authHandler)
}

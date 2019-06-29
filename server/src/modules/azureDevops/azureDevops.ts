import * as azdev from 'azure-devops-node-api'
import { User } from '../user/UserEntity'

export const getConnection = (user: User): azdev.WebApi => {
  // your collection url
  let orgUrl = `https://dev.azure.com/${user.devopsAccount.organisationName}`

  let token: string = user.devopsAccount.accessToken

  let authHandler = azdev.getPersonalAccessTokenHandler(token)
  return new azdev.WebApi(orgUrl, authHandler)
}

import { Resolver } from 'type-graphql'
import { DeployState } from './DeployState'
import { DevopsService } from './DevopsService'

@Resolver(DeployState)
export default class DeployStateResolver {
  private readonly service: DevopsService

  constructor() {
    this.service = new DevopsService()
  }
}

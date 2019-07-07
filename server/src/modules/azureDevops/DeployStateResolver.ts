import { Resolver, Query, Authorized, Ctx, InputType, Field, Arg } from 'type-graphql'
import { DeployState } from './DeployState'
import { DevopsService } from './DevopsService'
import { Context } from 'vm'
import { getConnection } from './connectionFactory'
import { UserService } from '../user/UserService'

@InputType()
class DeployStateRequest {
  @Field()
  displayOrder: number
  @Field()
  displayName: string
  @Field()
  releaseEnvironmentName: string
  @Field()
  releaseDefinitionId: number
  @Field()
  definitionEnvironmentId: number
  @Field()
  artifactAlias: string
}

@Resolver(DeployState)
export default class DeployStateResolver {
  private readonly service: DevopsService
  private readonly userService: UserService

  constructor() {
    this.service = new DevopsService()
    this.userService = new UserService()
  }

  @Query(returns => [DeployState])
  @Authorized()
  async deployStates(@Ctx() ctx: Context) {
    if (ctx && ctx.userId) {
      const user = await this.userService.findOneById(ctx.userId)
      const connection = getConnection(user.devopsAccount)
      const firstProject = await this.service.getProjects(connection)

      const results = await this.service.getSimpleRecentDeployments(
        connection,
        firstProject[0].name
      )

      return results
    }

    return []
  }
  @Query(returns => DeployState)
  @Authorized()
  async deployState(
    @Arg('deployStateRequest', { nullable: false }) deployStateRequest: DeployStateRequest,
    @Ctx() ctx: Context
  ) {
    if (ctx && ctx.userId) {
      const user = await this.userService.findOneById(ctx.userId)
      const connection = getConnection(user.devopsAccount)

      const firstProject = await this.service.getProjects(connection) //[0]

      const result = await this.service.getSingleDeployment(
        connection,
        firstProject[0].name,
        deployStateRequest
      )

      return result
    }
  }
}

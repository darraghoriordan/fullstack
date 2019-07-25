import { StagingEnvironmentState } from './StagingEnvironmentState'
import { InputType, Field, Query, Authorized, Arg, Ctx, Resolver } from 'type-graphql'
import { DevopsService } from './DevopsService'
import { UserService } from '../user/UserService'
import { Context } from 'vm'
import { getConnection } from './connectionFactory'
import * as util from 'util'

@InputType()
class StagingEnvironmentStateRequest {
  @Field()
  releaseEnvironmentName: string
  @Field()
  releaseDefinitionId: number
  @Field()
  definitionEnvironmentId: number
  @Field()
  artifactAlias: string
}

@Resolver(StagingEnvironmentState)
export default class StagingEnvironmentStateResolver {
  private readonly service: DevopsService
  private readonly userService: UserService

  constructor() {
    this.service = new DevopsService()
    this.userService = new UserService()
  }

  @Query(returns => StagingEnvironmentState)
  @Authorized()
  async stagingEnvironmentState(
    @Arg('stagingEnvironmentStateRequest', { nullable: false })
    stagingEnvironmentStateRequest: StagingEnvironmentStateRequest,
    @Ctx() ctx: Context
  ) {
    if (ctx && ctx.userId) {
      const user = await this.userService.findOneById(ctx.userId)
      const connection = getConnection(user.devopsAccount)

      const firstProject = await this.service.getProjects(connection) //[0]

      const result = await this.service.getArelease(connection, firstProject[0].name, 13403)
      console.log(util.inspect(result, false, 2, true /* enable colors */))
      return new StagingEnvironmentState()
    }
  }
}

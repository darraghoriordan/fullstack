import { StagingEnvironmentState } from './StagingEnvironmentState'
import { InputType, Field, Query, Authorized, Arg, Ctx, Resolver } from 'type-graphql'
import { UserService } from '../user/UserService'
import { Context } from 'vm'
import { getConnection } from './connectionFactory'
import logger from '../logging/logger'
import StagingEnvironmentService from './StagingEnvironemntService'
import StagingStateMapper from './StagingStateMapper'
import ProjectService from './ProjectService'

@InputType()
export class StagingEnvironmentStateRequest {
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
  private readonly stagingEnvironmentService: StagingEnvironmentService
  private readonly userService: UserService
  private readonly mapper: StagingStateMapper
  private readonly projectService: ProjectService

  constructor() {
    this.stagingEnvironmentService = new StagingEnvironmentService()
    this.userService = new UserService()
    this.mapper = new StagingStateMapper()
    this.projectService = new ProjectService()
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
      const project = await this.projectService.getFirstProject(connection)
      const currentState = await this.stagingEnvironmentService.getCurrentStagingRelease(
        connection,
        project.name,
        stagingEnvironmentStateRequest
      )
      var mappedState = this.mapper.map(currentState)

      //quick blog post on winston logging objects
      logger.info('STAGE RELEASE: ', { returned: currentState })
      return mappedState
    }
  }
}

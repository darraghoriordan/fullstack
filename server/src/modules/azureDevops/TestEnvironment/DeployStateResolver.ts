import { Resolver, Query, Authorized, Ctx, InputType, Field, Arg } from 'type-graphql'
import { DeployState } from './DeployState'
import { Context } from 'vm'
import { getConnection } from '../Common/connectionFactory'
import { UserService } from '../../user/UserService'
import { TestEnvironmentStateService } from './TestEnvironmentStateService'
import ProjectService from '../Common/ProjectService'

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
  private readonly testEnvironmentService: TestEnvironmentStateService
  private readonly userService: UserService
  private readonly projectService: ProjectService

  constructor() {
    this.testEnvironmentService = new TestEnvironmentStateService()
    this.userService = new UserService()
    this.projectService = new ProjectService()
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

      const firstProject = await this.projectService.getFirstProject(connection)

      const result = await this.testEnvironmentService.getSingleDeployment(
        connection,
        firstProject.name,
        deployStateRequest
      )

      return result
    }
  }
}

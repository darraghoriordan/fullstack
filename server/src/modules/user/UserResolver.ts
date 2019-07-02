import { Arg, Resolver, Query, Authorized, Mutation, Ctx, ID, InputType, Field } from 'type-graphql'
import { Context } from '../common/context'
import { UserService } from './UserService'
import { User, Profile, DevopsAccount } from './UserEntity'
import './enums'
import { accountsPassword } from './accounts'
import { Role } from './consts'

@InputType()
class ProfileInput implements Partial<Profile> {
  @Field(type => String)
  firstName: string

  @Field(type => String)
  lastName: string
}

@InputType()
class DevopsAccountInput implements Partial<DevopsAccount> {
  @Field(type => String)
  accessToken: string

  @Field(type => String)
  organisationUrl: string
}

@InputType()
class CreateUserInput implements Partial<User> {
  @Field(type => String)
  email: string

  @Field(type => String)
  password: string

  @Field(type => ProfileInput)
  profile: ProfileInput
}

@Resolver(User)
export default class UserResolver {
  private readonly service: UserService

  constructor() {
    this.service = new UserService()
  }

  @Query(returns => User)
  @Authorized()
  async me(@Ctx() ctx: Context) {
    if (ctx.userId) {
      return await this.service.findOneById(ctx.userId)
    }
  }

  // this overrides accounts js `createUser` function
  @Mutation(returns => ID)
  async createUser(@Arg('user', returns => CreateUserInput) user: CreateUserInput) {
    const createdUserId = await accountsPassword.createUser({
      ...user,
      roles: [Role.User],
    })

    return createdUserId
  }

  @Mutation(returns => Boolean)
  @Authorized()
  async onboardUser(@Arg('devopsAccount') devopsAccount: DevopsAccountInput, @Ctx() ctx: Context) {
    const user = await this.service.findOneById(ctx.userId)

    user.devopsAccount = devopsAccount
    user.isOnboarded = true
    var model = await user.save()
    return !model.errors
  }

  // @FieldResolver(returns => String)
  // async firstName(@Root() user: User) {
  //   return user.profile.firstName
  // }

  // @FieldResolver(returns => String)
  // async lastName(@Root() user: User) {
  //   return user.profile.lastName
  // }
}

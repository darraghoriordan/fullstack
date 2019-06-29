import { prop, Typegoose } from 'typegoose'
import { ObjectType, Field, ID } from 'type-graphql'
import { ObjectId } from 'mongodb'
import { Role } from './consts'

@ObjectType()
export class Profile {
  @prop({ required: true })
  @Field()
  firstName: string

  @prop({ required: true })
  @Field()
  lastName: string
}

@ObjectType()
export class Plaid {
  @prop({ required: true })
  @Field()
  accessToken: string

  @prop({ required: true })
  @Field()
  itemId: string
}

@ObjectType()
export class DevopsAccount {
  @prop({ required: true })
  @Field()
  accessToken: string

  @prop({ required: true })
  @Field()
  organisationName: string
}

@ObjectType()
export class User extends Typegoose {
  @Field(type => ID)
  readonly _id: ObjectId

  @prop()
  @Field(type => Profile)
  profile: Profile

  @prop()
  @Field(type => DevopsAccount, { nullable: true })
  devopsAccount?: DevopsAccount

  @prop()
  @Field(type => Plaid, { nullable: true })
  plaid?: Plaid

  @prop({ required: true, enum: Role })
  @Field(type => Role)
  roles: Role[]

  @prop()
  @Field({ nullable: true })
  isOnboarded?: boolean

  @prop()
  @Field(() => Date)
  createdAt: Date

  @prop()
  @Field(() => Date)
  updatedAt: Date
}

export default new User().getModelForClass(User, {
  schemaOptions: { timestamps: true },
})

import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class DeployState {
  @Field()
  order: number
  @Field()
  name: string
  @Field()
  currentBranch: string
  @Field()
  currentBranchUri: string
  @Field(() => Date)
  deployedOn: Date
  @Field()
  deployedBy: string
  @Field()
  workItemNumber: string
  @Field()
  workItemTitle: string
  @Field()
  workItemUri: string
  @Field()
  buildNumer: string
  @Field()
  buildUri: string
}

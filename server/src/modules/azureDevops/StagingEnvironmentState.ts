import { ObjectType, Field } from 'type-graphql'
import WorkItemDetails from './WorkItemDetails'

@ObjectType()
export class StagingEnvironmentState {
  @Field()
  currentBranch: string
  @Field(() => Date)
  deployedOn: Date
  @Field()
  deployedBy: string
  @Field(type => [WorkItemDetails])
  workitems: WorkItemDetails[]
  @Field()
  buildNumer: string
  @Field()
  buildUri: string
  @Field()
  releaseName: string
  @Field()
  releaseId: number
  @Field()
  releaseUrl: string
  @Field()
  deployState: string
}

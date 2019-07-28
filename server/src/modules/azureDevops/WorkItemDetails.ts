import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export default class WorkItemDetails {
  @Field()
  id: number
  @Field()
  title: string
  @Field()
  testerName: string
  @Field()
  creator: string
  @Field()
  url: string
}

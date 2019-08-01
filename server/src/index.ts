// import * as reflectMetaData from 'reflect-metadata'
import { connect } from 'mongoose'
import { ApolloServer, makeExecutableSchema } from 'apollo-server'
import { buildSchema } from 'type-graphql'
import { mergeResolvers, mergeTypeDefs, mergeSchemas } from 'graphql-toolkit'
import { PORT, MONGO_HOST, DB_NAME } from './modules/common/consts'
import UserResolver from './modules/user/UserResolver'
import { authChecker } from './modules/user/authChecker'
import { setUpAccounts } from './modules/user/accounts'
import { TypegooseMiddleware } from './middleware/typegoose'
import DeployStateResolver from './modules/azureDevops/TestEnvironment/DeployStateResolver'
import StagingEnvironmentStateResolver from './modules/azureDevops/StagingEnvironment/StagingEnvironmentResolver'
import logger from './modules/logging/logger'
import * as dotenv from 'dotenv'

;(async () => {
  dotenv.config()
  const mongooseConnection = await connect(
    `mongodb://${MONGO_HOST || 'localhost'}:27017/${DB_NAME}`,
    { useNewUrlParser: true }
  )
  const { accountsGraphQL, accountsServer } = setUpAccounts(mongooseConnection.connection)

  const typeGraphqlSchema = await buildSchema({
    resolvers: [UserResolver, DeployStateResolver, StagingEnvironmentStateResolver],
    globalMiddlewares: [TypegooseMiddleware],
    // scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    validate: false,
    emitSchemaFile: true,
    authChecker,
  })

  const schema = makeExecutableSchema({
    typeDefs: mergeTypeDefs([accountsGraphQL.typeDefs]),
    resolvers: mergeResolvers([accountsGraphQL.resolvers]),
    schemaDirectives: {
      ...accountsGraphQL.schemaDirectives,
    } as any,
  })

  const server = new ApolloServer({
    schema: mergeSchemas({
      schemas: [schema, typeGraphqlSchema],
    }),
    context: accountsGraphQL.context,
    formatError: error => {
      logger.error(error)
      return error
    },
    playground: true,
  })

  await server.listen({ port: PORT })
  console.log(`🚀 Server ready at localhost:${PORT}`)
})()

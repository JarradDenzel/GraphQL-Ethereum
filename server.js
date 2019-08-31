const express = require('express')
const expressGraphQL = require('express-graphql')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')
const app = express()

const account = [
	{ id: 1, name: 'Jarrad Account' },
	{ id: 2, name: 'Denzel Account' },
	{ id: 3, name: 'Washington Account' }
]

const blocks = [ 
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', accountId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', accountId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', accountId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', accountId: 2 },
	{ id: 5, name: 'The Two Towers', accountId: 2 },
	{ id: 6, name: 'The Return of the King', accountId: 2 },
	{ id: 7, name: 'The Way of Shadows', accountId: 3 },
	{ id: 8, name: 'Beyond the Shadows', accountId: 3 }
]

const BlockType = new GraphQLObjectType({
  name: 'Block',
  description: 'This represents a book written by an author',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    accountId: { type: GraphQLNonNull(GraphQLInt) },
    account: {
      type: AccountType,
      resolve: (block) => {
        return accounts.find(account => account.id === block.accountId)
      }
    }
  })
})

const AccountType = new GraphQLObjectType({
  name: 'Account',
  description: 'This represents a account of a block',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    blocks: {
      type: new GraphQLList(BlockType),
      resolve: (account) => {
        return blocks.filter(block => block.accountId === account.id)
      }
    }
  })
})

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    block: {
      type: BlockType,
      description: 'A Single Block',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => blocks.find(block => block.id === args.id)
    },
    blocks: {
      type: new GraphQLList(BlockType),
      description: 'List of All Blocks',
      resolve: () => blocks
    },
    accounts: {
      type: new GraphQLList(AccountType),
      description: 'List of All Accounts',
      resolve: () => accounts
    },
    account: {
      type: AccountType,
      description: 'A Single Account',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => accounts.find(account => account.id === args.id)
    }
  })
})

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addBlock: {
      type: BlockType,
      description: 'Add a block',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        accountId: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        const block = { id: blocks.length + 1, name: args.name, accountId: args.accountId }
        blocks.push(block)
        return block
      }
    },
    addAccount: {
      type: AccountType,
      description: 'Add an account',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        const account = { id: accounts.length + 1, name: args.name }
        accounts.push(account)
        return account
      }
    }
  })
})

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true
}))
app.listen(5000, () => console.log('Server Running'))
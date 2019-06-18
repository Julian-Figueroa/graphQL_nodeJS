const graphql = require('graphql');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

let companiesUrl = 'http://localhost:3000/companies/';
let usersUrl = 'http://localhost:3000/users/';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios
          .get(`${companiesUrl}${parentValue.companyId}/`)
          .then(resp => resp.data);
      }
    }
  })
});

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios
          .get(`${companiesUrl}${parentValue.id}/users/`)
          .then(resp => resp.data);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios.get(`${usersUrl}${args.id}`).then(resp => resp.data);
      }
    },
    company: {
      type: CompanyType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios.get(`${companiesUrl}${args.id}`).then(resp => resp.data);
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return axios.get(`${usersUrl}`).then(resp => resp.data);
      }
    },
    companies: {
      type: new GraphQLList(CompanyType),
      resolve(parent, args) {
        return axios.get(`${companiesUrl}`).then(resp => resp.data);
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: {
          type: new GraphQLNonNull(GraphQLString)
        },
        age: {
          type: new GraphQLNonNull(GraphQLInt)
        },
        companyId: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        let user = {
          firstName: args.firstName,
          age: args.age,
          companyId: args.companyId
        };
        return axios.post(`${usersUrl}`, user).then(resp => resp.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve(parentValue, args) {
        return axios.delete(`${usersUrl}/${args.id}`).then(resp => resp.data);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        },
        firstName: {
          type: GraphQLString
        },
        age: {
          type: GraphQLInt
        },
        companyId: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        let user = {
          firstName: args.firstName,
          age: args.age,
          companyId: args.companyId
        };
        return axios
          .put(`${usersUrl}/${args.id}`, user)
          .then(resp => resp.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

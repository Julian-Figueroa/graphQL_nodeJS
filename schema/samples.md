#Single User
{
user(id: "20") {
firstName
age
id,
company {
name,
description
}
}
}

#Single Company
{
company(id:"3") {
name,
description,
id,
users {
firstName,
age,
id
}
}
}

#All Users
{
users {
firstName,
age,
id,
company {
name,
description
}
}
}

#All Companies
{
companies {
name,
description,
id,
users {
firstName,
age
}
}
}

#Fragments Query
{
apple: company(id:"1") {
...companyDetails
}
}
fragment companyDetails on Company {
id
name
description
}

#Mutation
mutation {
addUser(firstName: "Julian", age: 30) {
id
}
}

mutation {
deleteUser(id: "21") {
id
firstName
age
}
}

mutation {
editUser(id: "Bv4Kk8U", firstName: "Julian", age: 50, companyId: "3") {
id
firstName
age
company{
name
}
}
}

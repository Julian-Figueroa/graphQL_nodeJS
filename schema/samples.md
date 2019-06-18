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

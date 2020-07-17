export const constraints = [
  'CREATE CONSTRAINT ON (u:User) ASSERT u.username IS UNIQUE',
  'CREATE CONSTRAINT ON (r:Role) ASSERT r.name IS UNIQUE',
  'CREATE CONSTRAINT ON (r:Restaurant) ASSERT r.name IS UNIQUE'
]
export const role = [
  'CREATE (r:Role {id: $id})',
  'SET r.name = $name, r.permissions = $permissions'
]

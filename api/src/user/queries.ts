export const find = [
  'MATCH (u: User {username: $name})-[:Is]->(r: Role)',
  'RETURN u, r'
]

export const register = [
  'MATCH (r: Role {id: $r_id})',
  'CREATE (u: User {id: $u_id})-[:Is]->(r)',
  'SET u.username = $u_name, u.password = $u_pass',
  'RETURN u, r'
]

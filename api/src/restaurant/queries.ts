export const read = [
  'MATCH (u:User)-[:Owns]->(r:Restaurant)',
  'WHERE r.status = $status',
  'RETURN u, r',
  'ORDER BY r.name',
  'SKIP $skip',
  'LIMIT $limit'
]
export const create = [
  'MATCH (u:User {id: $u_id})',
  'CREATE (u)-[:Owns]->(r:Restaurant {id: $r_id})',
  'SET r.name = $r_name,  r.description = $r_description, r.status = $r_status',
  'RETURN u, r'
]
export const update = [
  'MATCH (u:User {id: $u_id})-[:Owns]->(r:Restaurant {id: $r_id})',
  'SET r.name = $r_name, r.description = $r_description',
  'RETURN u, r'
]
export const change = [
  'MATCH (u:User {id: $u_id})-[:Owns]->(r:Restaurant {id: $r_id})',
  'SET r.status = $r_status',
  'RETURN u, r'
]

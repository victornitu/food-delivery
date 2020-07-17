export const read = [
  'MATCH (:Restaurant {id: $id})-[s:Serves]->(m:Meal)',
  'WHERE s.status = $status',
  'RETURN m, s',
  'ORDER BY m.name',
  'SKIP $skip',
  'LIMIT $limit'
]
export const create = [
  'MATCH (:User {id: $u_id})-[:Owns]->(r:Restaurant {id: $r_id})',
  'CREATE (r)-[s:Serves]->(m: Meal {id: $m_id})',
  'SET m.name = $m_name, m.description = $m_description, s.price = $m_price, s.status = $m_status',
  'RETURN m, s'
]
export const update = [
  'MATCH (:User {id: $u_id})-[:Owns]->(:Restaurant {id: $r_id})-[s:Serves]->(m:Meal {id: $m_id})',
  'SET m.name = $m_name, m.description = $m_description, s.price = $m_price',
  'RETURN m, s'
]
export const change = [
  'MATCH (:User {id: $u_id})-[:Owns]->(:Restaurant {id: $r_id})-[s:Serves]->(m:Meal {id: $m_id})',
  'SET s.status = $m_status',
  'RETURN m, s'
]

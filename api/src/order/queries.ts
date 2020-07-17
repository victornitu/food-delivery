export const customer = [
  'MATCH (u: User {id: $id})-[:Has]->(o:Order)-[:Contains]->(:Meal)<-[:Serves]-(r:Restaurant)<-[:Owns]-(a:User)',
  'RETURN u, o, r, a',
  'ORDER BY o.date'
]

export const owner = [
  'MATCH (a:User {id: $id})-[:Owns]->(r:Restaurant)-[:Serves]->(:Meal)<-[:Contains]-(o:Order)<-[:Has]-(u:User)',
  'RETURN u, o, r, a',
  'ORDER BY o.date'
]

export const meal = [
  'MATCH (:Order {id: $id})-[c:Contains]->(m:Meal)',
  'RETURN c, m',
  'ORDER BY m.name'
]

export const read = [
  'MATCH (:Restaurant {id: $r_id})-[s:Serves]->(m:Meal)',
  'WHERE m.id IN $m_ids',
  'RETURN m, s',
  'ORDER BY m.id'
]

export const create = [
  'MATCH (u:User {id: $u_id})',
  'MATCH (r:Restaurant {id: $r_id})<-[:Owns]-(a:User)',
  'CREATE (u)-[:Has]->(o: Order {id: $o_id})',
  'SET o.date = datetime(), o.status = $o_status, o.total = $o_total',
  'RETURN u, o, r, a'
]

export const link = [
  'MATCH (o:Order {id: $o_id})',
  'MATCH (m:Meal {id: $m_id})',
  'CREATE (o)-[c:Contains]->(m)',
  'SET c.price = $m_price, c.amount = $m_amount'
]

export const update = [
  'MATCH (u:User {id: $u_id})-[:Has]->(o:Order {id: $o_id, status: $o_status})-[:Contains]->(:Meal)<-[:Serves]-(r:Restaurant)<-[:Owns]-(a:User)',
  'SET o.status = $o_next',
  'RETURN u, o, r, a'
]

export const manage = [
  'MATCH (a:User {id: $u_id})-[:Owns]->(r:Restaurant)-[:Serves]->(:Meal)<-[:Contains]-(o:Order {id: $o_id, status: $o_status})<-[:Has]-(u:User)',
  'SET o.status = $o_next',
  'RETURN u, o, r, a'
]

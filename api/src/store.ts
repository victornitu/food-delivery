import neo4j, { AuthToken, Record as Neo4jRecord } from 'neo4j-driver'
import { Parameters, Settings } from './requests'
import { getter } from './utils'

declare type Extractor<T> = (r: Record) => T

export class Record {
  constructor (readonly record: Neo4jRecord) {}

  getter (key: string) {
    const {properties} = this.record.get(key)
    return getter(properties)
  }
}

export class Store<T> {
  readonly uri: string
  readonly key: AuthToken

  constructor ({host, port, user, pass}: Settings, readonly extractor: Extractor<T>) {
    this.uri = `bolt://${host}:${port}`
    this.key = neo4j.auth.basic(user, pass)
  }

  async run (queries: Array<string>, params?: Parameters) {
    const driver = neo4j.driver(this.uri, this.key)
    const session = driver.session()
    try {
      await session.run(queries.join(' '), params)
    } catch (e) {
      throw e
    } finally {
      await session.close()
      await driver.close()
    }
  }

  async execute (queries: Array<string>, params?: Parameters): Promise<Array<T>> {
    const driver = neo4j.driver(this.uri, this.key)
    const session = driver.session()
    try {
      const result = await session.run(queries.join(' '), params)
      return result.records.map(r => this.extractor(new Record(r)))
    } catch (e) {
      throw e
    } finally {
      session.close()
    }
  }
}

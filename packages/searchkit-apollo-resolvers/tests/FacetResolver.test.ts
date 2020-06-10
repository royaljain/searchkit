import { SearchkitConfig } from '../src/resolvers/ResultsResolver'
import { MultiMatchQuery } from '../src'
import { MultipleSelectFacet } from '../src/facets'
import { setupTestServer, callQuery } from './support/helper'

describe('Facet Resolver', () => {
  describe('should return as expected', () => {
    const runQuery = async (gql) => {
      const response = await callQuery({ gql })
      return response
    }

    const config: SearchkitConfig = {
      host: 'http://localhost:9200/movies/_search',
      hits: {
        fields: ['actors', 'writers']
      },
      query: new MultiMatchQuery({ fields: ['actors', 'writers', 'title^4', 'plot'] }),
      facets: [new MultipleSelectFacet({ id: 'writers', field: 'writers.raw', label: 'Writers' })]
    }

    it('should return correct Results', async () => {
      setupTestServer(config)

      const gql = `
        {
          results(query: "") {
            facet(id: "writers", query: "te") {
              id
              type
              label
              entries {
                id
                count
                label
              }
            }
          }
        }
      `

      const response = await runQuery(gql)
      expect(response.body.data).toMatchSnapshot()
      expect(response.status).toEqual(200)
    })
  })
})

import http from 'http'

import { routes } from './routes.js'
import { json } from './middlewares/json.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer(async (request, response) => {
    const { method, url } = request

    await json(request, response)

    /* 
        Vai buscar se existe uma rota, com o mesmo method passado e mesma 
        url passada. Vale lembrar que esse test, é oriundo da regex que foi 
        criada e esta sendo recebida nas rotas no path, lembrando que toda regex
        possui um path. O test presente da regex, retorna true, ou false caso a string
        que voce esteja enviando seja valida ou nao.    
    */

    const route = routes.find(route => {
        return route.method === method && route.path.test(url)
    })

    if(route) {

        /*
            Executar a URL para saber quais foram os dados que foram encontrados
        */

        const routeParams = request.url.match(route.path)

        const { query, ...params } = routeParams.groups

        request.params = params

        /* 
            Se o meu query estiver vazio, vou retornar um novo objeto so que vazio.
        */

        request.query = query ? extractQueryParams(query) : {}

        return route.handler(request, response)
    }

    return response.end('Hello World')
})

server.listen(3333)
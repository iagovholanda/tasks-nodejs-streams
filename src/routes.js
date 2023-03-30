import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()


export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {

            const { search } = request.query
            /*
                Verifica se a informacao passada como queryParams existe ou no title e description.

                Caso exista em algum dos campos a informacao passado nos query params entao é valido. 
                Se o que for passado no search for invalido, ele retorna um array vazio

                Lembrando que ele so verifica se caso existir um search, que nada mais é que um query params
                que esta sendo ou vai ser passado.
            */
            const tasks = database.select('tasks', search ? {
                id,
                title: search,
                description: search,
            } : null)
            
            return response
                .end(JSON.stringify(tasks))
        } 
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (request, response) => {
            const { title, description } = request.body

            if(!title) {
                return response.writeHead(400).end(
                    JSON.stringify({ message: 'Title is required'})
                )
            }

            if(!description) {
                return response.writeHead(400).end(
                    JSON.stringify({ message: 'Description is required'})
                )
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            }

            database.insert('tasks', task)

            return response.writeHead(201).end()
            
        } 
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (request, response) => {
            const { id } = request.params
            const { title, description } = request.body

            /*
                Ao se atualiza um registro task, é necessario que uma das informacoes sejao atualizadas. 
            */
            if(!title || !description ) {
                return response
                    .writeHead(400)
                    .end({ message: 'Title or description is required'})
            }

            /*
                Vou procurar a tabela no qual eu desejo atualizar o registro.
            */
            const [task] = database.select('tasks', id )


            if(!task) {
                return response.writeHead(400).end()
            }

            database.updated = {
                title,
                description,
                updated_at: new Date()
            }

            return response.writeHead(200).end()
        } 
    },
    {
        method: 'DELETE',
        path: buildRoutePath ('/tasks/:id'),
        handler: (request, response) => {
            const { id } = request.params

            const [task] = database.select('tasks',  id )

            if(!task) {
                return response.writeHead(400).end()
            }

            database.delete(task)
            return response.writeHead(204).end()
        } 
    },
    {
        method: 'PATCH',
        path: buildRoutePath ('/tasks/:id/complete'),
        handler: (request, response) => {
            const { id } = request.params

            const [task] = database.select('tasks',  id )

            if(!task) {
                return response.writeHead(400).end()
            }

            /* Incompleta */

            return response.writeHead(204).end()
        }
    }

]
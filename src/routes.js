import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()


export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/users'),
        handler: (request, response) => {
            const tasks = database.select('users', {
                id,
                title,
                description,
                completed_at,
                created_at,
                updated_at,
            })
            
            return response
                .end(JSON.stringify(tasks))
        } 
    },
    {
        method: 'POST',
        path: buildRoutePath('/users'),
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
                id: randomUUID,
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
        path: buildRoutePath('/users/:id'),
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
            const [task] = database.select('tasks', { id })


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
        path: buildRoutePath ('/users/:id'),
        handler: (request, response) => {
            const { id } = request.params

            const [task] = database.select('tasks', { id })

            if(!task) {
                return response.writeHead(400).end()
            }

            database.delete(task)
            return response.writeHead(204).end()
        } 
    },
    {
        method: 'PATCH',
        path: buildRoutePath ('/users/:id/complete'),
        handler: (request, response) => {
            const { id } = request.params

            const [task] = database.select('tasks', { id })

            if(!task) {
                return response.writeHead(400).end()
            }

            /* Incompleta */

            return response.writeHead(204).end()
        }
    }

]
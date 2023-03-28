import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    /*
        Objeto onde vão ser saldo as informacoes. 
        # -> O objetivo dessa simbologia e deixar as informacao deste objeto privadas.
    */
    #database = { }

    #persist() {
        /* 
            db.json -> Nome do arquivo que foi criado.
            JSON.stringify(this.#database) -> Para se trabalhar com arquivos em stream
            é necessario ser convertido em string.
        */


        fs.writeFile('db.json', JSON.stringify(this.#database))
    }


    /* Retorna todos os dados obtidos nas tabelas dos bancos de dados. */
    select(table) {

        let data = this.#database[table] ?? []
        return data
    }

    /* Metodo de insercao de informacao no objeto. */
    insert(table, data) {
        /*
            Se existir um array dentro do objeto database, entao inserimos os dados
            que estamos enviado na tabela encontrada. Caso nao exista, um novo array
            é criado com o dado passado.
        */
        if(Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        return data
    }

    updated(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)


        if(rowIndex > -1) {
            this.#database[table][rowIndex] = { id, ...data}
            this.#persist()
        }
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if(rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }
}
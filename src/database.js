import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    /*
        Objeto onde vão ser saldo as informacoes. 
        # -> O objetivo dessa simbologia e deixar as informacao deste objeto privadas.
    */
    #database = {}

    /*
        Metodo classe mae, sempre quando instanciado a classe, este metodo sera executado
        de forma automatica. Neste metodo constructor, e realizado a leitura do arquivo ou
        base de dados existente, no qual, todos os dados presente na mesma sao lidos e inseridos 
        dentro do objeto database, apos convertido.

        Caso a base de dados não exista, ela sera criada vazia da mesma forma.
    */
    constructor() {
        fs.readFile(databasePath, 'utf8')
            .then(data => {
                this.#database = JSON.parse(data)
            })
            .catch(() => {
                this.#persist()
            })
    }

    #persist() {
        /* 
            db.json -> Nome do arquivo que foi criado.
            JSON.stringify(this.#database) -> Para se trabalhar com arquivos em stream
            é necessario ser convertido em string.
        */


        fs.writeFile('db.json', JSON.stringify(this.#database))
    }


    /* Retorna todos os dados obtidos nas tabelas dos bancos de dados. */
    select(table, search) {

        /* 
            Como o valor de data passar receber alteracoes, ele deixar de ser const e passar a ser let.
            no qual permite que alteracoes sejam realizadas.

            O search trata-se de uma objeto, portanto para que possamos percorrer as informacao dentro 
            dele temos que transformar em um array. Realizamos isso por meio do Object.entries(search)

             { nome = 'Iago', email = 'iago@example.com' }
             [['nome', 'Iago'], ['email', 'iago@example.com']]   -> Como funciona o Object.entries

        
            some -> Metodo some, percorre o array, onde se pelo menos uma informacao ele retornar true
            quer dizer entao que o item que ele retornou true, deve ser incluido no filter.

            toLowerCase -> Colocando tudo em caixa baixa.
            toUpperCase -> Colocando tudo em caixa alta.

            */
        let data = this.#database[table] ?? []

        if(search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase)
                })
            })
        }

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

        this.#persist()

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
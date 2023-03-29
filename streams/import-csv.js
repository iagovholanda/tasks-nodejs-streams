import csv from 'csv-parser'
import fs from 'node:fs'

const csvPath = new URL('../db.json', import.meta.url)

/* 
    createReadStream -> Funcao responsavel pela abertura e leitura dos dados
    presentes dentro do arquivo. Essa funcao recebe dois parametros, que se trata
    do caminho do arquivo que vai ser lido e outro parametro opicional.
*/
const stream = fs.createReadStream(csvPath)

const csvParse = csv.parse({
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2
})

async function run() {
/* pipe -> Chamando uma stream dentro de outra stream. */
const lineParse = stream.pipe(csvParse)

for await (const line of lineParse) {
    const [title, description] = line

    await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                description
            })
        })
    }
}

run()
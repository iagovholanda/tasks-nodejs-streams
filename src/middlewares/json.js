export async function json(request, response) {
    /*
        Aqui mais uma vez e utilizado o conceito de leitura de streams.
        Onde todo o corpo da requisicao vai ser lido, no qual depois que o corpo estiver lido por completo
        ele é transformado em JSON, utilizando os dados enviados para a criacao da informacao por meio do 
        body, corpo da requisicao.
    */
    
    const buffers = []

    /*
        Cada pedaço lido na requesicao é armazenado dentro do buffer(array) existente.
    */

    for await (const chunk of request) {
        buffers.push(chunk)
    }

    /* 
        Vai concatenar as todos os pedacos lidos e inseridos dentro dos buffers
        convertendo os mesmo para string. Aqui é onde todo o corpo da requisicao
        é convertido em JSON.
    */
    try {
        request.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch (error) {
        request.body = null
    }
}
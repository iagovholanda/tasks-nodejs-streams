export function buildRoutePath(path) {
    /*
        Regex -> Expressao Regular

        Uma forma de encontrar textos em um formato especifico, em um outro 
        texto de tamanho bem maior.
    */
    const routeParametersRegex = /:([a-zA-Z]+)/g

    /* 
        Encontrar na string path, todos os locais que possuam parametros dinamicos, substituindo
        por uma string, que tambem é outro regex.
        + -> Uma informacao com um ou mais caracteries que tenha essa informacao.

        ?<id> -> Nomeia o retorno de um objeto com os dados da URL.

    */
    const paramsWithParams  = path.replaceAll(routeParametersRegex,'(?<$1>[a-z0-9\-_]+)')


    /*
        Significa dizer que a string comeca com regex criada anteriormente.
        ? -> Apos o parenteses, torna-se opcional.
        . -> Qualquer caracter
        * -> Inumeras vezes

        ^ -> Comeca com a regex indicada com sua respectiva caracteristica como definida acima.
        ?<> - Para criacao de um novo grupo sempre e utilizado estes caracteries.
        $ ----------- $ => Não pode conter nada que esteja nessa verificacao do regex.
        \\? -> Para que ele entenda que para poder enviar um query params precisamos do ponto de interrogacao.
    */
    
    const pathRegex = new RegExp(`^${paramsWithParams}(?<query>\\?(.*))?$`)

    /*
        Toda Regex, possui um metodo chamado test que retorna TRUE ou FALSE
        caso a string que esteja sendo enviada seja valida ou não.
    */

    return pathRegex
}
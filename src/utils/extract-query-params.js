/* 
    substr(1) -> Quero que ignore o primeiro caracter.
    split(&) -> Separando apartir do &. Pois query params podem vir seguidos como por exemplo.
        search='Iago'&idade='20'
    reduce => Percorrer o array criado pelo split e transformar em qualquer outra coisa.
    Por exemplo, no caso abaixo, eu percorro o array por meio do reduce, ao fim transformando
    em um objeto, ou seja, estrutura de dados que eu vou criar apartir do meu reduce.
*/

export function extractQueryParams(query) {
    return query.substr(1).split('&').reduce((queryParams, param) => {
        const [key, value] = param.split('=') /* [page, 2] */
        queryParams[key] = value

        return queryParams
    }, {})
}
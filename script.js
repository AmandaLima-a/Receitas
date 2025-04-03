/* 
    Lógica de programação - Passo a passo do q preciso fazer para desenvolver a aplicaçao corretamente 

    [x] - Pegar a informação do Input, quando o button for clicado 
    [x] - Ir até a API e trazer as informações 
    [x] - Colocar as receitas na tela
    [x] - Saber quando o usuario clicou na receita 
    [x] - Buscar informações da receita individual na API
    [x] - Colocar a receita individual na tela

*/


const form = document.querySelector('.buscar-form')
const receberLista = document.querySelector('.receber-lista')
const receberDetalhes = document.querySelector('.receber-detalhes')


form.addEventListener('submit', function(event){
    event.preventDefault() // Vai previnir que a tela reinicie 
    const inputValue = event.target[0].value

    buscaReceitas(inputValue)
})

async function buscaReceitas(ingrediente){   //para utilizar uma api temos que usar o "ASYNC" e o "AWAIT"
    receberLista.innerHTML = `<p>Carregando receitas...</p>`
    try {
        const resposta = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediente}`)   //o FETCH serve para que possamos acessar a api
        const data = await resposta.json()   //vou converter oq chegou em "resposta" para o frormato JSON(formato mais amigavel para ver nossas informações)
    
        showReceitas(data.meals)
    } catch(err) {
        receberLista.innerHTML = `<p>Nenhuma receita foi encontrada!</p>`
    }
}

function showReceitas(receitas){   //o ".map" pega item por item do array   /    com o innerHTML tudo que eu colocar dps do "=" (as receitas) vai injetar dentro da minha div
    receberLista.innerHTML = receitas.map( (item) => `  
        <div class="card-receita" onclick="getDetalhesReceitas(${item.idMeal})">
            <img src="${item.strMealThumb}" alt="imagem-receita">
            <h3>${item.strMeal}</h3>
        </div>
        `    
    ).join('')
}

async function getDetalhesReceitas(id){
    const resposta = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    const data = await resposta.json() 
    const receita = await data.meals[0]

    let ingredientes = ''

    for(let i = 1; i<= 20; i++){
        if(receita[`strIngredient${i}`]){
            ingredientes += `<li>${receita[`strIngredient${i}`]} - ${receita[`strMeasure${i}`]} </li>` 
        } else {
            break;    //vai parar de rodar o "for" (nao vai colocar os espaços vazios na tela)
        }
    }

    receberDetalhes.innerHTML = `
        <h2>${receita.strMeal}</h2>
        <img src="${receita.strMealThumb}" alt="${receita.strMeal}">
        <h3><span>Categoria: </span> ${receita.strCategory}</h3>
        <h3><span>Origem: </span> ${receita.strArea}</h3>
        <h3><span>Ingredientes:</span></h3>
        <ul>${ingredientes}</ul>
        <h3><span>Instruções: </span></h3>
        <p>${receita.strInstructions}</p>
        <p><span class="span2">Tags: </span> ${receita.strTags} </p>
        <p><span class="span2">Vídeo: </span> <a href="${receita.strYoutube}" target="_blank">Assista a receita no Youtube</a></p>
    `
}

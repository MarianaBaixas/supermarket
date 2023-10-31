// Função para carregar os dados JSON de http://127.0.0.1:3000/getCombinedJson
function loadJSONFromServer(callback) {
  fetch("http://127.0.0.1:3000/getSupermarketData")
    // fetch("http://127.0.0.1:3000/getCombinedJson")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Erro na resposta da API");
      }
      return response.json();
    })
    .then(function (data) {
      callback(null, data);
    })
    .catch(function (error) {
      console.error("Erro ao carregar os dados do servidor:", error);
      callback(error, null);
    });
}

// Função para remover acentos de uma string
function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Função para embaralhar um array
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Função para exibir o número de produtos
function displayProductCount() {
  var produtosExibidos = document.querySelectorAll(".produto").length;
  var totalProdutosElement = document.getElementById("totalProdutos");
  if (produtosExibidos > 0) {
    totalProdutosElement.textContent = produtosExibidos + " produtos";
  } else {
    totalProdutosElement.textContent = "Nenhum produto encontrado";
  }
}

// Restante do código
document.addEventListener("DOMContentLoaded", function () {
  var produtosContainer = document.getElementById("produtos-container");
  var allProducts = []; // Um array para armazenar todos os produtos
  var searchInput = document.getElementById("searchInput");
  var searchButton = document.getElementById("searchButton");
  var marketRadios = document.querySelectorAll('input[name="market"]');
  var categoryRadios = document.querySelectorAll('input[name="categorias"]');

  function displayProducts() {
    produtosContainer.innerHTML = ""; // Limpe o conteúdo atual do contêiner
    var searchInputValue = removeAccents(searchInput.value.toLowerCase());
    var searchWords = searchInputValue.split(" ");

    // Embaralhe a ordem dos produtos
    shuffleArray(allProducts);

    allProducts.forEach(function (item) {
      var nome = removeAccents(item.nome);
      var mercado = item.mercado;
      var departamento = item.departamento;

      var precoOriginal = parseFloat(item.preco_original);
      var precoOferta = parseFloat(item.preco_oferta);
      var urlImagem = item.img_pequena;

      if (searchWords.every((word) => nome.toLowerCase().includes(word))) {
        // Verifique se o mercado selecionado está nos radios de mercado
        var marketSelected = Array.from(marketRadios).find(
          (radio) => radio.checked
        ).value;

        if (marketSelected !== "MostrarTodos" && mercado !== marketSelected) {
          return;
        }

        // Verifique se a categoria selecionada está nos radios de categoria
        var categorySelected = Array.from(categoryRadios).find(
          (radio) => radio.checked
        ).value;

        if (categorySelected !== "Todas" && departamento !== categorySelected) {
          return;
        }

        var produtoLink = document.createElement("a");
        produtoLink.href = item.url; // Defina o URL do produto como destino do link
        produtoLink.target = "_blank";

        var produtoDiv = document.createElement("div");
        produtoDiv.className = "produto";

        var imgContainer = document.createElement("div"); // Crie uma div para a imagem
        imgContainer.className = "imagem-container"; // Adicione uma classe para estilização (opcional)

        var imgElement = document.createElement("img");
        imgElement.src = urlImagem;

        imgContainer.appendChild(imgElement); // Adicione a imagem à div da imagem

        var precoOriginalElement = document.createElement("p");
        precoOriginalElement.innerHTML = `<s>R$ ${precoOriginal.toFixed(
          2
        )}</s>`;
        var precoOfertaElement = document.createElement("p");
        precoOfertaElement.textContent = `R$ ${precoOferta.toFixed(2)}`;
        var mercadoElement = document.createElement("p");
        mercadoElement.textContent = mercado;
        var nomeElement = document.createElement("p");
        nomeElement.textContent = item.nome;

        produtoDiv.appendChild(mercadoElement);
        produtoDiv.appendChild(imgContainer);
        produtoDiv.appendChild(precoOriginalElement);
        produtoDiv.appendChild(precoOfertaElement);
        produtoDiv.appendChild(nomeElement);

        produtoLink.appendChild(produtoDiv); // Adicione o elemento do produto como filho do link

        produtosContainer.appendChild(produtoLink); // Adicione o link do produto ao contêiner
      }
    });

    displayProductCount(); // Atualize a contagem de produtos exibidos
  }

  // Encontre o botão "Limpar busca" e adicione um evento de clique
  var clearSearchButton = document.getElementById("clearSearchButton");
  clearSearchButton.addEventListener("click", function () {
    // Limpe o campo de busca
    searchInput.value = "";
    // Chame a função para exibir todos os produtos
    displayProducts();
  });

  // Evento de clique ao botão de pesquisa e aos radios de mercado e categoria
  searchButton.addEventListener("click", displayProducts);

  // Adicione eventos de clique aos radios de mercado e categoria
  marketRadios.forEach(function (radio) {
    radio.addEventListener("change", displayProducts);
  });
  categoryRadios.forEach(function (radio) {
    radio.addEventListener("change", displayProducts);
  });

  // Carregar os dados JSON do servidor
  loadJSONFromServer(function (error, data) {
    if (!error) {
      // Ajuste: Desaninhe a matriz de dados
      // allProducts = data.reduce(
      //   (mergedArray, marketArray) => mergedArray.concat(marketArray),
      //   []
      // );
      allProducts = data;
      displayProducts(); // Chame a função para exibir produtos após carregar os dados
    } else {
      console.error("Erro ao carregar os dados do servidor: " + error);
    }
  });
});

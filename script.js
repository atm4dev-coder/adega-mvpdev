// Alternar menu responsivo

const menuToggle = document.getElementById("menu-toggle");

const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {

  navLinks.classList.toggle("active");

});

// Profissionais fictícios para simular busca

const profissionais = [

  { nome: "Carlos Souza", servico: "Eletricista", cidade: "Recife" },

  { nome: "Maria Silva", servico: "Pintora", cidade: "Olinda" },

  { nome: "João Pereira", servico: "Encanador", cidade: "Jaboatão" },

  { nome: "Ana Costa", servico: "Diarista", cidade: "Paulista" },

  { nome: "Roberto Lima", servico: "Pedreiro", cidade: "Camaragibe" },
  
  { nome: "Fernanda Melo", servico: "Eletricista", cidade: "Recife" },
  
  { nome: "Pedro Alves", servico: "Pintora", cidade: "Jaboatão" },
  
  { nome: "Lúcia Santos", servico: "Diarista", cidade: "Olinda" }

];

// Função para preencher os filtros de serviço e cidade

function preencherFiltros() {
    const servicoFiltro = document.getElementById("servicoFiltro");
    const cidadeFiltro = document.getElementById("cidadeFiltro");

    // Coletar serviços e cidades únicos
    const servicosUnicos = [...new Set(profissionais.map(p => p.servico))].sort();
    const cidadesUnicas = [...new Set(profissionais.map(p => p.cidade))].sort();

    // Preencher Serviços
    servicosUnicos.forEach(servico => {
        const option = document.createElement("option");
        option.value = servico;
        option.textContent = servico;
        servicoFiltro.appendChild(option);
    });

    // Preencher Cidades
    cidadesUnicas.forEach(cidade => {
        const option = document.createElement("option");
        option.value = cidade;
        option.textContent = cidade;
        cidadeFiltro.appendChild(option);
    });
}

// Função para exibir a lista de profissionais
function exibirProfissionais(listaProfissionais) {
    const lista = document.getElementById("listaProfissionais");
    lista.innerHTML = "";

    if (listaProfissionais.length === 0) {
        lista.innerHTML = "<p>Nenhum profissional encontrado com os filtros selecionados.</p>";
    } else {
        listaProfissionais.forEach(p => {
            const card = document.createElement("div");
            card.classList.add("prof-card");
            card.innerHTML = `
                <h4>${p.nome}</h4>
                <p><strong>Serviço:</strong> ${p.servico}</p>
                <p><strong>Cidade:</strong> ${p.cidade}</p>
                <button class="btn-contratar">Contratar</button>
            `;
            lista.appendChild(card);
        });
    }
}

// Função de busca e filtragem

function buscarProfissionais() {
    const servicoSelecionado = document.getElementById("servicoFiltro").value;
    const cidadeSelecionada = document.getElementById("cidadeFiltro").value;

    const resultados = profissionais.filter(p => {
        const filtraServico = servicoSelecionado === "" || p.servico === servicoSelecionado;
        const filtraCidade = cidadeSelecionada === "" || p.cidade === cidadeSelecionada;
        
        return filtraServico && filtraCidade;
    });

    exibirProfissionais(resultados);

    // Rola para a seção de resultados após a busca
    document.getElementById("profissionais").scrollIntoView({ behavior: "smooth" });
}

// Inicialização: Preenche os filtros e exibe todos os profissionais ao carregar
window.onload = () => {
    preencherFiltros();
    exibirProfissionais(profissionais); // Exibe todos ao carregar a página
};

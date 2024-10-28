function validarData(data) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(data);
}

function listarTarefas(tarefasFiltradas = null) {
    const tarefas = tarefasFiltradas || JSON.parse(localStorage.getItem('tarefas')) || [];
    const tarefasLista = document.getElementById('tarefas-lista');
    tarefasLista.innerHTML = '';

    tarefas.forEach(tarefa => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${tarefa.titulo}</strong>
            <p>${tarefa.descricao}</p>
            <small>Data limite: ${tarefa.dataLimite.split('-').reverse().join('/')} | Status: ${tarefa.status}</small>
            <button class="remover">Remover</button>
        `;
        tarefasLista.appendChild(li);

        li.querySelector('.remover').addEventListener('click', function() {
            const index = tarefas.indexOf(tarefa);
            tarefas.splice(index, 1);
            localStorage.setItem('tarefas', JSON.stringify(tarefas));
            listarTarefas();
        });
    });
}

document.getElementById('adicionar').addEventListener('click', function() {
    const titulo = document.getElementById('titulo-tarefa').value;
    const descricao = document.getElementById('descricao-tarefa').value;
    const dataLimite = document.getElementById('data-limite').value;
    const status = document.getElementById('status-tarefa').value;
    const mensagemErro = document.getElementById('mensagem-erro');

    mensagemErro.style.display = 'none';
    mensagemErro.textContent = '';
    
    if (titulo.length < 3) {
        mensagemErro.style.display = 'block';
        mensagemErro.textContent = 'O título deve ter no mínimo 3 caracteres.';
        return;
    }
    if (titulo && descricao && validarData(dataLimite) && status) {
        const novaTarefa = { titulo, descricao, dataLimite, status };
        let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        tarefas.push(novaTarefa);
        localStorage.setItem('tarefas', JSON.stringify(tarefas));

        listarTarefas();

        document.getElementById('titulo-tarefa').value = '';
        document.getElementById('descricao-tarefa').value = '';
        document.getElementById('data-limite').value = '';
        document.getElementById('status-tarefa').value = '';
    } else {
        mensagemErro.style.display = 'block';
        mensagemErro.textContent = 'Por favor, preencha todos os campos corretamente.';
    }
});

document.getElementById('filtrar').addEventListener('click', function() {
    const statusFiltro = document.getElementById('filtro-status').value;
    const dataFiltro = document.getElementById('filtro-data').value;
    let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

    if (!statusFiltro && !dataFiltro) {
        listarTarefas();
        return;
    }

    if (statusFiltro) {
        tarefas = tarefas.filter(tarefa => tarefa.status === statusFiltro);
    }

    if (dataFiltro) {
        tarefas = tarefas.filter(tarefa => tarefa.dataLimite === dataFiltro);
    }

    listarTarefas(tarefas);
});

document.getElementById('desfiltrar').addEventListener('click', function() {
    document.getElementById('filtro-status').value = '';
    document.getElementById('filtro-data').value = '';
    listarTarefas();
});

document.addEventListener('DOMContentLoaded', listarTarefas);
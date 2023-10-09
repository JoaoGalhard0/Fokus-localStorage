const taskListContainer = document.querySelector('.app__section-task-list')

const formTask = document.querySelector('.app__form-add-task')
const toggleFormTaskBtn = document.querySelector('.app__button--add-task')
const formLabel = document.querySelector('.app__form-label')

const textArea = document.querySelector('.app__form-textarea')

const cancelFormTaskBtn = document.querySelector('.app__form-footer__button--cancel')
const deleteFormTaskBtn = document.querySelector('.app__form-footer__button--delete')
const btnDeletarConcluidas = document.querySelector('#btn-remover-concluidas')
const btnDeletarTodas = document.querySelector('#btn-remover-todas')

const taskAtiveDescription = document.querySelector('.app__section-active-task-description')

const localStorageTarefas = localStorage.getItem('tarefas')
let tarefas = localStorageTarefas ? JSON.parse(localStorageTarefas) : []

const taskIconSvg = `
<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
    <path
        d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
        fill="#01080E" />
</svg>
`

let tarefasSelecionadas = null
let itemTarefaSelecionada = null

let tarefaEmEdicao = null
let paragrafoEmEdicao = null

const selecionaTarefa = (tarefa, elemento) => {
    if (tarefa.concluida) {
        return
    }

    document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
        button.classList.remove('app__section-task-list-item-active')
    })

    if (tarefasSelecionadas == tarefa) {
        taskAtiveDescription.textContent = null
        itemTarefaSelecionada = null
        tarefasSelecionadas = null
        return
    }

    tarefasSelecionadas = tarefa
    itemTarefaSelecionada = elemento
    taskAtiveDescription.textContent = tarefa.descricao
    elemento.classList.add('app__section-task-list-item-active')
}

const limparForm = () => {
    tarefaEmEdicao = null
    paragrafoEmEdicao = null
    textArea.value = ''
    formTask.classList.add('hidden')
}

const selecionaTarefaParaEditar = (tarefa, elemento) => {
    if (tarefaEmEdicao == tarefa) {
        limparForm()
        return
    }

    formLabel.textContent = 'Editando Tarefa'
    tarefaEmEdicao = tarefa
    paragrafoEmEdicao = elemento
    textArea.value = tarefa.descricao
    formTask.classList.remove('hidden')
}

const removerTarefas = (somenteConcluidas) => {
    const seletor = somenteConcluidas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    document.querySelectorAll(seletor).forEach((element) => {
        element.remove();
    });

    tarefas = somenteConcluidas ? tarefas.filter(t => !t.concluida) : []
    updateLocalStorage()
}

btnDeletarConcluidas.addEventListener('click', () => removerTarefas(true))
btnDeletarTodas.addEventListener('click', () => removerTarefas(false))

function createTask(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svgIcon = document.createElement('svg')
    svgIcon.innerHTML = taskIconSvg

    const paragraph = document.createElement('p')
    paragraph.classList.add('app__section-task-list-item-description')
    paragraph.textContent = tarefa.descricao

    const button = document.createElement('button')

    button.classList.add('app_button-edit')
    const editIcon = document.createElement('img')
    editIcon.setAttribute('src', '/imagens/edit.png')

    li.onclick = () => {
        selecionaTarefa(tarefa, li)
    }

    svgIcon.addEventListener('click', (event) => {
        if(tarefa == tarefasSelecionadas) {
            event.stopPropagation()
            button.setAttribute('disabled', true)
            li.classList.add('app__section-task-list-item-complete')
            tarefasSelecionadas.concluida = true
            updateLocalStorage()
        }

    })

    if (tarefa.concluida) {
        button.setAttribute('disabled', true)
        li.classList.add('app__section-task-list-item-complete')
    }

    li.appendChild(svgIcon)
    li.appendChild(paragraph)
    li.appendChild(button)
    button.appendChild(editIcon)

    button.addEventListener('click', (event) => {
        event.stopPropagation()
        selecionaTarefaParaEditar(tarefa, paragraph)
    })

    return li
}

tarefas.forEach(task => {
    const taskItem = createTask(task)
    taskListContainer.appendChild(taskItem)
})

toggleFormTaskBtn.addEventListener('click', () => {
    formLabel.textContent = 'Adicionando tarefa'
    formTask.classList.toggle('hidden')
})

cancelFormTaskBtn.addEventListener('click', () => {
    formTask.classList.add('hidden')
})

deleteFormTaskBtn.addEventListener('click', () => {
    if(tarefasSelecionadas) {
        const index = tarefas.indexOf(tarefasSelecionadas)

        if(index !== -1) {
            tarefas.splice(index, 1)
        }

        itemTarefaSelecionada.remove()
        tarefas.filter(t => t!= tarefasSelecionadas)
        itemTarefaSelecionada = null
        tarefasSelecionadas = null
    }
    updateLocalStorage()
})

const updateLocalStorage = () => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))
}

formTask.addEventListener('submit', (evento) => {
    evento.preventDefault()
    if (tarefaEmEdicao) {
        tarefaEmEdicao.descricao = textArea.value
        paragrafoEmEdicao.textContent = textArea.value
    } else {
        const task = {
            descricao: textArea.value,
            concluida: false
        }
        tarefas.push(task)
        const taskItem = createTask(task)
        taskListContainer.appendChild(taskItem)
    }
    updateLocalStorage()
    limparForm()
})

document.addEventListener('TarefaFinalizada', function (e) {
    if (tarefasSelecionadas) {
        tarefasSelecionadas.concluida = true
        itemTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        itemTarefaSelecionada.querySelector('button').setAttribute('disabled', true)
        updateLocalStorage()
    }
})





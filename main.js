class Tasks {
    constructor() {
        const generateID = () => {
            return Math.random().toString(36).substr(2, 10);
        };

        this.defaultTasks = [
            {
                id: generateID(),
                title: 'Task 1',

            },
            {
                id: generateID(),
                title: 'Task 2',

            },
            {
                id: generateID(),
                title: 'Task 3',

            },
            {
                id: generateID(),
                title: 'Task 4',

            },
            {
                id: generateID(),
                title: 'Task 5',

            }
        ];
    }

    getTasksFromLS() {
        return JSON.parse(localStorage.getItem('tasks')) || this.defaultTasks && Tasks.setTasksToLS(this.defaultTasks);
    }

    static setTasksToLS(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

class Component extends Tasks {
    constructor() {
        super();
        this.tasks = new Tasks().getTasksFromLS();
    }

    afterRender() { }
}


class AddAndList extends Component {
    render() {
        return new Promise(resolve => {
            resolve(`     
                    <h1 class="page-title">Tasks List</h1>
                    
                    <div class="task-add">
                        <input class="task-add__title" type="text" placeholder="Task">                    
                        
                        <button class="task-add__btn-add button" name = "button" disabled>Add Task</button>
                    </div>       
                      
                    <div class="tasks">
                    <input type="checkbox" class= "page-title__forbidden" id="page-title__forbidden" name="closeEdit"
                    value="closeEdit">
                    <label for="closeEdit">Editing Closed</label><br>
                        <div class="tasks__list">
                            ${this.tasks.map(task => this.getTaskHTML(task)).join('\n ')}
                        </div>
                    </div>            
                `);
        });
    }

    afterRender() {
        this.setActions();
    }

    setActions() {
        const addTaskTitle = document.getElementsByClassName('task-add__title')[0],
            addTaskBtn = document.getElementsByClassName('task-add__btn-add')[0],
            tasksContainer = document.getElementsByClassName('tasks')[0],
            tasksList = document.getElementsByClassName('tasks__list')[0],
            allButtons = document.getElementsByClassName('button'),
            pageTitleForbidden = document.getElementById('page-title__forbidden');
        console.log(pageTitleForbidden)
        console.log(allButtons)

        addTaskTitle.addEventListener('keyup', () => addTaskBtn.disabled = !addTaskTitle.value.trim());
        addTaskBtn.addEventListener('click', () => this.addTask(addTaskTitle, addTaskBtn, tasksList));
        pageTitleForbidden.addEventListener('click', () => this.closeEdit(pageTitleForbidden, allButtons));

        tasksContainer.addEventListener('click', event => {
            const target = event.target,
                targetClassList = target.classList;

            switch (true) {
                case targetClassList.contains('task__btn-remove'):
                    this.removeTask(target.parentNode.parentNode);
                    break;
            }
        });
    }

    addTask(addTaskTitle, addTaskBtn, tasksList) {
        const generateID = () => {
            return Math.random().toString(36).substr(2, 10);
        };
        const newTask = {
            id: generateID(),
            title: addTaskTitle.value.trim(),
        };

        this.tasks.push(newTask);
        Tasks.setTasksToLS(this.tasks);

        this.clearAddTask(addTaskTitle, addTaskBtn);

        tasksList.insertAdjacentHTML('beforeEnd', this.getTaskHTML(newTask));
    }


    getTaskHTML(task) {
        return `
                <div class="task" data-id="${task.id}">
                    <a class="task__title" data-id="${task.id}">${task.title}</a>
                    <div class="task__buttons" name = "button">
                        <button class="task__btn-remove button">Remove</button>   
                    </div>                            
                </div>
            `;
    }

    clearAddTask(addTaskTitle, addTaskBtn) {
        addTaskTitle.value = '';
        addTaskBtn.disabled = true;
    }

    closeEdit(pageTitleForbidden, allButtons) {
        let arrButton = Array.from(allButtons);
        if (pageTitleForbidden.checked) {
            arrButton.forEach(function (item) {
                item.disabled = true
            })
        } else {
            arrButton.forEach(function (item) {
                item.disabled = false
            })
        }
    }

    removeTask(taskContainer) {
        if (confirm('Are you sure?')) {
            this.tasks = this.tasks.filter(task => task.id !== taskContainer.dataset.id);
            Tasks.setTasksToLS(this.tasks);

            taskContainer.remove();
        }
    }
}

function router() {
    const contentContainer = document.getElementsByClassName('content-container')[0],
        page = new AddAndList();

    page.render().then(html => {

        contentContainer.innerHTML = html;
        page.afterRender();
    });

}

window.addEventListener('load', router);
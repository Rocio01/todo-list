import { format } from "date-fns";
import { projectFactory, projectProto } from "./project";
import { getProjectsLS, addProjectLS, deleteProjectLS } from "./localstorage"
import { todoFactory } from "./todo.js";
import { toDos } from "./ui-tasks"; 
import { newProjectForm } from "./form"
import "./style.css";


const panel = () => {
  let projects = [];
  const element = document.createElement("aside");
  element.className = "side-panel";

  const projectContainer = document.createElement("div");
  projectContainer.className = "project-container";

  const clearProjects = () => {
    let projectsList = document.querySelector(".projects-ul");
    projectsList.remove();
  }

  const createDeleteBtn = (project, projectLI) => {
    let deleteBtn = document.createElement("button")
    let deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-trash";
    deleteBtn.appendChild(deleteIcon);
    projectLI.appendChild(deleteBtn);
    deleteBtn.addEventListener('click', () => {
      deleteProject(project);
      displayProjects();
    });
  }

  const createToDosBtn = (project, projectLI) => {
    let toDosBtn = document.createElement('button');
    toDosBtn.className = "add-task-btn"
    toDosBtn.innerHTML = "Add task";
    projectLI.appendChild(toDosBtn);
    toDosBtn.addEventListener('click', () => {
      let todosContainer = document.querySelector('.todos-container')
      if (todosContainer) { todosContainer.remove() };
      document.body.appendChild(toDos(project));
    });
  }

  const createShowProjectTasksButton = (project, projectLI) => {
    let toDosShowBtn = document.createElement('button');
    toDosShowBtn.innerHTML = "Show";
    projectLI.appendChild(toDosShowBtn);
     toDosShowBtn.addEventListener('click', () => {
      let todos = document.querySelector('.toDos-div')
     if (todos !== null) {
        todos.remove();
      } 
       document.body.appendChild(project.displayTasks());
      
     });
  }

  const deleteProject = (project) => {
    deleteProjectLS(project);
    const deletedProject = document.querySelector(`.project-li-${project.id}`)
    deletedProject.remove();
    location.reload();
  }

  const displayProjects = () => {
    if (projectContainer.children.length > 0) {
      clearProjects();
    }
    const projectList = document.createElement("ul");
    projectList.className = "projects-ul";
    let projects = getProjectsLS();
    projects.forEach((project) => {
      Object.setPrototypeOf(project, projectProto)
      let projectLink = document.createElement("li");
      projectLink.className = `project-li-${project.id}`;
      projectLink.innerHTML = project.title;
      createDeleteBtn(project, projectLink);
      createToDosBtn(project, projectLink);
      createShowProjectTasksButton(project, projectLink);
      projectList.appendChild(projectLink);
    });
    projectContainer.appendChild(projectList);
  }

  if (localStorage.getItem("projects") != null) {
    displayProjects();
  }

  element.appendChild(projectContainer);

  // New Project UI
  const newProjectBtn = document.createElement("p");
  newProjectBtn.innerHTML = "New project";

  let projectForm = newProjectForm();
  element.appendChild(projectForm);


  const newProject = (str) => {
    const myProject = projectFactory(str);

    addProjectLS(myProject);
  };

  newProjectBtn.onclick = () => {
    projectForm.style.display = "block";
  };

  //   window.onclick = (event) => {
  //   if (event.target !== newProjectBtn && event.target !== projectForm.parentNode.children ) {
  //     projectForm.style.display = "none";
  //   }
  // }

  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = projectForm.elements.title.value;
    newProject(title);
    projectForm.style.display = "none";
    displayProjects();
  }); // add client-side validations for empty or too long strings

  element.appendChild(newProjectBtn);
  element.appendChild(projectForm);

  return element;
};

export { panel as default };
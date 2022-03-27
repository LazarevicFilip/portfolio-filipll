window.onload = () => {
    // fetch call with get method
    async function getData(skill){
        const response = await fetch(`assets/data/${skill}.json`);

        const data = await response.json();
        return data;
    }
    // initial display 
    getData("frontend")
    .then(data => printSkills(data))
    .catch(err => console.log(err));

    // menu
    getData("menu")
    .then(data => {
        let output = ''
        data.forEach(link => {
            output += `<li class="menu-links"><a href="${link.href}">${link.tittle}</a></li>`
        });
        menu.innerHTML = output;
    })
    .catch(err => console.log(err));
      // ham menu
      const ham = document.querySelector(".menu-btn");
      // toggle class to show side menu and disable scroll
      ham.addEventListener("click",() => {
          document.querySelector(".navbar-menu").classList.toggle("show");
          document.body.classList.toggle("no-scroll");
      });
        //event for links in manu
      document.body.addEventListener("click", (e) => {
          if(e.target.parentElement.classList.contains("menu-links")){
              // if nav is side menu,disable scroll and hide sidebar
              if(e.target.parentElement.parentElement.classList.contains("show")){
                  document.body.classList.toggle("no-scroll");
                  document.querySelector(".navbar-menu").classList.toggle("show");
              // if it is regular navigation,enable scroll
              }else{
                  document.body.classList.remove("no-scroll");    
              }
          }
      });
    // year for copyright
    const date = new Date();
    year.innerHTML = date.getFullYear();
    // show back to top arrow
    window.addEventListener("scroll",()=>{
        const scrollPoint = window.scrollY;
        if(scrollPoint > 100){
            backToTop.classList.remove("d-none");
        }else{
            backToTop.classList.add("d-none");
        }
    });
    // scroll to top
    backToTop.addEventListener("click",() => {
        window.scrollTo({
            top: 0,
            right : 0,
            behavior: "smooth"
        });
    });
    // get tabs
    const tabs = document.querySelectorAll(".tab");
    // add event for every tab
    tabs.forEach( tab => tab.addEventListener("click",(e) => {
        chageBorder(e.target);
        // get data for specific tab
        getData(e.target.dataset.skill)
        .then(data => printSkills(data))
        .catch(err => console.log(err));
    }));
    function chageBorder(target){
        tabs.forEach(tab => tab.classList.remove("tab-border"));
        target.classList.add("tab-border");
    }

    function printSkills(data){
        let output = '';
        data.forEach(skill => {
            output += `<div class="language m-md">
            <div class="lang-title d-flex">
                <h3 class="skill_name">${skill.title}</h3>
                <span class="skill_num">${skill.precentege}%</span>
            </div>
            <div class="skills-bar m-sm">
                <div class="skill_percentage skills_php" style="width:${skill.precentege}%;"></div>
            </div>
        </div>`
      
        });
        languages.innerHTML = output;
    }
    // print courses and speaken languages
    getData("courses")
    .then(data =>{
        let output1='',output2 = '';
        data.forEach(x => {
            if(x.group == "courses"){
                output1 += `<p class="m-sm text-sm">${x.name} - ${x.by}</p>`
            }else{
                output2 += `<p class="m-sm text-sm">${x.name} - ${x.level}</p>`
            }
        });
        course.innerHTML = output1;
        lang.innerHTML = output2;
    })
    .catch(err => console.log(err));

    // get all project in var
    let projectsArr = [];
    // number of project per page
    const perPage = 4;
    getData("projects")
    .then(data => {
        projectsArr = data;
        // slice arr to show first 4 projects
        const array = sliceArray(data,0)
        printProjects(array);
        // number of links
        const links = Math.ceil(data.length / 4);
        printLinks(links);
        
    })
    .catch(err => console.log(err));

    function printLinks(links){
        let output = '';
        for(var i = 0;i < links; i++){
            output += ` <div class="pagination-item" data-id="${i}">${i+1}
        </div>`
        }
        pagination.innerHTML = output;
    }
    function printProjects(data){
        let output = '';
        data.forEach(project => {
            output += `<div class="project card m-lg">
            <div class="project-img relative">
                <img src="${project.img}" alt="${project.name}">
            </div>
            <div class="project-body">
                <h4 class="m-sm text-bold">${project.name}</h4>
                <span >Koriscene tehnologije:</span>
                <span>${project.languages}</span>
                <p class="m-md ">${project.desc}</p>
                ${printButtonsForProjects(project)}
            </div>
        </div>`;
        })
        projects.innerHTML = output;
    }
    function printButtonsForProjects(data){
        if(data.href){
            return `<a href="${data.github}" target="_blank" class="btn github text-bold text-center">GitHub<i class="fas fa-arrow-right"></i></a>
                    <a href="${data.href}" target="_blank" class="btn text-bold text-center">Projekat<i class="fas fa-arrow-right"></i></a>`;
        }else{
            return `<a href="${data.github}" target="_blank" class="btn github text-bold text-center">GitHub<i class="fas fa-arrow-right"></i></a>`;
        }
    }
    // event for links in pagination (event delagation)
    document.body.addEventListener("click",paginationLinksEvent);
    function paginationLinksEvent(e){
        if(e.target.classList.contains("pagination-item")){
            let paginationProjects = sliceArray(projectsArr,e.target.dataset.id);
            printProjects(paginationProjects);
        }
    }
    function sliceArray(data,limit){
        let offset;
        if(limit == 0){
            offset = 4;
        }else{
            offset = limit*perPage+perPage;
        }
        return data.slice(limit*perPage,offset);
    }
   
}
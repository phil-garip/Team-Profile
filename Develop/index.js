const inquirer = require("inquirer");
const fs = require("fs");
const Engineer = require("./lib/engineer");
const Intern = require("./lib/intern");
const Manager = require("./lib/manager");

const employees = [];

function initApp() {
    startHtml();
    addMember();
}

function addMember() {
    inquirer.prompt([{
        message: "Enter team member's name",
        name: "name"
    },
    {
        type: "list",
        message: "Select team member's role",
        choices: [
            "Engineer",
            "Intern",
            "Manager"
        ],
        name: "role"
    },
    {
        message: "Enter team member's id",
        name: "id"
    },
    {
        message: "Enter team member's email address",
        name: "email"
    }])
    .then(function({name, role, id, email}) {
        let roleInfo = "";
        if (role === "Engineer") {
            roleInfo = "GitHub username";
        } else if (role === "Intern") {
            roleInfo = "school name";
        } else {
            roleInfo = "office phone number";
        }
        inquirer.prompt([{
            message: `Enter team member's ${roleInfo}`,
            name: "roleInfo"
        },
        {
            type: "list",
            message: "Would you like to add more team members?",
            choices: [
                "yes",
                "no"
            ],
            name: "moreMembers"
        }])
        .then(function({roleInfo, moreMembers}) {
            let newMember;
            if (role === "Engineer") {
                newMember = new Engineer(name, id, email, roleInfo);
            } else if (role === "Intern") {
                newMember = new Intern(name, id, email, roleInfo);
            } else {
                newMember = new Manager(name, id, email, roleInfo);
            }
            employees.push(newMember);
            addHtml(newMember)
            .then(function() {
                if (moreMembers === "yes") {
                    addMember();
                } else {
                    finishHtml();
                }
            });
            
        });
    });
}

function startHtml() {
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Team Profile</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-wEmeIV1mKuiNpC+IOBjI7aAzPcEZeedi5yW5f2yOq55WWLwNGmvvx4Um1vskeMj0" crossorigin="anonymous">
        <link rel="stylesheet" href="./style.css">
    </head>
    <body>
        <div class="container main">
            <div class="container-fluid head">
                <h1>My Team</h1>
            </div>
            <div class="container-fluid cards">
        `;
    fs.writeFile("team.html", html, function(err) {
        if (err) {
            console.log(err);
        }
    });
    console.log("start");
}

function addHtml(member) {
    return new Promise(function(resolve, reject) {
        const name = member.getName();
        const role = member.getRole();
        const id = member.getId();
        const email = member.getEmail();
        let data = "";
        if (role === "Engineer") {
            const gitHub = member.getGithub();
            data = `<div class="card" id="employee-card" style="width: 18rem;">
            <div class="card-body">
                <div class="container card-head">
                    <h5 class="card-title" id="employee-name">${name}</h5>
                    <h6 class="card-subtitle mb-2" id="employee-title">${role}</h6>
                </div>
                <div class="container card-body">
                    <ul class="list-group card-list">
                        <li class="list-group-item" id="id">ID: ${id} </li>
                        <li class="list-group-item" id="id">Email: <a href="mailto:${email}">${email}</a></li>
                        <li class="list-group-item" id="id">Github: <a href="github.com/${gitHub}">github.com/${gitHub}</a></li>
                    </ul>
                </div>
            </div>
        </div>`;
        } else if (role === "Intern") {
            const school = member.getSchool();
            data = `<div class="card" id="employee-card" style="width: 18rem;">
            <div class="card-body">
                <div class="container card-head">
                    <h5 class="card-title" id="employee-name">${name}</h5>
                    <h6 class="card-subtitle mb-2" id="employee-title">${role}</h6>
                </div>
                <div class="container card-body">
                    <ul class="list-group card-list">
                        <li class="list-group-item" id="id">ID: ${id} </li>
                        <li class="list-group-item" id="id">Email: <a href="mailto:${email}">${email}</a></li>
                        <li class="list-group-item" id="id">School: ${school} </li>
                    </ul>
                </div>
            </div>
        </div>`;
        } else {
            const officePhone = member.getOfficeNumber();
            data = `<div class="card" id="employee-card" style="width: 18rem;">
            <div class="card-body">
                <div class="container card-head">
                    <h5 class="card-title" id="employee-name">${name}</h5>
                    <h6 class="card-subtitle mb-2" id="employee-title">${role}</h6>
                </div>
                <div class="container card-body">
                    <ul class="list-group card-list">
                        <li class="list-group-item" id="id">ID: ${id} </li>
                        <li class="list-group-item" id="id">Email: <a href="mailto:${email}">${email}</a></li>
                        <li class="list-group-item" id="id">Office Number: ${officePhone} </li>
                    </ul>
                </div>
            </div>
        </div>`
        }
        console.log("adding team member");
        fs.appendFile("team.html", data, function (err) {
            if (err) {
                return reject(err);
            };
            return resolve();
        });
    });
    
            
    
        
    
    
}

function finishHtml() {
    const html = `</div>
    </div>
    <script src="../index.js"></script>
    </body>
    </html>`;

    fs.appendFile("team.html", html, function (err) {
        if (err) {
            console.log(err);
        };
    });
    console.log("end");
}

initApp();
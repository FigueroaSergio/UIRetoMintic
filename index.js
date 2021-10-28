var strt = {
  Skate: {
    name: { type: "text", maxlength: "45", edition: true },
    brand: { type: "text", maxlength: "45", edition: true },
    description: { type: "text", maxlength: "250", edition: true },
    year: {
      type: "number",
      min: "1000",
      max: "9999",
      value: "2000",
      edition: true,
    },
    category: { type: "select", for: "Category", edition: false },
  },
  Client: {
    name: { type: "text", maxlength: "45", edition: true },
    email: { type: "text", maxlength: "45", edition: false },
    password: { type: "text", maxlength: "250", edition: true },
    age: {
      type: "number",
      min: "0",
      max: "200",
      value: "0",
      edition: true,
    },
  },
  Message: {
    messageText: { type: "text", maxlength: "250", edition: true },
    client: { type: "select", for: "Client", edition: false },
    skate: { type: "select", for: "Skate", edition: false },
  },
  Category: {
    name: { type: "text", maxlength: "45", edition: true },
    description: { type: "text", maxlength: "250", edition: true },
  },
  Reservation: {
    client: { type: "select", for: "Client", edition: false },
    skate: { type: "select", for: "Skate", edition: false },
    startDate: { type: "date", edition: true },
    devolutionDate: { type: "date", edition: true },
  },
};
var tables = {
  Skate: ["name"],
};
var page = "Category";
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.onclick = function () {
      page = this.dataset.page;
      goTo(page);

      link.classList.add("active");
    };
  });
  form.fields = strt[page];
  table.head = strt[page];
  traerDatos(page, true);
  form.render();

  document.getElementById("submit").addEventListener("click", function (event) {
    SubmitData(event);
  });
});
function goTo(data) {
  link = document.querySelector(".active");
  link.classList.remove("active");
  console.log(data);
  traerDatos(data, true);
  form.fields = strt[data];
  table.head = strt[data];

  form.render();
  table.render();
}
var idSubmit = null;
var action = "POST";
function SubmitData(event = null) {
  if (event != null) event.preventDefault();
  let data = {};
  if (action == "DELETE") {
    data = { id: parseInt(idSubmit) };
    console.log(action);
    traerDatos(action, page, data);
  } else {
    data = getData();
    postData(page, data);
  }

  console.log(data);

  idSubmit = null;
  action = "POST";
  setTimeout(() => {
    traerDatos(page, true);
  }, 1000);
}
function getData() {
  let temp = {};
  for (let key in strt[page]) {
    let ele = document.getElementById(key);
    let data = ele.value;
    if (data == "") data = null;

    if (strt[page][key]["type"] == "select") {
      if (key == "client") temp[key] = { idClient: data };
      else {
        temp[key] = { id: data };
      }
    } else {
      temp[key] = data;
    }
    ele.value = null;
  }
  console.log(temp);
  return temp;
}
class Form {
  constructor(fields = {}) {
    this.fields = fields;
  }
  formView = document.getElementById("form");

  render = function () {
    //console.log(this.fields)
    this.formView.innerHTML = "";
    var fragment = new DocumentFragment();
    // Creacion de los input
    for (let key in this.fields) {
      let options = this.fields[key];
      let newInput = this.createField(key, options);
      fragment.appendChild(newInput);
    }

    let button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-primary");
    button.textContent = "Submit";
    button.setAttribute("id", "submit");
    button.addEventListener("click", function (event) {
      SubmitData(event);
    });
    fragment.appendChild(button);

    this.formView.appendChild(fragment);
  };
  createField = function (title, options) {
    //creacion de elementos
    let div = document.createElement("div");
    let label = document.createElement("label");
    let input = document.createElement("input");

    if (options.type != "select") {
      input.setAttribute("type", options["type"]);
      for (let key in options) {
        input.setAttribute(key, options[key]);
      }
    } else {
      input = document.createElement("select");
      this.generateOpt(options.for, input);
    }
    //Adicion de stilos
    div.classList.add("mb-3");
    label.classList.add("form-label");
    input.classList.add("form-control");
    input.setAttribute("id", title);

    label.textContent = title.toUpperCase();
    input.name = title;

    div.appendChild(label);
    div.appendChild(input);

    return div;
  };
  generateOpt = async function (page, input) {
    let datos = await traerDatos(page);
    console.log(datos);
    datos.forEach((dato) => {
      let opt = document.createElement("option");
      opt.textContent = dato.name;
      opt.value = dato.id || dato.idClient;
      input.appendChild(opt);
    });
  };
}
class Table {
  constructor(head = {}, dataSet = {}) {
    this.head = head;
    this.dataSet = dataSet;
    this.table = document.getElementById("table");
  }
  render = function () {
    this.table.innerHTML = "";
    //console.log("column")
    let fragment = new DocumentFragment();
    //creacion de elementos tabla
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    //creacion fila ppara header
    let header = document.createElement("tr");
    //Creacion elementos de header en base al los obj iniciales
    for (let key in this.head) {
      header.appendChild(this.createColumn(key, "th"));
    }
    header.appendChild(this.createColumn("Actions", "th"));
    thead.appendChild(header);
    fragment.appendChild(thead);
    this.dataSet.forEach((data) => {
      //console.log(data);
      let tmp = document.createElement("tr");
      for (let key in strt[page]) {
        tmp.appendChild(this.createColumn(data[key], "td"));
      }
      let column = document.createElement("td");
      let button = document.createElement("button");
      button.classList.add("btn");
      button.classList.add("btn-primary");
      button.textContent = "E";
      let button2 = document.createElement("button");
      button2.classList.add("btn");
      button2.classList.add("btn-outline-primary");
      button2.textContent = "D";
      button.onclick = () => {
        this.sendToEdit(data);
      };
      button2.onclick = () => {
        this.delete(data);
      };
      column.appendChild(button);
      column.appendChild(button2);
      tmp.appendChild(column);

      tbody.appendChild(tmp);
    });

    fragment.appendChild(tbody);
    this.table.appendChild(fragment);
  };
  delete = function (data) {
    idSubmit = data["id"];
    action = "DELETE";
    SubmitData();
  };
  sendToEdit = function (data) {
    idSubmit = data["id"];
    action = "PUT";
    for (let key in data) {
      let ele = document.getElementById(key);
      ele.value = data[key];
    }
  };

  createColumn = function (data, type) {
    let column = document.createElement(type);
    column.scope = "col";
    column.textContent = data;

    return column;
  };
}

var table = new Table();
var form = new Form();

async function traerDatos(page, render) {
  let URL = `http://localhost:8080/api/${page}/all`;
  //console.log(URL);

  let response = await fetch(URL, { method: "GET" });
  let data = await response.json();

  if (render) {
    table.dataSet = data;
    table.render();
  }
  return data;
}
function postData(page, data) {
  let URL = `http://localhost:8080/api/${page}/save`;
  console.log(URL);
  console.log(data);
  fetch(URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {});
}

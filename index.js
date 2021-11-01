var strt = {
  Skate: {
    name: { type: "text", maxlength: "45", edition: true, view: true },
    brand: { type: "text", maxlength: "45", edition: true, view: true },
    description: { type: "text", maxlength: "250", edition: true, view: true },
    year: {
      type: "number",
      min: "1000",
      max: "9999",
      value: "2000",
      edition: true,
      view: true,
    },
    category: { type: "select", for: "Category", edition: false, view: true },
  },
  Client: {
    name: { type: "text", maxlength: "45", edition: true, view: true },
    email: { type: "text", maxlength: "45", edition: false, view: true },
    password: { type: "text", maxlength: "250", edition: true, view: false },
    age: {
      type: "number",
      min: "0",
      max: "200",
      value: "0",
      edition: true,
      view: true,
    },
  },
  Message: {
    messageText: { type: "text", maxlength: "250", edition: true, view: true },
    client: { type: "select", for: "Client", edition: false, view: true },
    skate: { type: "select", for: "Skate", edition: false, view: true },
  },
  Category: {
    name: { type: "text", maxlength: "45", edition: true, view: true },
    description: { type: "text", maxlength: "250", edition: true, view: true },
  },
  Reservation: {
    client: { type: "select", for: "Client", edition: false, view: true },
    skate: { type: "select", for: "Skate", edition: false, view: true },
    startDate: { type: "date", edition: true, view: true },
    devolutionDate: { type: "date", edition: true, view: true },
  },
};
var tables = {
  Skate: ["name", "brand", "description", "category"],
  Category: ["name", "description", "skates"],
  Message: ["messageText", "skate", "client"],
  Reservation: [
    "idReservation",
    "startDate",
    "devolutionDate",
    "idClient",
    "name",
    "email",
    "skate",
    "status",
  ],
  Client: ["idClient", "name", "email", "age"],
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
  table.head = tables[page];
  traerDatos(page, true);
  form.render();
});
function goTo(page) {
  link = document.querySelector(".active");
  link.classList.remove("active");
  console.log(page);
  form.fields = strt[page];
  table.head = tables[page];
  traerDatos(page, true);
  form.formData = {};
  form.render();
}
var idSubmit = null;
var action = "POST";
async function SubmitData(event = null) {
  if (event != null) await event.preventDefault();
  let data = {};
  if (action == "DELETE") {
    postData();
  } else {
    data = await getData(form.formData);
    await postData(data);
  }

  console.log(data);
  idSubmit = null;
  form.formData = {};
  action = "POST";

  setTimeout(function () {
    traerDatos(page, true);
  }, 500);
}
function getData(temp = {}) {
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
    ele.disabled = false;
  }

  //console.log(temp);
  return temp;
}
class Form {
  constructor(fields = {}) {
    this.fields = fields;
  }
  formView = document.getElementById("form");
  formData = {};
  getId = function (data) {
    for (let key in data) {
      if (key.indexOf("id") != -1) {
        this.formData[key] = data[key];
      }
    }
  };
  searchOpt = function (opt, ele) {
    for (let i = 0; i < ele.options.length; i++) {
      if (ele.options[i].text == opt) {
        ele.selectedIndex = i;
        console.log(i);
      }
    }
  };
  fillFields = function (params) {
    for (let key in strt[page]) {
      let ele = document.getElementById(key);
      ele.value = params[key];
      if (strt[page][key]["type"] == "select")
        this.searchOpt(params[key]["name"], ele);
      ele.disabled = !strt[page][key]["edition"];
    }
    this.getId(params);
  };
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
    //console.log(datos);
    datos.forEach((dato) => {
      let opt = document.createElement("option");
      opt.textContent = dato.name;
      opt.value = dato.id || dato.idClient;
      input.appendChild(opt);
    });
  };
}
class Table {
  constructor(head = [], dataSet = {}) {
    this.head = head;
    this.dataSet = dataSet;
    this.table = document.getElementById("table");
  }
  renderHead = function () {
    this.table.innerHTML = "";
    //console.log("column")
    let fragment = new DocumentFragment();
    //creacion de elementos tabla
    let thead = document.createElement("thead");
    let header = document.createElement("tr");
    this.head.forEach((head) => {
      header.appendChild(this.createColumn(head, "th"));
    });

    header.appendChild(this.createColumn("Actions", "th"));
    thead.appendChild(header);
    fragment.appendChild(thead);
    this.table.appendChild(fragment);
  };
  render = function () {
    let fragment = new DocumentFragment();
    let tbody = document.createElement("tbody");
    //creacion fila ppara header

    //Creacion elementos de header en base al los obj iniciales

    this.dataSet.forEach((data) => {
      //console.log(data);

      let tmp = document.createElement("tr");
      let dataTemp = processData(data);
      this.head.forEach((key) => {
        //console.log(key);
        let info = dataTemp[key];

        tmp.appendChild(this.createColumn(info, "td"));
      });

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
    idSubmit = data["id"] || data["idReservation"] || data["idClient"];

    action = "DELETE";
    SubmitData();
  };
  sendToEdit = function (data) {
    action = "PUT";
    form.fillFields(data);
  };

  createColumn = function (data, type) {
    let column = document.createElement(type);
    column.scope = "col";
    let txt = data;

    column.textContent = txt;

    return column;
  };
}

var table = new Table();
var form = new Form();

async function traerDatos(page, render) {
  //console.log("hear");
  await table.renderHead();
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
async function deleteEle() {}
async function postData(data = {}) {
  let opt = { POST: "save", PUT: "update", DELETE: idSubmit };
  let URL = `http://localhost:8080/api/${page}/${opt[action]}`;
  console.log(URL);
  //console.log(data);
  fetch(URL, {
    method: action,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
function formattedDate(date) {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}
function processData(info) {
  //console.log(data);
  let data = Object.assign({}, info);
  switch (page) {
    case "Skate":
      delete data.id;
      data.category = data.category.name;
      break;
    case "Client":
      delete data.id;
      delete data.password;
      break;
    case "Message":
      delete data.id;
      data.client = data.client.name;
      data.skate = data.skate.name;
      break;
    case "Category":
      delete data.id;
      let skatest = "";
      try {
        data.skates.forEach((dato) => {
          skatest = skatest + "-" + dato.name;
        });
      } catch {}
      data.skates = skatest;
      break;
    case "Reservation":
      cli = data.client;
      data["idClient"] = cli.idClient;
      data["name"] = cli.name;
      data["email"] = cli.email;
      delete data.client;
      delete data.score;
      data.skate = data.skate.name;
      data.startDate = formattedDate(data.startDate);
      data.devolutionDate = formattedDate(data.devolutionDate);
      break;
  }
  //console.log(data);
  return data;
}

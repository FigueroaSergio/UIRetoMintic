var strt={"skate":{"Name":"name","Brand":"brand","Category":"category_id","Model":"model"},"clients":{"Name":"name","Age":"age"},"messages":{"Message":"message"}}

var dataClient={"clients":[
                        {"id":"1","name":"juanito","age":"16"},
                        {"id":"2","name":"carlitos","age":"16"}
                    ],
                "skate":[
                    {"id":"1","name":"skta","brand":"best","category_id":"1","model":"12"},
                    {"id":"2","name":"skta2","brand":"worts","category_id":"2","model":"12"}
                ],
                "messages":[
                    {"id":"1","message":"hola"},
                    {"id":"2","message":"chao"}
                ],}

document.addEventListener("DOMContentLoaded",function(){
    document.querySelectorAll('.nav-link').forEach(link=>{
        
        link.onclick=function(){
            goTo(this.dataset.page)

            link.classList.add("active")
            
        }
    })
    
    form.render()
    table.render()
})
function goTo(data){
    link= document.querySelector(".active")
    link.classList.remove("active")
    //console.log(strt[data])
    form.fields=strt[data]
    table.head=strt[data]
    table.dataSet=dataClient[data]
    form.render()
    table.render()
}
class Form{
    constructor(fields){
      this.fields=fields
       
    }
    formView = document.getElementById('form') 
    
   
    render=function(){
        console.log(this.fields)
        this.formView.innerHTML = ''
        var fragment = new DocumentFragment()
        fragment.appendChild(this.createField("ID","id",0))

        for( let key in this.fields){

            let name= this.fields[key]
            fragment.appendChild(this.createField(key,name,1))

        }
        
        let button = document.createElement("button")
        button.classList.add("btn")
        button.classList.add("btn-primary")
        button.textContent="Submit"
        button.setAttribute("id","submit")

        fragment.appendChild(button)
        
        this.formView.appendChild(fragment)
        
        
    }
    createField=function(title,field,bool){
            let div = document.createElement("div")
            let label= document.createElement("label")
            let input=document.createElement("input")

            div.classList.add("mb-3")
            label.classList.add("form-label")
            input.classList.add("form-control")
            input.setAttribute("id",field)

            label.textContent=title
            input.name=field
            div.appendChild(label)
            div.appendChild(input)
            if(!bool) input.readOnly=true
        return div
    }
   
}
class Table{
    constructor(head,dataSet){
        this.head=head
        this.dataSet =dataSet
        this.table = document.getElementById('table')
    }
    render = function(){
        this.table.innerHTML = ''
        //console.log("column")
        let fragment = new DocumentFragment()
        let thead=document.createElement("thead")
        let tbody=document.createElement("tbody")
        let header=document.createElement("tr")
        header.appendChild(this.createColumn("ID","th"))

        for( let key in this.head){
            
            header.appendChild(this.createColumn(key,"th"))
            
        }
        header.appendChild(this.createColumn("Actions","th"))
        thead.appendChild(header)
        fragment.appendChild(thead)
        this.dataSet.forEach(data => {
           //console.log(data)
           let tmp=document.createElement("tr")
            for (let key in data){
              tmp.appendChild(this.createColumn(data[key],"td"))  
              
            }
            let column = document.createElement("td")
            let button = document.createElement("button")
                button.classList.add("btn")
                button.classList.add("btn-primary")
                button.textContent="E"
            let button2 = document.createElement("button")
                button2.classList.add("btn")
                button2.classList.add("btn-outline-primary")
                button2.textContent="D"
                button.onclick=()=>{this.sendToEdit(data)}
                button2.onclick=function(){alert("Eliminar")}
            column.appendChild(button)
            column.appendChild(button2)
            tmp.appendChild(column)
           
            tbody.appendChild(tmp)
        });
        
        
        
        fragment.appendChild(tbody)
        this.table.appendChild(fragment)
        
    }
    sendToEdit = function(data){
        
        
        for(let key in data){
            let ele = document.getElementById(key)
            ele.value=data[key]

        }
    }
    
    createColumn = function(data,type){

            let column = document.createElement(type)
            column.scope="col"
            column.textContent=data
            
            
        return column
    }
}

var table=new Table(strt["skate"],dataClient["skate"])
var form=new Form(strt["skate"])
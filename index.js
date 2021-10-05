var strt={"skate":{"ID":"id","Name":"name","Brand":"brand","Category":"category_id","Model":"model"},
            "client":{"ID":"id","Name":"name","EMAL":"email","Age":"age"},
            "message":{"ID":"id","Message":"messagetext"}}

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
var page="skate"
document.addEventListener("DOMContentLoaded",function(){
    document.querySelectorAll('.nav-link').forEach(link=>{
        
        link.onclick=function(){
            page=this.dataset.page
            goTo(page)

            link.classList.add("active")
            
        }
    })
    form.fields=strt[page]
    table.head=strt[page]
    traerDatos("GET",page)
    form.render()
    
    document.getElementById("submit").addEventListener("click", function(event){
        SubmitData(event)            
      });
})
function goTo(data){
    link= document.querySelector(".active")
    link.classList.remove("active")
    console.log(data)
    traerDatos("GET",data)
    form.fields=strt[data]
    table.head=strt[data]
  
    form.render()
    table.render()
}
var idSubmit=null
var action = "POST"
function SubmitData(event=null){
    
    if(event!=null) event.preventDefault()
    let data ={}
    if(action=="DELETE"){
       
        data = {"id":parseInt(idSubmit)}
        console.log(action)
        traerDatos(action,page,data)
    }
    else{
        data= getData()
        traerDatos(action,page,data)
    }
      
    console.log(data)
    
    idSubmit=null
    action = "POST"
    setTimeout(() => {  traerDatos("GET",page) }, 1000)
    
    
}
function getData(){
    let temp={}
    for(let key in strt[page]){
        let id= strt[page][key]
        let ele= document.getElementById(id)
        let data= ele.value
        ele.value= null
        if(data=='') data=null
        temp[id]=data
    } 
    
    return temp
}
class Form{
    constructor(fields={}){
      this.fields=fields
       
    }
    formView = document.getElementById('form') 
    
   
    render=function(){
        //console.log(this.fields)
        this.formView.innerHTML = ''
        var fragment = new DocumentFragment()
        

        for( let key in this.fields){
            let edit=1
            let name= this.fields[key]
            if(key=="ID")edit=0
            
            fragment.appendChild(this.createField(key,name,edit))

        }
        
        let button = document.createElement("button")
        button.classList.add("btn")
        button.classList.add("btn-primary")
        button.textContent="Submit"
        button.setAttribute("id","submit")
        button.addEventListener("click", function(event){
            SubmitData(event)            
          })
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
    constructor(head={},dataSet={}){
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
      

        for( let key in this.head){
            
            header.appendChild(this.createColumn(key,"th"))
            
        }
        header.appendChild(this.createColumn("Actions","th"))
        thead.appendChild(header)
        fragment.appendChild(thead)
        this.dataSet.forEach(data => {
           //console.log(data)
           let tmp=document.createElement("tr")
            for (let key in strt[page]){
              tmp.appendChild(this.createColumn(data[strt[page][key]],"td"))  
              
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
                button2.onclick=()=>{this.delete(data)}
            column.appendChild(button)
            column.appendChild(button2)
            tmp.appendChild(column)
           
            tbody.appendChild(tmp)
        });
        
        
        
        fragment.appendChild(tbody)
        this.table.appendChild(fragment)
        
    }
    delete = function(data){
        idSubmit=data["id"]
        action="DELETE"
        SubmitData()   
    }
    sendToEdit = function(data){
        
        idSubmit=data["id"]
        action="PUT"
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


var table=new Table()
var form=new Form()
function traerDatos(method,page,data={}){
let URL=`https://g61c0c1b9664c1f-pruebas.adb.sa-saopaulo-1.oraclecloudapps.com/ords/admin/${page}/${page}`
console.log(URL)
console.log(data)
$.ajax(
    {
    url: URL,
    type:method,
    contentType: "application/json",
    datatype:"JSON",
    data:JSON.stringify(data), 
    success: function(result){
        if(method=="GET"){
        console.log(result.items)
        table.dataSet=result.items
        table.render()  
        }
        return result
        
        }   
    })
    
}
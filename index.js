
var strSkate={"Name":"name","Brand":"brand","Category":"category_id","Model":"model"}
var strClient={"Name":"name","Age":"age"}
var dataClient=[{"id":"1","Name":"juanito","Age":"16"},{"id":"2","Name":"carlitos","Age":"16"}]

function Form(fields){
    this.fields=fields
    this.form = document.getElementById('form')
    this.render=()=>{
        
        var fragment = new DocumentFragment()
        fragment.appendChild(this.createField("ID","id",0))

        for( let key in fields){

            let name= fields[key]
            fragment.appendChild(this.createField(key,name,1))

        }
        
        let button = document.createElement("button")
        button.classList.add("btn")
        button.classList.add("btn-primary")
        button.textContent="Submit"

        fragment.appendChild(button)
        
        this.form.appendChild(fragment)
        
    }
    this.createField=function(title,field,bool){
            let div = document.createElement("div")
            let label= document.createElement("label")
            let input=document.createElement("input")

            div.classList.add("mb-3")
            label.classList.add("form-label")
            input.classList.add("form-control")

            label.textContent=title
            input.name=field
            div.appendChild(label)
            div.appendChild(input)
            if(!bool) input.readOnly=true
        return div
    }
}
function Table(head,dataSet){
    this.head=head
    this.dataSet =dataSet
    this.table = document.getElementById('table')
    this.render=()=>{
        console.log("column")
        let fragment = new DocumentFragment()
        let thead=document.createElement("thead")
        let tbody=document.createElement("tbody")
        let header=document.createElement("tr")
        header.appendChild(this.createColumn("ID","th"))

        for( let key in head){
            
            header.appendChild(this.createColumn(key,"th"))
            
        }
        thead.appendChild(header)
        fragment.appendChild(thead)
        dataSet.forEach(data => {
           console.log(data)
           let tmp=document.createElement("tr")
            for (key in data){
              tmp.appendChild(this.createColumn(data[key],"td"))  
              
            } 
            tbody.appendChild(tmp)
        });
        fragment.appendChild(tbody)
            
            


        
       
        
        this.table.appendChild(fragment)
        
    }
    
    this.createColumn=function(data,type){
            

            let column = document.createElement(type)

            column.scope="col"
            column.textContent=data
            
            //console.log(column)
        return column
    }
}
var prueba2=new Table(strClient,dataClient)
var prueba=new Form(strClient)
prueba.render()
prueba2.render()

var M;

class Main implements EventListenerObject,HttpResponse {
    framework: Framework = new Framework();
    showDevices: Boolean;
   
    constructor() {
        this.showDevices = false;
        document.getElementById("deviceId").style.display = 'none';
        document.getElementById("deviceIdDel").style.display = 'none';     
    }
    manejarRespuesta(respueta: string) {
        var lista: Array<Device> = JSON.parse(respueta);

        
        var ulDisp = document.getElementById("listaDisp");
        for (var disp of lista) {
            var rangeMessage : string;
            var item: string = `<li class="collection-item avatar" id="li_${disp.id}">`;
                    if(disp.type==0){
                        rangeMessage = "Intensidad de lámpara";
                        item+=  '<img src="static/images/lightbulb.png" alt = "" class="circle" >'
                    } else {
                        rangeMessage = "Apertura de persiana";
                        item+=  '<img src="static/images/window.png" alt = "" class="circle" >'
                    }                  
                        item+=`<span class="titulo">${disp.name}</span>
                        <p>
                            ${disp.description}
                        </p>
                        <p class="range-field">
                            <label>${rangeMessage}</label> 
                            <input type="range" id="int_${disp.id}" min="0" max="100" value="${disp.intensity}"/>
                        </p>
                        <a href="#!" class="secondary-content">
                            <div class="switch">
                                <label>
                                    Apagado
                                    `;
                                    if (disp.state) {
                                        item +=`<input type="checkbox" checked id="ck_${disp.id}">`;
                                    } else {
                                        item +=`<input type="checkbox" id="ck_${disp.id}" >`;
                                    }
                                    item += `
                                    <span class="lever"></span>
                                    Encendido
                                </label>
                            </div>
                        </a>

                        <a class="waves-effect waves-light btn modal-trigger" href="#modal2" id="ed_${disp.id}"><i class="material-icons right">edit</i>Editar</a>
                        <a class="waves-effect waves-light btn modal-trigger" href="#modal3" id="del_${disp.id}"><i class="material-icons right">delete</i>Eliminar</a>

                        </li>`;
            
            ulDisp.innerHTML += item;
        }
        
        // Suscribir inputs de los dispositivos a eventos
        for (var disp of lista) {
            var checkPrender = document.getElementById("ck_" + disp.id);
            checkPrender.addEventListener("click", this);

            var buttonDelete = document.getElementById("del_" + disp.id);
            buttonDelete.addEventListener("click", this);

            var buttonEdit = document.getElementById("ed_" + disp.id);
            buttonEdit.addEventListener("click", this);

            var rangeButton = document.getElementById("int_" + disp.id);
            rangeButton.addEventListener("change", this);
        }
        
    }

    // Callback para completar los valores de un dispositivo en el modal de edición
    mostrarDatosEdit(response: string) {
        var lista: Array<Device> = JSON.parse(response);
        if (lista.length > 0) {
            var device = lista[0];
            var id = <HTMLInputElement>document.getElementById("deviceId");
            id.innerHTML = String(device.id);
            var name = <HTMLInputElement>document.getElementById("deviceNameEdit");
            name.value = device.name;
            var description = <HTMLInputElement>document.getElementById("deviceDescriptionEdit");
            description.value = device.description;
            var type = <HTMLInputElement>document.getElementById("deviceTypeEdit");
            type.value = String(device.type);

            var elems = document.getElementById("deviceTypeEdit");
            var instances = M.FormSelect.init(elems,{});
        }
    }

    // Método para obtener todos los dispositivos de la base de datos
    obtenerDispositivos() {
        var listDevices = document.getElementById('listaDisp');
        listDevices.innerHTML = '';
        this.framework.ejecutarBackEnd("GET", "http://localhost:8000/devices", this, false);
    }

    // Método para actualizar el estado del dispositivo (encendido/apagado)
    updateStatus(id, status) {
        var item = { "id": id, "status": status }
        this.framework.ejecutarBackEnd("POST", "http://localhost:8000/updateStatus", this, false, item)
    }

    // Método para actualizar el range del dispositivo (intensidad de lámpara o apertura de persiana)
    updateIntensity(id, intensity) {
        var item = { "id": id, "intensity": intensity }
        this.framework.ejecutarBackEnd("POST", "http://localhost:8000/updateIntensity", this, false, item)
    }

    // Método para eliminar dispositivos de la base de datos
    deleteDevice(id) {
        var item = { "id": id }
        this.framework.ejecutarBackEnd("POST", "http://localhost:8000/deleteDevice", this, false, item)
    }

    // Método para agregar un nuevo dispositivo en la base de datos
    addDevice(deviceName, deviceDescription, deviceStatus, deviceType, deviceIntensity) {
        var device = { 
            "name": deviceName,
            "description": deviceDescription,
            "state": deviceStatus,
            "type": deviceType,
            "intensity": deviceIntensity
        }
        this.framework.ejecutarBackEnd("POST", "http://localhost:8000/addDevice", this, false, device)
    }

    // Método para obtener un dispositivo de la base de datos
    getDeviceInfo(id) {
        this.framework.ejecutarBackEnd("GET", "http://localhost:8000/getDeviceInfo?id="+id, this, true)
    }

    // Método para actualizar un dispositivo en la base de datos
    updateDevice(id, deviceName, deviceDescription, deviceType) {
        var device = { 
            "id": id,
            "name": deviceName,
            "description": deviceDescription,
            "type": deviceType
        }
        this.framework.ejecutarBackEnd("POST", "http://localhost:8000/updateDevice", this, false, device)
    }

    handleEvent(event):void {
        let elemento =<HTMLInputElement> event.target;     
        if (event.target.id == "btnListar") {   
            // Lógica asociada al click en el botón LISTAR
            this.obtenerDispositivos(); 
            this.showDevices = true;       
        } else if (elemento.id.startsWith("ck_")) {       
            // Lógica asociada al click en el spinner del dispositivo  
            this.updateStatus(elemento.id.replace('ck_', ''), elemento.checked)
        } else if (elemento.id.startsWith("del_")) {
            // Lógica asociada al click en el botón Eliminar del dispositivo  
            var id = <HTMLInputElement>document.getElementById("deviceIdDel");
            id.innerHTML = elemento.id.replace('del_', '');
        } else if (event.target.id == "btnEliminar"){
            // Lógica asociada al click en el botón Eliminar del modal
            var deviceId = (<HTMLInputElement>document.getElementById("deviceIdDel")).innerHTML;
            var listDevices = document.getElementById('listaDisp');
            var device = document.getElementById('li_' + deviceId);
            listDevices.removeChild(device);
            this.deleteDevice(deviceId);
            alert("¡Dispositivo eliminado exitósamente!")
        } else if (event.target.id == "btnAgregar") {
            // Lógica  asociada al click en el botón Agregar del modal
            var deviceName = (<HTMLInputElement>document.getElementById("deviceName")).value;
            var deviceDescription = (<HTMLInputElement>document.getElementById("deviceDescription")).value;  
            var deviceStatus = (<HTMLInputElement>document.getElementById("deviceStatus")).checked;
            var deviceStatusNum = Number(deviceStatus);
            var deviceType = (<HTMLInputElement>document.getElementById("deviceType")).value;
            var deviceIntensity = (<HTMLInputElement>document.getElementById("deviceIntensity")).value;
            if ((deviceName != null) && (deviceName != "") && 
                (deviceDescription != null) && (deviceDescription != "")) {
                this.addDevice(deviceName, deviceDescription, deviceStatusNum, deviceType, deviceIntensity);
                alert("¡Dispositivo agregado exitósamente!")
                if (this.showDevices) {
                    this.obtenerDispositivos(); 
                }            
            } else {
                alert("Debe completar el nombre y la descripción del dispositivo")
            }           
        } else if (elemento.id.startsWith("ed_")) {
            // Lógica al ejecutarse el botón Editar del dispositivo
            this.getDeviceInfo(elemento.id.replace('ed_', ''))          
        } else if (event.target.id == "btnEditar") {
            // Lógica al ejecutarse el editar del modal
            var deviceId = (<HTMLInputElement>document.getElementById("deviceId")).innerHTML;
            var deviceName = (<HTMLInputElement>document.getElementById("deviceNameEdit")).value;
            var deviceDescription = (<HTMLInputElement>document.getElementById("deviceDescriptionEdit")).value;
            var deviceType = (<HTMLInputElement>document.getElementById("deviceTypeEdit")).value;
            if ((deviceName != null) && (deviceName != "") && 
                (deviceDescription != null) && (deviceDescription != "")) {
                this.updateDevice(deviceId, deviceName, deviceDescription, deviceType);
                alert("¡Dispositivo editado exitósamente!")
                this.obtenerDispositivos();                            
            } else {
                alert("Debe completar el nombre y la descripción del dispositivo")
            }           
        } else if (elemento.id.startsWith("int_")) {
            // Lógica a ejecutarse cuando se modifique el valor de intensidad/apertura del dispositivo
            var intensity = (<HTMLInputElement>document.getElementById(elemento.id)).value;
            this.updateIntensity(elemento.id.replace('int_', ''), intensity);
        }
    }
}

window.addEventListener("load", () => {
    // Incialización de componentes de materialize
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, "");
    var elemsModal = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elemsModal, {});

    // Conexión de los botones a eventos
    var main1: Main = new Main();
    var btnListar: HTMLElement = document.getElementById("btnListar");
    btnListar.addEventListener("click", main1);
  
    var btnAgregar: HTMLElement = document.getElementById("btnAgregar");
    btnAgregar.addEventListener("click", main1);

    var btnEditar: HTMLElement = document.getElementById("btnEditar");
    btnEditar.addEventListener("click", main1);

    var btnEliminar: HTMLElement = document.getElementById("btnEliminar");
    btnEliminar.addEventListener("click", main1);
});
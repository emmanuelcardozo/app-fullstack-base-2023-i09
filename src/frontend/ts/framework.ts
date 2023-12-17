class Framework{

    public ejecutarBackEnd(method:string,url:string,callback:HttpResponse, isEdit:boolean, data?:any) {
      var xmlReq = new XMLHttpRequest();        
      xmlReq.onreadystatechange = () => {
          if (xmlReq.readyState == 4) {
            if (xmlReq.status == 200) {
              if (isEdit) {
                callback.mostrarDatosEdit(xmlReq.responseText);
              } else {
                callback.manejarRespuesta(xmlReq.responseText);
              }       
              } else {
                  alert("Error al buscar los datos!");
              }
          }
      }
      xmlReq.open(method, url, true);
      if (data != undefined) {
        xmlReq.setRequestHeader("Content-Type", "application/json");
        xmlReq.send(JSON.stringify(data));
        
      } else {
        xmlReq.send();
      }
    }
  }
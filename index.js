/*

import { DOMParser, XMLSerializer  } from 'xmldom'; 
import * as xml2js from 'xml2js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

*/
var os = require('os');
if (os.platform() == 'win32') {  
  var chilkat = require('@chilkat/ck-node23-win64'); 
} else if (os.platform() == 'linux') {
    if (os.arch() == 'arm') {
        var chilkat = require('@chilkat/ck-node23-linux-arm');
    } else if (os.arch() == 'arm64') {
        var chilkat = require('@chilkat/ck-node23-linux-arm64');
    } else {
        var chilkat = require('@chilkat/ck-node23-linux-x64');
    }
}


// const chilkat = require('@chilkat/ck-node23-win64');

//import chilkat from '@chilkat/ck-node23-win64';

const dayjs   = require('dayjs') // ES 2015

const express = require('express');

const multer = require('multer');

const morgan = require('morgan');

const dotenv = require('dotenv/config') 

// const { multer } = pkg

const fs = require('fs');

const path = require('path');

const xmldom = require('xmldom'); 

// import { DOMParser, XMLSerializer  } from 'xmldom'; 
const xml2js = require('xml2js');

//import * as xml2js from 'xml2js'

v_Version = process.env.VERSION;
var glob = new chilkat.Global();
    //var success = glob.UnlockBundle(process.env.VUNLOCK_CODE);
    var success = glob.UnlockBundle(process.env.VUNLOCK_CODE);
    if (success !== true) {
        console.log(glob.LastErrorText);
    }


const vfolder_cliente = '';

const storage = multer.diskStorage({
    destination: 'uploads/',
  // destination: 'uploads/',
    filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // const ext = (file.originalname);
    cb(null, file.originalname);
      // cb(null, uniqueSuffix);
    }
});

const upload = multer({ storage: storage });
/*
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/uploads/'); // Carpeta donde se guardarán los archivos
    //cb(null, __dirname); // Carpeta donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usar el nombre original del archivo
  }
});
*/

const app = express();
const port = process.env.PUERTO;
app.get('/fe/recepcion/api/ecp', (req, res) => {
    res.send('Entro a Servidor /fe/recepcion/api/ecp');
});

app.get('/', (req, res) => {
    res.send('Servidor Express listo!');
});
app.use(morgan('dev'))

app.post('/fe/recepcion/api/ecf',upload.single('archivo') ,(req, res) => {
    console.log(req.file);
    const xmlString = fs.readFileSync(req.file.path, 'utf-8');
// Parsea el XML
    const parser = new xmldom.DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
// Trabaja con xmlDoc para obtener tus datos [5]
  const doc = parser.parseFromString(xmlString, "text/xml"); // Parsea la cadena XML
  // Ahora 'doc' es un objeto de documento similar al que tendrías en un navegador
  // Puedes acceder a los nodos y elementos de forma similar a la API DOM

    const todosLosTags = doc.getElementsByTagName('*'); // Selecciona todos los elementos
    let v_RNCEmisor=''
    let v_RNCComprador=''
    let v_eNCF=''
    let v_Estado='0'
    let v_Version=''

    const v_FechaHoraAcuseRecibo = dayjs().format('DD-MM-YYYY HH:mm:ss')
//    console.log('v_FechaHoraAcuseRecibo_formateada',v_FechaHoraAcuseRecibo)
    const v_FechaHoraAcuseRecibo_formateada = dayjs().format('DD-MM-YYYY HH:mm:ss')
//    console.log('v_FechaHoraAcuseRecibo_formateada',v_FechaHoraAcuseRecibo_formateada)  
        // const builder_xml = new xml2js.Builder({ rootName: 'ARECF', xmldec: { 'version': '1.0', 'encoding': 'UTF-8' } });
    //
    console.log('TodosLosTags: ',todosLosTags.length);

        for (let i = 0; i < todosLosTags.length; i++) {
            let vtagname = todosLosTags[i].nodeName;
            
//            console.log('Tag: ',vtagname,' Valor: ',todosLosTags[i].textContent);

            switch (vtagname) {
    
            case 'RNCEmisor':
                v_RNCEmisor = todosLosTags[i].textContent;
    
            case 'RNCComprador':
                v_RNCComprador = todosLosTags[i].textContent;   
            
            case 'IdentificadorExtranjero':
                v_RNCComprador = todosLosTags[i].textContent;   
    
            case 'eNCF':
                v_eNCF = todosLosTags[i].textContent;
    
            //case 'Version':
            //    v_Version = todosLosTags[i].textContent;
    
          }
        }
        
    crear_folder_emisor_enupload(v_RNCEmisor);
    crear_folder_emisor_enviados(v_RNCEmisor);

    console.log('v_RNCEmisor ',v_RNCEmisor);
    const loXml = new chilkat.Xml();
    loXml.EmitCompact=1
    loXml.Tag = "ARECF"
    loXml.AddAttribute("xmlns:xsd","http://www.w3.org/2001/XMLSchema")
    loXml.AddAttribute("xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance")
    loXml.UpdateChildContent("DetalleAcusedeRecibo|Version",process.env.VERSION);
    loXml.UpdateChildContent("DetalleAcusedeRecibo|RNCEmisor",v_RNCEmisor)
    loXml.UpdateChildContent("DetalleAcusedeRecibo|RNCComprador",v_RNCComprador)
    loXml.UpdateChildContent("DetalleAcusedeRecibo|eNCF",v_eNCF)
    loXml.UpdateChildContent("DetalleAcusedeRecibo|Estado",v_Estado)
    loXml.UpdateChildContent("DetalleAcusedeRecibo|FechaHoraAcuseRecibo",v_FechaHoraAcuseRecibo)

    let lnSuccess=0;
    const loSbXml = new chilkat.StringBuilder();
    loXml.GetXmlSb(loSbXml)

// loXml.GetXmlSb(loSbXml)
//codigo Firma archivo
    let vnombre_archivo='ARECF' + v_RNCEmisor+v_eNCF+'.xml'
    let vnombre_archivo_completo='.enviados/'+vnombre_archivo

    const loGen = new chilkat.XmlDSigGen;
	loGen.Behaviors = "CompactSignedXml";
	loGen.SigLocation = 'ARECF';
	loGen.SigLocationMod = 0;
	loGen.SigNamespacePrefix = "";
	loGen.SigNamespaceUri = "http://www.w3.org/2000/09/xmldsig#";
	loGen.SignedInfoCanonAlg = "C14N";
	loGen.SignedInfoDigestMethod = "sha256";

	//* -------- Reference 1 --------
	
	loGen.AddSameDocRef("","sha256","","","")

//	* Provide a certificate + private key. (PFX password is test123)
//	* For versions of Chilkat < 10.0.0, use CreateObject('Chilkat_9_5_0.Cert')
	const loCert = new chilkat.Cert;
    
    const p_nombre_certi = "certificado_dgii.p12";
    const p_Clave_Certificado = "Joselito77";
	lnSuccess = loCert.LoadPfxFile(p_nombre_certi,p_Clave_Certificado);
    
    if (lnSuccess !== true) {
        console.log('Error en Certificado Digital, Chequear Archivo de Firma y/o Clave Privada ');
        //console.log('loCert.LastErrorText');
        return res.status(500).send('Error en Certificado Digital, Chequear Certificado, Clave Privada y/o Certificado Vencido');
        // return res.status(500).json({
        //res.send
    }
  
    /*
	if (lnSuccess != 1) {
        console.log('Error en Certificado Digital, Chequear Archivo de Firma y/o Clave Privada');
    }
  */  
	loGen.SetX509Cert(loCert,1) 
    loGen.KeyInfoType = "X509Data+KeyValue"
	loGen.KeyInfoType = "X509Data"
	loGen.X509Type = "Certificate"
    loSbXml.Trim()
//
	lnSuccess = loGen.CreateXmlDSigSb(loSbXml);
    if (lnSuccess != true) {
         console.log(loGen.LastErrorText);
        //console.log('lnSuccess Firma ',lnSuccess);
        //console.log('lnSuccess Firma ',lnSuccess);
        //res.send(loGen.LastErrorText);
        return res.status(500).send('No Ejecuto Firma Digital');
    }

// ----------------------------------------
// Verify the signatures we just produced...

    const verifier = new chilkat.XmlDSig();
    success = verifier.LoadSignatureSb(loSbXml);
    
    if (success != true) {
        console.log('Error al verificar Firma Digital en API');
        //console.log(verifier.LastErrorText);
        //res.send(verifier.LastErrorText);
        return res.status(500).send('Error al verificar Firma Digital en API');
    }
    
    // vnombre_archivo_grabado = __dirname +'\enviados\'+v_RNCEmisor+'\'+vnombre_archivo
    // let vnombre_archivo=''
    // let vnombre_archivo_grabado = __dirname +'\enviados\'+v_RNCEmisor+"\"+vnombre_archivo
    // let vnombre_archivo_grabado = __dirname +'\enviados\'+v_RNCEmisor+"\"
    // let vnombre_archivo_grabado = __dirname +'\enviados\'+v_RNCEmisor+'\'+vnombre_archivo
    let vnombre_archivo_grabado = __dirname +'/enviados/'+vnombre_archivo
    
    const vfolfer = __dirname +'\enviados';
    //console.log('vnombre_archivo_grabado ',vnombre_archivo_grabado);
   	// lnSuccess = loSbXml.WriteFile('/enviados/'+vnombre_archivo_grabado,"utf-8",0)
    //console.log('Antes de '+vnombre_archivo);
    a = loSbXml.Xml
    //lnSuccess = loSbXml.WriteFile(vnombre_archivo,"utf-8",0)
    lnSuccess = loSbXml.WriteFile(vnombre_archivo_grabado,"utf-8",0)
    if (lnSuccess !== true) {
        console.log('Error al grabar archivo firmado '+vnombre_archivo);
        return res.status(500).send('Error al grabar archivo firmado '+vnombre_archivo);
    }
//    console.log('Despues de '+vnombre_archivo);
//    res.send(`Texto original: "${texto}"<br
// >Texto procesado por Chilkat: "${textoProcesado}"`);
    //return res.status(200).sendfile(vnombre_archivo);
    //res.status(200).send(a);
    console.log('Acuse de Recibo '+vnombre_archivo_grabado+' Enviado');
    const vroot = __dirname+'/enviados/'+v_RNCEmisor;
    console.log('vroot ',vroot);
    // res.status(200).sendFile(vnombre_archivo_grabado, { root: vroot }, function (err) {
    res.status(200).sendFile(vnombre_archivo_grabado, function (err) {
        if (err) {
            res.status(500).send('Error al enviar el archivo: ');
          //console.log('Error al enviar el archivo:', err);
        }
    })
    //res.status(200).sendfile(vnombre_archivo);
  
//res.send('Firmado Exitosamente '+loSbXml);
    //res.send('Firma Exitosa:');

});

app.listen(port, () => {
  console.log(`Servidor API REST escuchando en puerto: ${port}`);
})

function uploadFile(req, res) {
    return new Promise((resolve, reject) => {
        upload(req, res, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(req.file);
            }
        });
    });
}

function crear_folder_emisor_enupload(vfolder) {
    const dir = './uploads/'+vfolder;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
/*
const fs = require('fs');
const path = require('path');
const folderName = 'mySyncFolder';
const folderPath = path.join(__dirname, folderName);
try {
  fs.mkdirSync(folderPath, { recursive: true });
  console.log(`Folder "${folderName}" created successfully at ${folderPath}`);
} catch (err) {
  console.error('Error creating folder:', err);
*/
}

function crear_folder_emisor_enviados(vfolder) {
    const dir = './enviados/'+vfolder;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

function crear_folder_emisor_enviados(vfolder) {
    const dir = './enviados/'+vfolder;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}
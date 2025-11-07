/*

import { fileURLToPath } from 'url';
import { dirname } from 'path';

*/
var os = require('os');
var  chilkat = require('@chilkat/ck-node23-linux-x64');
//r chilkat = require('@chilkat/ck-node23-win64');
/*
if (os.platform() == 'win32') {  
  var chilkat = require('@chilkat/ck-node23-win64'); 
} else if (os.platform() == 'linux') {
        var chilkat = require('@chilkat/ck-node23-linux-x64');
}
*/
// const chilkat = require('@chilkat/ck-node23-win64');

//import chilkat from '@chilkat/ck-node23-win64';

const dayjs   = require('dayjs') // ES 2015

const express = require('express');

const multer = require('multer');

const morgan = require('morgan');

const dotenv = require('dotenv/config') 

// const { multer } = pkg

const fs = require('fs');
const jwt = require('jsonwebtoken');

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

function validar_token(vtoken) {

/*
const payload = {
        data: 'Token API Privada Contribuyentes DGII', // subject (user id)
        role: 'Autenticacion TOKENS',
        iat: fecha_expedicion, // issued at time (in seconds)
        exp: fecha_expiracion
        }
*/
    try {
        // Verificar el token
        
        const decoded = jwt.verify(vtoken, process.env.JWT_SECRET);

        console.log('Token válido. Datos decodificados:', decoded);

        // Acceder a los datos del payload
        console.log('ID de usuario:', decoded.userId);
        console.log('Nombre:', decoded.name);
        return 1

    } catch (error) {
        // Manejar errores de validación (token inválido, expirado, etc.)
        if (error.name === 'TokenExpiredError') {
            console.error('Error: El token ha expirado.');
            return 0
        } else if (error.name === 'JsonWebTokenError') {
            console.error('Error: Token JWT inválido.', error.message);
            return 0
        } else {
            console.error('Error desconocido al validar el token:', error);
            return 0
        }
    }    
}

function v_firma(vnombre_archivo_firmar) {
    console.log('A Verificar ',vnombre_archivo_firmar);
    const dsa = new chilkat.Dsa();

    var sbXml = new chilkat.StringBuilder();

//    let vnombre_archivo_firmar='130808112E450000001202.xml'
    sbXml.LoadFile(vnombre_archivo_firmar,"utf-8")
    // To verify this signature, we simply load and verify:
    var verifier = new chilkat.XmlDSig();
    success = verifier.LoadSignatureSb(sbXml);
    if (success !== true) {
        console.log(verifier.LastErrorText);
        return 0;
    }
    var bVerified = verifier.VerifySignature(true);
    if (bVerified !== true) {
//        console.log(verifier.LastErrorText);
        console.log("Signature No Verificada");
        return 0;
    }
    console.log("Signature Verificada!");
    return 1;
}
/*
function crear_folder_emisor_enupload(vfolder) {
    const v1_dir = './uploads/'+vfolder;
    res.send('prubando la api crear_folder_emisor_enupload ');

    if (!fs.existsSync(v1_dir)){
        fs.mkdirSync(v1_dir);
    }
/*
*/
/*
const folderName = 'mySyncFolder';
const folderPath = path.join(__dirname, folderName);
try {
  fs.mkdirSync(folderPath, { recursive: true });
  console.log(`Folder "${folderName}" created successfully at ${folderPath}`);
} catch (err) {
  console.error('Error creating folder:', err);
}
*/
/*
function crear_folder_emisor_enviados(vfolder) {
    const v3_dir = './enviados/'+vfolder;
    if (!fs.existsSync(v3_dir)){
        fs.mkdirSync(v3_dir);
    }
}
*/

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
const v10_dir = './uploads';
if (!fs.existsSync(v10_dir)){
    fs.mkdirSync(v10_dir);
}

const v30_dir = './enviados'
if (!fs.existsSync(v30_dir)){
    fs.mkdirSync(v30_dir);
}

const app = express();

//const port = process.env.PUERTO;
const port= process.env.port || 3000;

app.get('/', (req, res) => {
    res.send('Servidor Api Rest Coplin Software y Anabel está listo!');
});
app.use(morgan('dev'))
app.post('/fe/autenticacion/api/validacioncertificado',upload.single('xml') ,(req, res) => {
    console.log(req.file);
    const xmlString = fs.readFileSync(req.file.path, 'UTF-8');
// Parsea el XML
    const parser = new xmldom.DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
// Trabaja con xmlDoc para obtener tus datos [5]
    const doc = parser.parseFromString(xmlString, "text/xml"); // Parsea la cadena XML
    // console.log('doc.documentElement '+doc.documentElement)
// Obtén el nodo raíz del documento
    const rootElement = xmlDoc.documentElement;

    const loXml_puro= new chilkat.Xml();
    const loXml_StringBuilder = new chilkat.StringBuilder();
//Conseguir xml por archivo
    loXml_StringBuilder.LoadFile(req.file.path,"UTF-8")
    loXml_puro.LoadSb(loXml_StringBuilder,true)
    console.log('Raiz ',loXml_puro.Tag);
    if (loXml_puro.Tag !== 'SemillaModel') {
    //    fs.unlinkSync(req.file.path);
        const userData_3 = {
            error: 400,
            mensaje: 'Tipo Documento Invalido'
        }
        return res.status(400).send(JSON.stringify(userData_3)); // or simply res.json(userData) with Express
    }
    /*
    let vresultado=v_firma(req.file.path)
    if (vresultado===0) 
    {//    fs.unlinkSync(req.file.path);
        return res.status(400).send('Firma Digital Incorecta')
    }
    */
    let v_valor = loXml_puro.GetChildContent("valor")
    let vresul_validar_token=validar_token(v_valor)
    if (vresul_validar_token!=1) {
        const userData_2 = {
            error: 400,
            mensaje: 'Archivo Semilla No Valido'
        }
        return res.status(400).send(JSON.stringify(userData_2)); // or simply res.json(userData) with Express
    }

//  verificarFirmaDigital(vnombre_archivo_recibido);
    const dsig = new chilkat.XmlDSig();
    //const dsig = new chilkat.XmlDSigGen();    
    const cert = new chilkat.Cert();
    console.log('antes bregar firma');
// 1. Cargar el XML firmado
    let xmlFirmado = fs.readFileSync(req.file.path, 'UTF-8');
//
    xmlFirmado = 'prueba'
    console.log('despues de bregar firma');
    // const success = dsig.LoadSignatureSb(xmlFirmado);
    const success = dsig.LoadSignature(xmlFirmado);
    console.log('dsig.LoadSignatureSb');
    if (!success) {
        console.log('Error cargando XML:', dsig.LastErrorText);
        return res.status(500).send('Error Cargando Semilla Firmada');
    }
    console.log('despues de bregar firma 2');
// 2. Cargar el certificado (.crt) para verificación
/*
    const certLoaded = cert.LoadFromFile('camaracomercio.crt');
    if (!certLoaded) {
        console.log('Error cargando certificado:', cert.LastErrorText);
        return res.status(500).send('Error cargando certificado:');
    }
*/
// 3. Verificar la firma XML con el certificado
    //let esValida = dsig.VerifySignature(true);
    //console.log('dsig.VerifySignature despues');
    //esValida = true
    let vresultado=v_firma(req.file.path)
    if (vresultado===0) {
    //    fs.unlinkSync(req.file.path);

        const v_error_token = {
        error: 400, // subject (user id)
        mensaje: "Firma Digital Invalida"
        }
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).send(JSON.stringify(v_error_token)); // or simply res.json(userData) with Express
    }
    if (vresultado===1) {
        const fecha_expedicion = Math.floor(Date.now() / 1000)
        const fecha_expiracion = Math.floor(Date.now() / 1000) + (60 * 60) // 1 hora
        let ahora = dayjs();
        if (os.platform() == 'linux') {
            ahora = ahora.subtract(4,'hour')
        }
        const payload = {
        data: 'Token API Privada Contribuyentes DGII', // subject (user id)
        role: 'Autenticacion TOKENS',
        iat: fecha_expedicion, // issued at time (in seconds)
        exp: fecha_expiracion
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET);
        const vfecha = dayjs().format();

        //let ahoraMasUnaHora = ahora.del(1, 'hour');
        let ahoraMasUnaHora = ahora.add(1, 'hour');
        const vnew = ahoraMasUnaHora.format()

        const v_resul = {
        token: token, // subject (user id)
        expira: vnew,
        expedido: ahora.format()
        }
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(JSON.stringify(v_resul)); // or simply res.json(userData) with Express
        //return res.status(200).send('Semilla Valida');
    /*
    } else {
        console.log('dsig.LastErrorText ', dsig.LastErrorText)
        const userData = {
        status: 400,
        error: "Firma Digital Invalida"
    };
    */
/*
{
	"type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
	"title": "ValidacionCertificado.Validation",
	"status": 400,
	"detail": "The element 'SemillaModel' has invalid child element 'Signature' in namespace 'http://www.w3.org/2000/09/xmldsig#'.",
	"traceId": "00-7b449d8abb5e91876664a0669e5a370d-01731ad246e061dd-00"
}
*/
// Route to send JSON response
// Set the Content-Type header to application/json
    res.setHeader('Content-Type', 'application/json');
// Send the JSON data
    const jsonString = JSON.stringify(userData);
//    res.writeHead(200, { 'Content-Type': 'application/json' });
//    res.end(jsonString);
    return res.status(400).send(JSON.stringify(userData)); // or simply res.json(userData) with Express
    //return res.status(400).send('Firma Digital Invalida');
    console.log('✗ Firma XML inválida');
    console.log('Error:', dsig.LastErrorText);
    }
})
app.get('/fe/autenticacion/api/semilla',(req, res) => {
    const characters = process.env.JWT_SECRET;
        const fecha_expedicion = Math.floor(Date.now() / 1000)
        const fecha_expiracion = Math.floor(Date.now() / 1000) + (60 * 2)

        const payload = {
        data: 'Token API Privada Contribuyentes DGII', // subject (user id)
        role: 'Autenticacion TOKENS',
        iat: fecha_expedicion, // issued at time (in seconds)
        exp: fecha_expiracion
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        let vfecha = dayjs();
        if (os.platform() == 'linux') {
            vfecha = vfecha.subtract(4,'hour')
        }
        vfecha = dayjs().format();
        const loXml_puro= new chilkat.Xml();
        const loXml_StringBuilder = new chilkat.StringBuilder();
//
        loXml_puro.EmitCompact=1
        loXml_puro.Tag = "SemillaModel"
        loXml_puro.AddAttribute("xmlns:xsd","http://www.w3.org/2001/XMLSchema")
        loXml_puro.AddAttribute("xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance")
        loXml_puro.UpdateChildContent("valor",token)
        loXml_puro.UpdateChildContent("fecha",vfecha)
        loXml_puro.GetXmlSb(loXml_StringBuilder)
        let vnombre_archivo='semilla.xml'
        let lnSuccess=0
        lnSuccess = loXml_StringBuilder.WriteFile(vnombre_archivo,"UTF-8",0)
        let texto_xml = fs.readFileSync('semilla.xml','UTF-8');
        //const texto = loXml_StringBuilder.getString();
        //let texto = loXml_StringBuilder.ToString()
        // let texto = loXml_StringBuilder.ToString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        console.log('texto xml ',texto_xml);
        const vroot = __dirname;
        console.log('vroot ',vroot);
        //res.status(200).sendFile('semilla.xml');
        res.sendFile(vnombre_archivo, { root: __dirname });
        //res.status(200).send(texto_xml);
})

app.post('/fe/recepcion/api/ecf',upload.single('xml') ,(req, res) => {
//    return res.status(500).send('prubando la api');
    //res.send('Prueba de proceso: '+process.version);
    console.log('Ver Conole Log');
    console.log(req.file);
    const xmlString = fs.readFileSync(req.file.path, 'UTF-8');
// Parsea el XML
    const parser = new xmldom.DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
// Trabaja con xmlDoc para obtener tus datos [5]
    const doc = parser.parseFromString(xmlString, "text/xml"); // Parsea la cadena XML
    // const rootElement = xmlDoc.documentElement;
// Obtén el nombre de la etiqueta raíz
    // const rootTagName = rootElement.nodeName;
    // console.log('rootTagName  '+rootTagName);
    

// Ahora 'doc' es un objeto de documento similar al que tendrías en un navegador
// Puedes acceder a los nodos y elementos de forma similar a la API DOM
//     const todosLosTags = doc.getElementsByTagName('*'); // Selecciona todos los elementos
    const v_FechaHoraAcuseRecibo = dayjs().format('DD-MM-YYYY HH:mm:ss')
//    console.log('v_FechaHoraAcuseRecibo_formateada',v_FechaHoraAcuseRecibo)
    const v_FechaHoraAcuseRecibo_formateada = dayjs().format('DD-MM-YYYY HH:mm:ss')
//    console.log('v_FechaHoraAcuseRecibo_formateada',v_FechaHoraAcuseRecibo_formateada)  
        // const builder_xml = new xml2js.Builder({ rootName: 'ARECF', xmldec: { 'version': '1.0', 'encoding': 'UTF-8' } });
    //
    // console.log('TodosLosTags: ',todosLosTags.length);
    const loXml_puro= new chilkat.Xml();
    const loXml_StringBuilder = new chilkat.StringBuilder();
//Conseguir xml por archivo
    loXml_StringBuilder.LoadFile(req.file.path,"UTF-8")
    loXml_puro.LoadSb(loXml_StringBuilder,true)
    console.log('Raiz ',loXml_puro.Tag);
    if (loXml_puro.Tag !== 'ECF') {
    //    fs.unlinkSync(req.file.path);
        return res.status(400).send('Tipo Documento Invalido');
    }
    let vresultado=v_firma(req.file.path)
    if (vresultado===0) {
    //    fs.unlinkSync(req.file.path);
        return res.status(400).send('Firma Digital Incorecta')
    }

//  xml.Tag = "abc";
/*
    *!*	lcRncEmisor
*!*	lcRncComprador
*!*	lceNCF
*!*	lcFechaEmision
*!*	lcMontoTotal
*!*	lcFechaHoraFirma

*!*	ccc=loXml_puro.Version
*/
//    let v_RNCEmisor=''    
let v_Version=''
let v_Estado='0'
/*
lcENCF = loXml_Puro.GetChildContent("Encabezado|IdDoc|eNCF")
lnRNCEmisor = loXml_Puro.GetChildContent("Encabezado|Emisor|RNCEmisor")
lcRazonSocialEmisor = loXml_Puro.GetChildContent("Encabezado|Emisor|RazonSocialEmisor")
lcFechaEmision = loXml_Puro.GetChildContent("Encabezado|Emisor|FechaEmision")
lcMontoTotal = loXml_Puro.GetChildContent("Encabezado|Totales|MontoTotal")
lcRNCComprador = loXml_Puro.GetChildContent("Encabezado|Comprador|RNCComprador")
*/
let v_eNCF = loXml_puro.GetChildContent("Encabezado|IdDoc|eNCF")

let v_RNCEmisor = loXml_puro.GetChildContent("Encabezado|Emisor|RNCEmisor")

let lcMontoTotal = loXml_puro.GetChildContent("Encabezado|Totales|MontoTotal")

let v_RNCComprador=loXml_puro.GetChildContent("Encabezado|Comprador|RNCComprador")
if (v_RNCComprador!=='131660673' && v_RNCComprador!=='130935132' && v_RNCComprador!=='130808112'  && v_RNCComprador!=='130808112' && v_RNCComprador!=='132101138' && v_RNCComprador!=='130883653'     && v_RNCComprador!=='130808112' && v_RNCComprador!=='132101138' && v_RNCComprador!=='130883653' && v_RNCComprador!=='120000334') {
        return res.status(403).send('No Autorizado');
}

let lcSignatureValue = loXml_puro.GetChildContent("Signature|SignatureValue")
let lcDigestValue = loXml_puro.GetChildContent("Signature|SignedInfo|Reference|DigestValue")

/*
for (let i = 0; i < todosLosTags.length; i++) {
            let vtagname = todosLosTags[i].nodeName;
            
//            console.log('Tag: ',vtagname,' Valor: ',todosLosTags[i].textContent);

            switch (vtagname) {
    
            //case 'Version':            //    v_Version = todosLosTags[i].textContent;
    
          }

        }    
*/

    console.log('v_eNCF ',v_eNCF);
    const v1_dir = './uploads/'+v_RNCEmisor;
    if (!fs.existsSync(v1_dir)){
        fs.mkdirSync(v1_dir);
    }
    const v3_dir = './enviados/'+v_RNCEmisor;
    if (!fs.existsSync(v3_dir)){
        fs.mkdirSync(v3_dir);
    }
    console.log('v_RNCEmisor ',v_RNCEmisor);
    const loXml = new chilkat.Xml();
    loXml.EmitCompact=1
    loXml.Tag = "ARECF"
    //loXml.AddAttribute("xmlns:xsd","http://www.w3.org/2001/XMLSchema")
    //loXml.AddAttribute("xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance")
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
    let vnombre_archivo=v_RNCComprador + v_eNCF+'.xml'
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
    const p_nombre_certi = "Certificado_Jofha.p12";
    const p_Clave_Certificado = "jamv27JMFV";
    //const p_nombre_certi = "certificado_dgii.p12";
    //const p_Clave_Certificado = "Joselito77";
    lnSuccess = loCert.LoadPfxFile(p_nombre_certi,p_Clave_Certificado);
    if (lnSuccess !== true) {
        console.log('Error en Certificado Digital, Chequear Archivo de Firma y/o Clave Privada ');
        //console.log('loCert.LastErrorText');
//        fs.unlinkSync(req.file.path);
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
//        fs.unlinkSync(req.file.path);
        return res.status(500).send('No Ejecuto Firma Digital');
    }
// ----------------------------------------
// Verify the signatures we just produced...
    const verifier = new chilkat.XmlDSig();
    success = verifier.LoadSignatureSb(loSbXml);
    if (success != true) {
//        fs.unlinkSync(req.file.path);
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
    lnSuccess = loSbXml.WriteFile(vnombre_archivo_grabado,"UTF-8",0)
    if (lnSuccess !== true) {
        console.log('Error al grabar archivo firmado '+vnombre_archivo);
//        fs.unlinkSync(req.file.path);
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
    /*
    res.status(200).sendFile(vnombre_archivo_grabado, function (err) {
    if (err) {
        res.status(400).send('Error al enviar el archivo: ');
          //console.log('Error al enviar el archivo:', err);
        }
    })
    */
    res.status(200).sendFile(vnombre_archivo_grabado)
//res.status(200).sendfile(vnombre_archivo);
//res.send('Firmado Exitosamente '+loSbXml);
//res.send('Firma Exitosa:');
});
// Fin Recepcion Comprobante

app.post('/fe/aprobacioncomercial/api/ecf',upload.single('xml') ,(req, res) => {
//    return res.status(500).send('prubando la api');
    //res.send('Prueba de proceso: '+process.version);
    console.log(req.file);
    const xmlString = fs.readFileSync(req.file.path, 'UTF-8');
// Parsea el XML
    const parser = new xmldom.DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
// Trabaja con xmlDoc para obtener tus datos [5]
    const doc = parser.parseFromString(xmlString, "text/xml"); // Parsea la cadena XML
    // console.log('doc.documentElement '+doc.documentElement)
// Obtén el nodo raíz del documento
const rootElement = xmlDoc.documentElement;
// Obtén el nombre de la etiqueta raíz
//    const rootTagName = rootElement.nodeName;    
    
/*
    if (loXml_puro.Tag !== 'ECF') {
    //    fs.unlinkSync(req.file.path);
        return res.status(400).send('Tipo Documento Invalido');
    }
*/
     const todosLosTags = doc.getElementsByTagName('*'); // Selecciona todos los elementos
/*
     let v_RNCEmisor=''
     let v_RNCComprador=''
     let v_eNCF=''
*/
    let va_Estado=''
    let v_FechaEmision = ''
    let v_MontoTotal = ''
    let v_DetalleMotivoRechazo = ''
    let v_FechaHoraAprobacionComercial = ''
    const v_FechaHoraAcuseRecibo = dayjs().format('DD-MM-YYYY HH:mm:ss')
//    console.log('v_FechaHoraAcuseRecibo_formateada',v_FechaHoraAcuseRecibo)
    const v_FechaHoraAcuseRecibo_formateada = dayjs().format('DD-MM-YYYY HH:mm:ss')

    const loXml_puro= new chilkat.Xml();
    const loXml_StringBuilder = new chilkat.StringBuilder();
//
//  Conseguir xml por archivo
//
//  
    loXml_StringBuilder.LoadFile(req.file.path,"UTF-8");
    loXml_puro.LoadSb(loXml_StringBuilder,true);
    if (loXml_puro.Tag !== 'ACECF') {
//        fs.unlinkSync(req.file.path);
        return res.status(400).send('Tipo Documento Invalido');
    }
    let vresultado=v_firma(req.file.path)
    if (vresultado===0) {
//        fs.unlinkSync(req.file.path);
        return res.status(400).send('Firma Digital Incorecta')
    }
/*
    *!*	lcRncEmisor
*!*	lcRncComprador
*!*	lceNCF
*!*	lcFechaEmision
*!*	lcMontoTotal
*!*	lcFechaHoraFirma

*!*	ccc=loXml_puro.Version
*/
//    let v_RNCEmisor=''    
let v2_Version=''
/*    
lcENCF = loXml_Puro.GetChildContent("Encabezado|IdDoc|eNCF")
lnRNCEmisor = loXml_Puro.GetChildContent("Encabezado|Emisor|RNCEmisor")
lcRazonSocialEmisor = loXml_Puro.GetChildContent("Encabezado|Emisor|RazonSocialEmisor")
lcFechaEmision = loXml_Puro.GetChildContent("Encabezado|Emisor|FechaEmision")
lcMontoTotal = loXml_Puro.GetChildContent("Encabezado|Totales|MontoTotal")
lcRNCComprador = loXml_Puro.GetChildContent("Encabezado|Comprador|RNCComprador")
*/
/*
*/
let va_eNCF = loXml_puro.GetChildContent("DetalleAprobacionComercial|eNCF")
v_eNCF=va_eNCF

let va_RNCEmisor = loXml_puro.GetChildContent("DetalleAprobacionComercial|RNCEmisor")
v_RNCEmisor=va_RNCEmisor
//v_RNCEmisor= loXml_puro.GetChildContent("DetalleAprobacionComercial|RNCEmisor")
let va_estado = loXml_puro.GetChildContent("DetalleAprobacionComercial|Estado")

let va_MontoTotal = loXml_puro.GetChildContent("DetalleAprobacionComercial|MontoTotal")

let va_RNCComprador=loXml_puro.GetChildContent("DetalleAprobacionComercial|RNCComprador")
v_RNCComprador=va_RNCComprador
//v_RNCComprador=loXml_puro.GetChildContent("DetalleAprobacionComercial|RNCComprador")

let va_DetalleMotivoRechazo =loXml_puro.GetChildContent("DetalleAprobacionComercial|DetalleMotivoRechazo")

let va_FechaHoraAprobacionComercial =loXml_puro.GetChildContent("DetalleAprobacionComercial|FechaHoraAprobacionComercial")

let va_SignatureValue = loXml_puro.GetChildContent("Signature|SignatureValue")
console.log('va_SignatureValue ',va_SignatureValue)
/*
if (va_SignatureValue !== null && va_SignatureValue !== '') {
    return res.status(400).send('Firma Digital Invalida')
}
*/
let va_lcDigestValue = loXml_puro.GetChildContent("Signature|SignedInfo|Reference|DigestValue")
//    console.log('v_FechaHoraAcuseRecibo_formateada',v_FechaHoraAcuseRecibo_formateada)  
// const builder_xml = new xml2js.Builder({ rootName: 'ARECF', xmldec: { 'version': '1.0', 'encoding': 'UTF-8' } });
//
/*
    console.log('TodosLosTags: ',todosLosTags.length);
    for (let i = 0; i < todosLosTags.length; i++) {
            let vtagname = todosLosTags[i].nodeName;


            switch (vtagname) {
    
            case 'RNCEmisor':
                v_RNCEmisor = todosLosTags[i].textContent;
    
            case 'RNCComprador':
                v_RNCComprador = todosLosTags[i].textContent;   
            
            case 'IdentificadorExtranjero':
                v_RNCComprador = todosLosTags[i].textContent;   
    
            case 'eNCF':
                v_eNCF = todosLosTags[i].textContent;

            case 'FechaEmision':
                v_FechaEmision = todosLosTags[i].textContent;   

            case 'MontoTotal':
                v_MontoTotal = todosLosTags[i].textContent;   

            case 'Estado':
                v_Estado = todosLosTags[i].textContent;   

            case 'DetalleMotivoRechazo':
                v_DetalleMotivoRechazo = todosLosTags[i].textContent;   

            case 'FechaHoraAprobacionComercial':
                v_FechaHoraAprobacionComercial = todosLosTags[i].textContent;
          }
        }
*/
    let vnombre_archivo='ACECF' + v_RNCEmisor+v_eNCF+'.xml'    
    const v1_dir = './uploads/'+v_RNCEmisor;
    if (!fs.existsSync(v1_dir)){
        fs.mkdirSync(v1_dir);
    }

    const v3_dir = './enviados/'+v_RNCEmisor;
    if (!fs.existsSync(v3_dir)){
        fs.mkdirSync(v3_dir);
    }
 //res.send('Error en mkdirSync, '+v_RNCEmisor+' '+v_RNCComprador+' '+v_eNCF);
 //   crear_folder_emisor_enupload(v_RNCEmisor);
 //   crear_folder_emisor_enviados(v_RNCEmisor);    
    console.log('v_RNCEmisor ',v_RNCEmisor);
    console.log('v_RNCComprador ',v_RNCComprador);
/*
*/
// loXml.GetXmlSb(loSbXml)
//codigo Firma archivo
    let vnombre_archivo_grabado = __dirname +'/enviados/'+vnombre_archivo
    const vfolfer = __dirname +'\enviados';
//console.log('vnombre_archivo_grabado ',vnombre_archivo_grabado);
// lnSuccess = loSbXml.WriteFile('/enviados/'+vnombre_archivo_grabado,"utf-8",0)
//console.log('Antes de '+vnombre_archivo);
//lnSuccess = loSbXml.WriteFile(vnombre_archivo,"utf-8",0)
//    console.log('Despues de '+vnombre_archivo);
//    res.send(`Texto original: "${texto}"<br
// >Texto procesado por Chilkat: "${textoProcesado}"`);
//return res.status(200).sendfile(vnombre_archivo);
//res.status(200).send(a);
    console.log('Aprbacion Comercial ');
    const vroot = __dirname+'/enviados/'+v_RNCEmisor;
    // res.status(200).sendFile(vnombre_archivo_grabado, { root: vroot }, function (err) {
//    if (v_RNCComprador!=='131660673' && v_RNCComprador!=='130935132' && v_RNCComprador!=='130808112' && v_RNCComprador!=='131219551') {
//        const filePath = req.file.path; // Reemplaza con la ruta correcta
//        console.log('req.file.path ',req.file.path);
//        fs.unlink(filePath, (err) => {
    /*    
    if (err) {
            console.error(`Error al eliminar el archivo: ${err}`);
        }
        }
    */
        //fs.unlinkSync(req.file.path);
 //       console.log('RNC Comprador Desconocido ');        
 //       return res.status(400).send('RNC Comprador Desconocido')
 //   }        
 //   else
 //   {

        console.log('req.file.path ',req.file.path);
        console.log('Recepcion Comercial Exitosa ');
        res.status(200).send('Recepcion Comercial Exitosa')
//    } 
  
});

app.listen(port, () => {
    console.log(`Servidor API REST Coplin Software Escuchando En Puerto: ${port}`);
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

function semilla(req, res) {
const semilla = async (req, res) => {
    // const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const characters = process.env.JWT_SECRET;
/*
     const charactersLength = characters.length;

     let result = "";
          for (let i = 0; i < 152; i++) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
          }
*/
    /*
      const payload = {
      sub: '1234567890', // subject (user id)
      name: 'coplinsoftware.com',
      role: 'user',
      iat: Math.floor(Date.now() / 1000), // issued at time (in seconds)
        exp: Math.floor(Date.now() / 1000) + (60 )
        };
    */
        const fecha_expedicion = Math.floor(Date.now() / 1000)
        const fecha_expiracion = Math.floor(Date.now() / 1000) + (60 * 10) // 1 hora

        const payload = {
        data: 'Token API Privada Contribuyentes DGII', // subject (user id)
        role: 'Autenticacion TOKENS',
        iat: fecha_expedicion, // issued at time (in seconds)
        exp: fecha_expiracion
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        const vfecha = dayjs().format();
        const loXml_puro= new chilkat.Xml();
        const loXml_StringBuilder = new chilkat.StringBuilder();

        loXml_puro.EmitCompact=1
        loXml_puro.Tag = "SemillaModel"
        loXml_puro.AddAttribute("xmlns:xsd","http://www.w3.org/2001/XMLSchema")
        loXml_puro.AddAttribute("xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance")
        loXml_puro.UpdateChildContent("valor",token)
        loXml_puro.UpdateChildContent("fecha",vfecha)
        loXml_puro.GetXmlSb(loXml_StringBuilder)
        let vnombre_archivo='semilla.xml'
        let lnSuccess=0
        lnSuccess = loXml_StringBuilder.WriteFile(vnombre_archivo,"UTF-8",0)
        return res.sendfile(vnombre_archivo)
    }
}
/*
function verificarFirmaDigital(vnombre_archivo_recibido) {
// Crear objetos Chilkat
const dsig = new chilkat.XmlDSig();
const cert = new chilkat.Cert();
// 1. Cargar el XML firmado
const xmlFirmado = fs.readFileSync('documento_firmado.xml', 'utf8');
//
const success = dsig.LoadSignatureSb(xmlFirmado);
if (!success) {
    console.log('Error cargando XML:', dsig.LastErrorText);
    process.exit(1);
}
// 2. Cargar el certificado (.crt) para verificación
const certLoaded = cert.LoadFromFile('certificado_publico.crt');
if (!certLoaded) {
    console.log('Error cargando certificado:', cert.LastErrorText);
    process.exit(1);
}
// 3. Verificar la firma XML con el certificado
const esValida = dsig.VerifySignature(true);

if (esValida) {
    console.log('✓ Firma XML válida');
} else {
    console.log('✗ Firma XML inválida');
    console.log('Error:', dsig.LastErrorText);
}
}
*/
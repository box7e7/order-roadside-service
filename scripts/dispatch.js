import fetch from 'node-fetch';
import { promises as fs } from 'fs';
import body from './data0.js';

let reason={
    "Jump Start":365,
    "jump start":365,
    "Jump start":365,
    "Auto Lockout":364,
    "lockout out":364,
    "Lockout":364,
    "Lockout out":364,
    'Flat Tire':1513,
    'Tire Change':1513,
    'tire':1513,
    'Tire':1513,
    'Towing':6,
    'Stuck':3,
    'Fuel':366,
    'Fuel':366,
    'Fuel Delivery':366,
    'Tow':6,
    'tow':6,
    "Winch Out":6,
    "Winch out":6,
    "motorcycle":6,
    "Motorcycle":6
}


const func=async (job)=>{
  
  const currentWorkingDirectory = process.cwd();
    
  const cookiesString = await fs.readFile(`${currentWorkingDirectory}/scripts/cookies_towbook.json`);
  let cookies = JSON.parse(cookiesString);

  return await new Promise((resolve,reject)=>{
    ////////// Get cookies for authentication ///////////
    let NET_SessionId
    let intercom_session
    let xtl
    let X_Session_Timeout
    
    for (let i=0;i<cookies.length;i++){
      
      if( cookies[i].name==='ASP.NET_SessionId'){
       NET_SessionId=cookies[i].value
      }
      else if(cookies[i].name==='intercom-session-kw06m3f5'){
        intercom_session=cookies[i].value
      }
      else if(cookies[i].name==='.xtl'){
        xtl=cookies[i].value
      }
      else if(cookies[i].name==='X-Session-Timeout'){
        X_Session_Timeout=cookies[i].value
      }
      
    }
    resolve(`'ASP.NET_SessionId=${NET_SessionId}; intercom-session-kw06m3f=${intercom_session}; .xtl=${xtl}; X-Session-Timeout=${X_Session_Timeout}'`)
    /////////////   Cookies are resolved  /////////////////////
  }).then(async res=>{
    
   
    // console.log(res)



    let obj0
    await new Promise(resolve=>{
      resolve(body)
    }).then(res=>{
      res.data.contacts[0].name=job.name
      res.data.contacts[0].phone=job.phone
      res.data.contacts[0].email=job.email ? job.email : "daniela.hernandezfernandez@momentumbmw.net"
      
      res.data.towSource= job["towFrom"]
      res.data.towDestination= job["towTo"]
      res.data.waypoints[0].address= job["towFrom"]
      res.data.waypoints[1].address=job["towFrom"]
   
      res.data.assets[0].year=job.vehicle.year
      res.data.assets[0].make=job.vehicle.make
      res.data.assets[0].model=job.vehicle.model
      // res.data.assets[0].vin=job.vehicle.vin
      res.data.assets[0].vin=job.vehicle.vin ? job.vehicle.vin : null;
      // res.data.assets[0].vin=job.vehicle.vin ? job.vehicle.vin : "5UX13EU07R9W18720"
      // res.data.assets[0].drivers[0].driver.id=392043 
      res.data.assets[0].drivers[0].driver.id=97523


      // res.data.reason.id=6
      res.data.reason.id=reason[job.serviceType] ? reason[job.serviceType] : 6

      res.data.purchaseOrderNumber=job.PO
      res.data.invoiceNumber=job.PO
      res.data.attributes[0].value=job.PO

      job?.notes ? res.data.assets[0].notes=job.notes : null
      job?.notes ? res.data.notes=job.notes : null


      obj0=res.data
      console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&",obj0)
    })
    

    return await fetch('https://app.towbook.com/api/calls/?deleteMissingAssets=true', {
                              //  Authorization : `Basic ${credentials}`,
                                method: 'POST', 
                                // mode: 'cors', 
                                cache: 'no-cache', 
                                credentials: 'same-origin',
                                'Cache-Control': 'no-cache',
                                
                                headers: {
                                  'Accept': 'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                                  'Accept-Encoding': 'gzip, deflate, br',
                                  'Accept-Language': 'en-US,en;q=0.9',
                                 'Connection': 'keep-alive',
                                  'Cookie': res,
                                  'Host': 'app.towbook.com',
                                  'Origin': 'https://app.towbook.com',
                                  // 'Pragma': 'no-cache',
                                  // 'Referer': 'https://app.towbook.com/Security/Login.aspx?ReturnUrl=%2f'


                                }, 
                                body:JSON.stringify(obj0) 
                                // body:body
                              }).then(async res=>{
                                          // resolve({response:res.ok,status:res.status})
                                          // console.log(res)
                                          // console.log(res.body)
                                          console.log({...res.headers})
                                         
                                          return await res.text()
                                        })
                                        .then(data=>{
                                          // console.log(data)
                                          return data
                                        })
                                .catch(e=>console.log(e)) 
   
  })
  

  
}


export default func;

// func(body,job)

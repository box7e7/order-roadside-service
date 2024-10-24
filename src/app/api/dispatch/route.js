import { NextResponse } from 'next/server';
import dispatch from '/scripts/dispatch';



function padWithZeros(number, length) {
  return number.toString().padStart(length, '0');
}


export async function POST(req) {
  try {
    const job = await req.json();
    console.log("$$$$$ job $$$$$$$\n", job);

    let PO=job["PO"]
 

    // PO ? job["PO"] = padWithZeros(PO + 1, 7) : job["PO"] = padWithZeros(1, 7);

    if(PO){
      job["PO"] = padWithZeros(PO, 7);
    }
    else{
      job["PO"] = padWithZeros(1, 7);
    }

    try{

        let result = await dispatch(job);
        console.log("################### call id #########################\n", JSON.parse(result).id);
        return NextResponse.json({id:JSON.parse(result).id});
    
    }
    catch(e){
        console.log("################### error #########################\n", e);
        
    }

    
    

   

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}

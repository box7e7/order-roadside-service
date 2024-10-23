import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Access your environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log("supabaseUrl", supabaseUrl);
console.log("supabaseKey", supabaseKey);


const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,  // Set a rate limit for real-time events
    },
  },
});




export async function POST(req) {
  try {
    const job = await req.json();
    console.log("$$$$$ job $$$$$$$\n", job);

    let PO

    const response = await supabase
    .from('roadside')
    .select('*')
    .order('id', { ascending: false })
    .limit(1);
    
    if (response.error) {
        console.error('Error fetching last record:', response.error);
    } else {
        console.log('Last added record:', response.data);
        PO=response.data[0].id+1
        job["PO"]=PO
    }

    

    const { error } = await supabase
        .from('roadside')
        .insert({  service: job });

    if (error) {
      console.error('Error inserting record:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ PO: job["PO"] });
  }
  catch(error){
    console.log("error in add-records", error);
  }
}

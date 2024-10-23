"use client"
import Service from '../components/Services'
import MainHome from '../components/MainHome'
import Footer from '../components/Footer'
import Header from '../components/Header'

export default function Home() {
  return (
    <>
      <div>
          
            <Header/>
            
            {/* Main Home */}
            <MainHome/>

            {/* Service */} 
            <Service/>
            
            {/* footer */}
           <Footer/>

            
         </div>
    </>
  );
}

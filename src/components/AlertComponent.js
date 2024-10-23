// import {AiOutlineCloseCircle} from "react-icons/ai";
import {IoMdCloseCircleOutline} from "react-icons/io";

export default function AlertComponent(){
    return(
        <div id="alert0" className="z-[100] hidden flex flex-col animate-wiggle absolute top-10 right-10 w-64 h-24 border-4 border-slate-200 bg-white text-slate-600 text-center flex justify-center items-center rounded-lg">
            <div className="flex items-center justify-center space-x-2">
                <IoMdCloseCircleOutline size={40} color='red'/>
                <p>All fields are required!</p>
            </div>
            <div id="progress0"  className="progress0 h-1 bg-slate-300 absolute bottom-0 left-0"></div>
        </div>
    )
}
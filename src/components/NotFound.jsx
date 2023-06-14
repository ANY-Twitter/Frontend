import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFound(){
    let navigate = useNavigate();

    useEffect(()=>{
        setTimeout(()=> {
            navigate('/home');
        },0);
    },[]);



    // return <h1>A home...</h1>
    return <></>;

}


export default NotFound;
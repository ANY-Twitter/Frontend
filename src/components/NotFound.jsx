import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFound(props){
    const {redirection} = props;
    let navigate = useNavigate();

    useEffect(()=>{
        setTimeout(()=> {
            navigate(redirection);
        },0);
    },[]);



    // return <h1>A home...</h1>
    return <></>;

}


export default NotFound;
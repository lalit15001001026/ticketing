import axios from "axios";
import { useState } from "react";

export default ({ url,method,body,onSuccess}) =>{

    const [errors, setErrors] = useState(null);

    const doRequest = async () =>{
        try{
            setErrors(null);
            const response = await axios[method](url,body)
            console.log(response)
            if(onSuccess){
                onSuccess(response.data)
            }
            console.log("reached herer")
            return response.data
        } catch(err)
        {
            console.log(err)
            setErrors(
            <div className="alert alert-danger">
                <h4> ooops....</h4>
                <ul className="my-0">
                    {
                        err.response.data.errors.map(err=> 
                        <li key={err.message}> {err.message}</li>)
                    }
                </ul>
            </div>

            )
        }
    };

    return {doRequest , errors}
}
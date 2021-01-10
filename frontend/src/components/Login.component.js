import React from 'react';
import Axios from "axios";
import Cookies from 'universal-cookie';



import '../assets/css/login.css';

export default class Login extends React.Component{
    constructor(){
        super();
        this.state = {
            username: "",
            password: "",
            isF:false
        }
        this.inputHandler = this.inputHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    inputHandler(event){
        const {name, value} = event.target;
        this.setState({
            [name]:value
        })
    }

    submitHandler(event){
        event.preventDefault();
        const url = "/api/user/login"
        Axios.post(url, this.state)
            .then((data)=>{
                if(data.data.eid === 10){
                    //user is not logged in
                    this.setState({isF:true})
                }
                if(data.data.eid === 0){
                    //user is succesfully logged in
                    const token = data.headers['x-access-token']
                    localStorage.setItem('token', token);
                    let priv = data.data.priv

                    //setting up the cookies
                    const cookies = new Cookies();
                    cookies.set('user',{username:this.state.username,priv:priv},{path:"/"});

                    if(priv === "admin"){
                        //move to admin panel
                        window.location = "/adminpanel"
                    }else{
                        //move to the user panel
                        window.location = "/userpanel"
                    }
                    
                }
            })
            .catch((error)=>{
                console.log(error)
            })

    }

    componentDidMount(){
        const cookies = new Cookies();
        const user = cookies.get('user');
        const token = localStorage.getItem('token');
        if(token && user){
            if(user.priv === "admin") window.location = '/adminpanel';
            else   window.location = '/userpanel';  
        }
    }

    render(){
        const redFlag = this.state.isF === true ? <div class="alert alert-danger" role="alert">Username or/and Password is/are wrong !!</div> : "";
        return(
            <div>
                <div className="loginDiv">
                <h2>Stories by Urban Crew</h2>
                    <form onSubmit={this.submitHandler}>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input type="text" className="form-control" id="username" name="username" onChange={this.inputHandler}/>
                        </div>
                        <div className="mb-3">
                            <label  className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" name="password" onChange={this.inputHandler}/>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form> 
                    <br />
                    {redFlag}
                </div>
            </div>
                
        )
    }
}
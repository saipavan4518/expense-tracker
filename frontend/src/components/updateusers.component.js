import React from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import {socket} from '../service/socket';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default class UpdateUsers extends React.Component{
    constructor(){
        const cookies = new Cookies();
        const user = cookies.get('user');
        const token = localStorage.getItem('token');
        super();
        this.state = {
            username: user.username,
            token: token,
            priv: user.priv,
            users: [],
            showInput: false,
            inputName:"",
            inputUsername:"",
            inputPassword:"",
            inputPhoneno:"",
            inputPriv:""
        }
        this.inputHandler = this.inputHandler.bind(this);
        this.handledelete = this.handledelete.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.socketListerner = this.socketListerner.bind(this);
    }
    inputHandler(event){
        const {name, value} = event.target;
        this.setState({
            [name]:value
        })
    }
    socketListerner(){
        let config = {
            headers: {
              'x-access-token': this.state.token,
            }
        }

        socket.on('render_admin_table_client',()=>{
            const url = "/api/admin/main/getusers";
            axios.get(url,config)
                .then((data)=>{
                    this.setState({
                        users: data.data.result.map((u)=> u)
                    })
                })
                .catch((error)=>{
                    console.log(error)
                })
        })
    }
    handleShow(){
        this.setState({
            showInput: true
        })
    }
    handleCancel(){
        socket.emit('render_admin_table');
        this.setState({
            isSent:false,
            isError:false,
            inputName:"",
            inputUsername:"",
            inputPassword:"",
            inputPhoneno:"",
            inputPriv:"",
            showInput: false
        })
    }
    handledelete(username){
        let config = {
            headers: {
              'x-access-token': this.state.token,
            }
        }
        const url = `/api/admin/main/deleteuser/${username}`

        axios.delete(url, config)
            .then((data)=>{
                if(data.data.eid === 0){
                    socket.emit('render_admin_table');
                }  
            })
            .catch((error)=>{
                console.log(error);
            })

    }

    submitHandler(event){
        event.preventDefault();
        let config = {
            headers: {
              'x-access-token': this.state.token,
            }
        }
        const send_data = {
            nameOfuser:this.state.inputName,
            username:this.state.inputUsername,
            password:this.state.inputPassword,
            phoneno:this.state.inputPhoneno,
            priv:this.state.inputPriv
        }
        const url = '/api/admin/register'

        axios.post(url, send_data, config)
            .then((data)=>{
                if(data.data.eid === 0){
                    this.setState({
                        isSent:true
                    })
                }else{
                    this.setState({
                        isError:true
                    })
                }
            })
            .catch((error)=>{
                console.log(error)
            })
    }


    componentDidMount(){
        
        
        
        if(this.state.priv !== "admin"){
            window.location = "/userpanel"
        }

        this.socketListerner();

        let config = {
            headers: {
              'x-access-token': this.state.token,
            }
        }

        const url = "/api/admin/main/getusers";
        axios.get(url,config)
            .then((data)=>{
                this.setState({
                    users: data.data.result.map((u)=> u)
                })
            })
            .catch((error)=>{
                console.log(error)
            })
    }
    render(){
        const Smessage = this.state.isSent === true?
            <div className="alert alert-success" role="alert">
                Succesfully Added! 
            </div>:"";
        const Emessage = this.state.isError === true?
            <div className="alert alert-danger" role="alert">
                Error in Adding the user, try again
            </div>
        :"";
        const Tentries = this.state.users.map((user,index)=>{
            let val = index + 1;
            return <tr key={user.username}>
                        <td>{val}</td>
                        <td>{user.username}</td>
                        <td>{user.nameOfuser}</td>
                        <td>{user.contactno}</td>
                        <td>{user.priv}</td>
                        <td>
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <button className="dropdown-item dbutton" onClick={()=> this.handledelete(user.username)}>Delete</button>
                            </div>
                        </td>
                    </tr>
        })
        return(
            <div>
               <h3>Users database:</h3>
               <hr/>
               <table className="table">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">s.no</th>
                                        <th scope="col">username</th>
                                        <th scope="col">Name of the Employee</th>
                                        <th scope="col">Contact</th>
                                        <th scope="col">Privilege</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Tentries}
                                </tbody>
                </table>

                <hr />
                <Button variant="primary" onClick={this.handleShow}>add</Button>

                <Modal show={this.state.showInput} onHide={this.handleCancel}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Entry</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.submitHandler}>
                            <div className="mb-3">
                                <label className="form-label">Name of the user:</label>
                                <input type="text" className="form-control" id="username" name="inputName" onChange={this.inputHandler} value={this.state.inputName}/>
                            </div>
                            <div className="mb-3">
                                <label  className="form-label">Username</label>
                                <input type="text" className="form-control" id="password" name="inputUsername" onChange={this.inputHandler} value={this.state.inputUsername}/>
                            </div>
                            <div className="mb-3">
                                <label  className="form-label">Password</label>
                                <input type="text" className="form-control" id="password" name="inputPassword" onChange={this.inputHandler} value={this.state.inputPassword}/>
                            </div>
                            <div className="mb-3">
                                <label  className="form-label">Phone no</label>
                                <input type="text" className="form-control" id="password" name="inputPhoneno" onChange={this.inputHandler} value={this.state.inputPhoneno}/>
                            </div>
                            <div className="mb-3">
                                <label  className="form-label">Privilege</label>
                                <input type="text" className="form-control" id="password" name="inputPriv" onChange={this.inputHandler} value={this.state.inputPriv}/>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form> 
                        {Smessage}
                        {Emessage}
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}
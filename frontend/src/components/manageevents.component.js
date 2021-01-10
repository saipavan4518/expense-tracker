import React from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {socket} from '../service/socket';
import '../assets/css/manageevents.css';


export default class ManageEvents extends React.Component{
    constructor(){
        const cookies = new Cookies();
        const user = cookies.get('user');
        const token = localStorage.getItem('token');
        super();
        this.state = {
            token: token,
            username: user.username,
            priv: user.priv,
            OnGoingevents:[],
            completedEvents:[],
            isSent:false,
            isError:false,
            NameoftheClient:"",
            phoneno:"",
            address:"",
            dates:"",
            allocatedBudget:0,
            status:0
        }
        this.socketListerner = this.socketListerner.bind(this);
        this.inputHandler = this.inputHandler.bind(this);
        this.handledelete = this.handledelete.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.handleComplete = this.handleComplete.bind(this);
    }
    inputHandler(event){
        const {name, value} = event.target;
        this.setState({
            [name]:value
        })
    }
    handleShow(){
        this.setState({
            showInput: true
        })
    }
    handleCancel(){
        socket.emit('render_admin_eventTable');
        this.setState({
            showInput: false,
            NameoftheClient:"",
            phoneno:"",
            address:"",
            dates:"",
            allocatedBudget:0,
            status:0,
            isSent:false,
            isError:false
        })
    }
    handleComplete(id){
        let config = {
            headers: {
              'x-access-token': this.state.token,
            }
        }
        const url = `/api/admin/main/completeEvent`

        const body = {
            id:id
        }
        axios.post(url,body, config)
            .then((data)=>{
                if(data.data.eid === 0){
                    socket.emit('render_admin_eventTable');
                }  
            })
            .catch((error)=>{
                console.log(error);
        })
    }
    handledelete(id){
        let config = {
            headers: {
              'x-access-token': this.state.token,
            }
        }
        const url = `/api/admin/main/deleteevent/${id}`

        axios.delete(url, config)
            .then((data)=>{
                if(data.data.eid === 0){
                    socket.emit('render_admin_eventTable');
                }  
            })
            .catch((error)=>{
                console.log(error);
            })

    }
    socketListerner(){
        socket.on("render_admin_eventTable_client",()=>{
            let config = {
                headers: {
                  'x-access-token': this.state.token,
                }
            }
            const Onurl = axios.get("/api/admin/main/getevents/0",config);
            const Curl =  axios.get("/api/admin/main/getevents/1",config);

            axios.all([Onurl,Curl])
                .then(axios.spread((...res)=>{
                    const respOn = res[0].data.result.map((e)=>e);
                    const resC = res[1].data.result.map((e)=>e);

                    this.setState({
                        OnGoingevents:respOn,
                        completedEvents:resC
                    })
                }))
                .catch((error)=>{
                    console.log(error);
                })
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
            NameoftheClient: this.state.NameoftheClient,
            address: this.state.address,
            phoneno: this.state.phoneno,
            allocatedBudget: this.state.allocatedBudget,
            dates: this.state.dates,
            status: this.state.status
        }

        const url = '/api/admin/main/createEvent';

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
    componentWillUnmount(){
        socket.off('render_admin_eventTable_client');
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
        const Onurl = axios.get("/api/admin/main/getevents/0",config);
        const Curl =  axios.get("/api/admin/main/getevents/1",config);

        axios.all([Onurl,Curl])
            .then(axios.spread((...res)=>{
                const respOn = res[0].data.result.map((e)=>e);
                const resC = res[1].data.result.map((e)=>e);

                this.setState({
                    OnGoingevents:respOn,
                    completedEvents:resC
                })
            }))
            .catch((error)=>{
                console.log(error);
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
        const Tentries = this.state.OnGoingevents.map((event,index)=>{
            let val = index + 1;
            return <tr key={event.id}>
                        <td>{val}</td>
                        <td>{event.NameoftheClient}</td>
                        <td>{event.address}</td>
                        <td>{event.phoneno}</td>
                        <td>{event.dates}</td>
                        <td>{event.allocatedBudget}</td>
                        <td>
                            <div className="btn-group dropup">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <button className="dropdown-item dbutton" onClick={()=> this.handledelete(event.id)}>Delete</button>
                                    <button className="dropdown-item dbutton" onClick={()=> this.handleComplete(event.id)}>Completed</button>
                                </div>
                            </div>
                        </td>
                    </tr>
        })
        const OTentries = this.state.completedEvents.map((event,index)=>{
            let val = index + 1;
            return <tr key={event.id}>
                        <td>{val}</td>
                        <td>{event.NameoftheClient}</td>
                        <td>{event.address}</td>
                        <td>{event.phoneno}</td>
                        <td>{event.dates}</td>
                        <td>{event.allocatedBudget}</td>
                        <td>
                            <div className="btn-group dropup">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <button className="dropdown-item dbutton" onClick={()=> this.handledelete(event.id)}>Delete</button>
                                </div>
                            </div>
                        </td>
                    </tr>
        })
        return(
            
            <div>
                <h3>Events database:</h3>
                <hr/>
                <Accordion defaultActiveKey="0">
                    <Card style={{}}>
                        <Accordion.Toggle as={Card.Header} eventKey="0">
                            <h3>Ongoing/UpComing Events</h3>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <table className="table">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th scope="col">s.no</th>
                                            <th scope="col">Client Name</th>
                                            <th scope="col">address</th>
                                            <th scope="col">Phone Number</th>
                                            <th scope="col">Dates</th>
                                            <th scope="col">Budget</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Tentries}
                                    </tbody>
                                </table>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey="1">
                            <h3>Completed Events</h3>
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                        <Card.Body>
                        <table className="table">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th scope="col">s.no</th>
                                            <th scope="col">Client Name</th>
                                            <th scope="col">address</th>
                                            <th scope="col">Phone Number</th>
                                            <th scope="col">Dates</th>
                                            <th scope="col">Budget</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {OTentries}
                                    </tbody>
                                </table>
                        </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                </Accordion>

                <Button variant="primary" onClick={this.handleShow}>add</Button>

                <Modal show={this.state.showInput} onHide={this.handleCancel}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Entry</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.submitHandler}>
                            <div className="mb-3">
                                <label className="form-label">Name of the client:</label>
                                <input type="text" className="form-control" id="username" name="NameoftheClient" onChange={this.inputHandler} value={this.state.NameoftheClient}/>
                            </div>
                            <div className="mb-3">
                                <label  className="form-label">Phone Number</label>
                                <input type="text" className="form-control" id="password" name="phoneno" onChange={this.inputHandler} value={this.state.phoneno}/>
                            </div>
                            <div className="mb-3">
                                <label  className="form-label">Address</label>
                                <input type="text" className="form-control" id="password" name="address" onChange={this.inputHandler} value={this.state.address}/>
                            </div>
                            <div className="mb-3">
                                <label  className="form-label">Dates</label>
                                <input type="text" className="form-control" id="password" name="dates" onChange={this.inputHandler} value={this.state.dates}/>
                            </div>
                            <div className="mb-3">
                                <label  className="form-label">Allocated Budget</label>
                                <input type="text" className="form-control" id="password" name="allocatedBudget" onChange={this.inputHandler} value={this.state.allocatedBudget}/>
                            </div>
                            <div className="mb-3">
                                <label  className="form-label">Status</label>
                                <input type="text" className="form-control" id="password" name="status" onChange={this.inputHandler} value={this.state.status}/>
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
import React from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Cookies from 'universal-cookie';
import {socket} from '../service/socket';



import '../assets/css/mEvent.css'

export default class Mevent extends React.Component{
    constructor(props){
        const cookies = new Cookies();
        const user = cookies.get('user');

        const token = localStorage.getItem('token');
        super(props);
        this.state = {
            mevent: this.props.location.state,
            expenses: [],
            showInput: false,
            username: user.username,
            token: token,
            reason:"",
            amount:"",
            isSent: false,
            isError: false
        }
        this.handleShow = this.handleShow.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.inputHandler = this.inputHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
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
        socket.emit('render_mevent');
        this.setState({
            isSent:false,
            isError:false,
            reason:"",
            amount:"",
            showInput: false
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
            marriage_id: this.state.mevent.id,
            username: this.state.username,
            reason: this.state.reason,
            amount: this.state.amount
        }

        const url = `/api/user/main/insertexp`;

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
        let config = {
            headers: {
              'x-access-token': this.state.token,
            }
        }

        socket.on('render_mevent_client',()=>{
            const url = `/api/user/main/getmarriages/gettransaction/${this.state.mevent.id}`;
            axios.get(url,config)
                .then((data)=>{
                    this.setState({
                        expenses: data.data.result.map((exp)=> exp)
                    })
                })
                .catch((error)=>{
                    console.log(error)
                })
        })




        const url = `/api/user/main/getmarriages/gettransaction/${this.state.mevent.id}`;
        axios.get(url,config)
            .then((data)=>{
                this.setState({
                    expenses: data.data.result.map((exp)=> exp)
                })
            })
            .catch((error)=>{
                console.log(error)
            })
    }
    render(){

        const Smessage = this.state.isSent === true?
            <div className="alert alert-success" role="alert">
                Succesfully Sent! 
            </div>:"";
        const Emessage = this.state.isError === true?
            <div className="alert alert-danger" role="alert">
                Error in sending, try again
            </div>
        :"";

        let total = 0;
        const Tentries = this.state.expenses.map((exp,index)=>{
            let val = index + 1;
            total = total + parseInt(exp.amount)
            return <tr key={exp.id}>
                        <td>{val}</td>
                        <td>{exp.username}</td>
                        <td>{exp.reason}</td>
                        <td>{exp.amount}</td>
                    </tr>
        })
        return(
            <div>
                <div className="m">
                    <h1>Marriage Event</h1>
                </div>
                <div style={{textAlign:"center"}}>
                    <h5>{this.state.mevent.NameoftheClient}</h5>
                    <p>{this.state.mevent.phoneno}</p>
                    <p>{this.state.mevent.address}</p>
                    <p id="dates">{this.state.mevent.dates}</p>
                    <p>Amount:&nbsp;{this.state.mevent.allocatedBudget}</p>
                </div>
                
                <br />
                <hr />

                <h5>Total amount: {total}</h5>
                <div id="table-wrapper">
                    <div id="table-scroll">
                        <table className="table">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">s.no</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Utility Reason</th>
                                        <th scope="col">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Tentries}
                                </tbody>
                        </table>   
                    </div>
                </div>
                
                <hr />

                <Button variant="primary" id="formbutton" onClick={this.handleShow}>Add New Entry</Button>

                <Modal show={this.state.showInput} onHide={this.handleCancel}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Entry</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.submitHandler}>
                            <div className="mb-3">
                                <label className="form-label">Reason</label>
                                <input type="text" className="form-control" id="username" name="reason" onChange={this.inputHandler} value={this.state.reason}/>
                            </div>
                            <div className="mb-3">
                                <label  className="form-label">Amount</label>
                                <input type="text" className="form-control" id="password" name="amount" onChange={this.inputHandler} value={this.state.amount}/>
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
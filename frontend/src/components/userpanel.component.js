import React from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

import Mcard from './marriageCard.component';
import '../assets/css/userpanel.css';
import {socket} from '../service/socket';

export default class UserPanel extends React.Component{
    constructor(){
        const cookies = new Cookies();
        const user = cookies.get('user');
        const token = localStorage.getItem('token');
        super();
        this.state = {
            upcomingEvents: [],
            completedEvents: [],
            username: user.username,
            token: token,
            searchFilter:""
        }
        this.handleLogOut = this.handleLogOut.bind(this);
        this.socketListerner = this.socketListerner.bind(this);
    }

    handleLogOut(e){
        const cookies = new Cookies();
        cookies.remove('user')
        localStorage.removeItem('token')
        this.setState({
            userLoggedin: false
        })

        window.location = "/"
    }

    socketListerner(){
        socket.on("render_admin_eventTable_client",()=>{
            let config = {
                headers: {
                  'x-access-token': this.state.token,
                }
            }
            const Onurl = axios.get("/api/user/main/getmarriages/ongoing",config);
            const Curl =  axios.get("/api/user/main/getmarriages/completed",config);

            axios.all([Onurl,Curl])
                .then(axios.spread((...res)=>{
                    const respOn = res[0].data.result.map((e)=>e);
                    const resC = res[1].data.result.map((e)=>e);

                    this.setState({
                        upcomingEvents:respOn,
                        completedEvents:resC
                    })
                }))
                .catch((error)=>{
                    console.log(error);
                })
        })
    }

    componentDidMount(){
        //status 0: ongoing, 1:completed
        let config = {
            headers: {
              'x-access-token': this.state.token,
            }
        }

        this.socketListerner();

        const Onurl = axios.get("/api/user/main/getmarriages/ongoing",config);
        const Curl =  axios.get("/api/user/main/getmarriages/completed",config);

        axios.all([Onurl,Curl])
            .then(axios.spread((...res)=>{
                const respOn = res[0].data.result.map((e)=>e);
                const resC = res[1].data.result.map((e)=>e);

                this.setState({
                    upcomingEvents:respOn,
                    completedEvents:resC
                })
            }))
            .catch((error)=>{
                console.log(error);
            })
    }

    render(){
        const ONE = this.state.upcomingEvents.map((ev)=>{
            return <Mcard key={ev.id} ev={ev} />
        })

        const TWO = this.state.completedEvents.map((ev)=>{
            return <Mcard key={ev.id} ev={ev} />
        })

        return(
            <div>
                    <div className="m">
                        <div className="container">
                            <div className="row">
                                <h1 className="col-sm-9">Marriage Schedule</h1>
                                
                                <button className="col-sm-3" id="logoutButton" onClick={this.handleLogOut} style={{background:"none",backgroundColor:"white"}}>LogOut</button>
                            </div>
                        </div>
                        
                    </div>
                    <br />
                    <Accordion defaultActiveKey="0">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-6">
                                    <Card style={{}}>
                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                            <h3>Ongoing/UpComing Events</h3>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>
                                                {ONE}
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </div>
                                <div className="col-sm-6">
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey="1">
                                            <h3>Completed Events</h3>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="1">
                                        <Card.Body>
                                            {TWO}
                                        </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </Accordion>
            </div>
        )
    }
}
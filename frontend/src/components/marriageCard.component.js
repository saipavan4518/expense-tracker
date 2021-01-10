import React from 'react';
import { Redirect } from 'react-router-dom';
import '../assets/css/card.css';


export default class Mcard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id:this.props.ev.id,
            NameoftheClient: this.props.ev.NameoftheClient,
            ist:false
        }
        this.handler = this.handler.bind(this);
    }
    handler(id){
        this.setState({
            NameoftheClient: this.props.ev.NameoftheClient,
            ist:true
        })
    }
    render(){
        if(this.state.ist === true){
            //redirect the webpage
            return <Redirect push to={{
                pathname: `/marriage/event/${this.state.id}`,
                state: this.props.ev
            }} />
        }else{
            return(
                <div className="main-div">
                    <div className="container">
                        <div className="col-sm-12">
                            <div className="card thread">
                                <div 
                                    className="col-sm-10 card-body" 
                                    onClick={()=>this.handler(this.props.ev.id)} >
                                    <div className="row">
                                        <h5 className="col-xl-7 card-title">{this.state.NameoftheClient}</h5>
                                        <p className="col-xl-5 card-text" id="date">{this.props.ev.dates}</p>
                                    </div>
                                    
                                    <p className="card-text">{this.props.ev.phoneno}</p>
                                    <p className="card-text">{this.props.ev.address}</p>
                                    
                                    <p className="card-text">Amount:{this.props.ev.allocatedBudget}</p>
                                </div>
                            </div> 
                        </div>
    
                    </div>
                </div>
            )
        }
        
    }
}
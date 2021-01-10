import React from 'react';
import UserPanel from '../components/userpanel.component';
import { Link } from 'react-router-dom';


export default class AdminPanel extends React.Component{
    render(){
        return(
            <div>
                <UserPanel />
                <Link to="/updateUsers" > Update Users</Link>
                <br/>
                <Link to="/manageEvents" > Manage Events</Link>
            </div>
        )
    }
}
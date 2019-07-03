import React, { Component } from 'react';
import Child from './Child.js'

class Parent extends Component{
    render(){
        return (
            <div>
                <div> This is the parent. </div>
                <Child name="child" />
            </div>
        )
    }
}

export default Parent;
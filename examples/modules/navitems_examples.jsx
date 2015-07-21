"use strict";

var React = require("react/addons");
var _ = require("underscore");
var {NavItems} = require("../../entry"); 


var NavBarExamples = React.createClass({

    getInitialState: function() {
        return {
            data: {summary: {label: "Summary"},
                   circuit: {label: "Circuits"},
                   diagrams: {label: "Diagrams"}
                  },
            active: "Summary",
        };
    },

    handleChange: function(value) {
        this.setState({"active": value});
    },

    render: function() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3> Navbar button Examples</h3>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <NavItems active={this.state.active} 
                                  navItems={this.state.data}
                                  onChange={this.handleChange}/>
                        <br />
                        Selection: {this.state.active}
                    </div>
                </div>
            </div>
        );
    },
});

module.exports = NavBarExamples;


//
/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import Markdown from "react-markdown";
import { Alert } from "react-bootstrap";
import Form from "../../src/form";
import FormMixin from "../../src/formmixin";
import ListEditorMixin from "../../src/listeditormixin";
import TextEditGroup from "../../src/texteditgroup";
import Group from "../../src/group";
import ChooserGroup from "../../src/choosergroup";
import Schema from "../../src/schema";
import Attr from "../../src/attr";
import Highlighter from "./highlighter";

const text = require("raw!../markdown/list_examples.md");
const description = "This shows an example form with a list of emails that can be added or removed.";

const emailTypes = [
    {id: 1, label: "Work"},
    {id: 2, label: "Home"}
];

const emailSchema = (
    <Schema>
        <Attr name="key" />
        <Attr name="email" defaultValue="" label="Email" required={true} validation={{format: "email"}}/>
        <Attr name="email_type" defaultValue={1} label="Type" required={true}/>
    </Schema>
);

/**
 * Renders a form for entering an email address
 */
const EmailItemEditor = React.createClass({

    mixins: [FormMixin],

    renderForm() {
        const id = this.value("email_type");
        return (
            <div>
                <ChooserGroup key={id}
                              attr="email_type"
                              initialChoice={id}
                              initialChoiceList={emailTypes}
                              disableSearch={true}
                              width={150} />
                <TextEditGroup attr="email" width={300} />
            </div>
        );
    }
});

/**
 * Renders a list of emails that can be edited. Each item in the list is a EmailItemEditor.
 */
const EmailListEditor = React.createClass({

    mixins: [ListEditorMixin],

    /**  Set initial items */
    initialItems() {
        return this.props.emails || [];
    },

    /** Create a new item */
    createItem() {
        return {
            email: "",
            email_type: 1
        };
    },

    /** Render one of the items */
    renderItem(item) {
        return (
            <EmailItemEditor schema={emailSchema}
                             values={item}
                             showRequired={this.props.showRequired}/>
        );
    }
});

const schema = (
    <Schema>
        <Attr name="first_name" label="First name" placeholder="Enter first name" required={true} validation={{type: "string"}}/>
        <Attr name="last_name" label="Last name" placeholder="Enter last name" required={true} validation={{type: "string"}}/>
        <Attr name="emails" label="Emails"/>
    </Schema>
);

const values = {
    first_name: "Bill",
    last_name: "Jones",
    emails: [
        {email: "b.jones@work.com", email_type: 1},
        {email: "bill@gmail.com", email_type: 2}
    ]
};

/**
 * Edit a contact
 */
const ContactForm = React.createClass({

    mixins: [FormMixin],

    displayName: "ContactForm",

    /**
     * Save the form
     */
    handleSubmit(e) {
        e.preventDefault();

        // Example of checking if the form has missing values and turning required On
        if (this.hasMissing()) {
            this.showRequiredOn();
            return;
        }

        // Example of fetching current and initial values
        console.log("values:", this.getValues());

        this.props.onSubmit && this.props.onSubmit(this.getValues());
    },

    renderForm() {
        const disableSubmit = this.hasErrors();
        const style = {
            background: "#FAFAFA",
            padding: 10,
            borderRadius: 5
        };
        const emails = this.value("emails");

        return (
            <Form style={style} ref="form" attr="contact-form">
                <TextEditGroup attr="first_name" width={300} />
                <TextEditGroup attr="last_name" width={300} />
                <Group attr="emails" >
                    <EmailListEditor emails={emails}/>
                </Group>
                <hr />
                <input className="btn btn-default" type="submit" value="Submit" disabled={disableSubmit}/>
            </Form>
        );
    }
});

export default React.createClass({

    mixins: [Highlighter],

    getInitialState() {
        return {
            data:  undefined,
            loaded: false
        };
    },

    componentDidMount() {
        // Simulate ASYNC state update
        setTimeout(() => {
            this.setState({
                loaded: true
            });
        }, 0);
    },

    handleSubmit(value) {
        this.setState({data: value});
    },

    handleAlertDismiss() {
        this.setState({data: undefined});
    },

    renderAlert() {
        if (this.state && this.state.data) {
            const firstName = this.state.data["first_name"];
            const lastName = this.state.data["last_name"];
            const emailList = this.state.data["emails"];
            return (
                <Alert bsStyle="success" onDismiss={this.handleAlertDismiss} style={{margin: 5}}>
                    <strong>Success!</strong> {firstName} {lastName} was submitted with {emailList.length} email(s).
                </Alert>
            );
        } else {
            return null;
        }
    },

    renderContactForm() {
        if (this.state.loaded) {
            return (
                <ContactForm schema={schema} values={values} onSubmit={this.handleSubmit}/>
            );
        } else {
            return (
                <div style={{marginTop: 50}}><b>Loading...</b></div>
            );
        }
    },

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h3>List example</h3>
                        <div style={{marginBottom: 20}}>{description}</div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-9">
                        {this.renderContactForm()}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-9">
                        {this.renderAlert()}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div style={{borderTopStyle: "solid",
                                    borderTopColor: "rgb(244, 244, 244)",
                                    paddingTop: 5,
                                    marginTop: 20}}>
                            <Markdown source={text}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

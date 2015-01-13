/** @jsx React.DOM */

"use strict";

var React = require("react/addons");
var _ = require("underscore");

/**
 * Example:
 *  <Group attr={this.getAttr("contact_type")} >
 *      <Chooser initialChoice={contactType} initialChoiceList={contactTypes} disableSearch={true}/>
 *  </Group>
 */
var Group = React.createClass({

    displayName: "Group",

    render: function() {
        var attr = this.props.attr;

        //Control
        var props = {
            "attr": attr.attr,
            "key": attr.key,
            "disabled": attr.disabled,
            "placeholder": attr.placeholder,
            "rules": attr.validation,
            "required": attr.required,
            "showRequired": attr.showRequired,
            "onErrorCountChange": attr.errorCountCallback,
            "onMissingCountChange": attr.missingCountCallback,
            "onChange": attr.changeCallback,
            "validator": this.props.validator
        };

        var child = React.Children.only(this.props.children);
        var childControl = React.addons.cloneWithProps(child, props);
        var control = (
            <div className="col-sm-10">
                {childControl}
            </div>
        );

        //Label
        var labelText = attr.name;
        if (attr.required) {
            labelText += "*";
        }
        var ClassSet = React.addons.classSet;
        var labelClasses = ClassSet({
            "col-sm-2": true,
            "required": attr.required
        });
        var label = (
            <label className={labelClasses} muted={attr.disabled} htmlFor={attr.key}>{labelText}</label>
        );

        //Group
        return (
            <div className="form-group row">
                {label} {control}
            </div>
        );
    }
});

module.exports = Group;
#Containers#
In order to use containers, simply import the wrapper and annotate your component like below

##Annotate##
import React, { Component } from 'react'
import PreferenceContainer from 'containers/PreferenceContainer';

@PreferenceContainer({
namespace: 'dashboard'
})
export default class MyComponent extends Component {
render() {

        const { auto, matic, props, and, dispatch, from, redux } = this.props;

        return (
            <div>
            </div>
        )
    }

}

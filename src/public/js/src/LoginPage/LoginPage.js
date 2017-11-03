import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { Segment, Form, Header, Button } from 'semantic-ui-react'

import { userActions } from '../_actions'

class LoginPage extends Component {

    onSubmit(e) {
        e.preventDefault()
        let username = e.target.username.value
        let password = e.target.password.value
        if (username && password) {
            this.props.dispatch(userActions.login(username, password))
        }
    }

    render() {
        return (
            <Segment>
                <Form loading={this.props.loggingIn} onSubmit={ e => this.onSubmit(e) }>
                    <Header as='h2'>Login</Header>
                    <Form.Input name="username" label='Username' />
                    <Form.Input name="password" label='Password' type='password' />
                    <Button type='submit'>Login</Button>
                    <Link to='/register'>Register</Link>
                </Form>
            </Segment>
        )
    }
}

LoginPage.propTypes = {
    loggingIn: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
    const { loggingIn } = state.authentication
    return {
        loggingIn
    }
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage)
export { connectedLoginPage as LoginPage }

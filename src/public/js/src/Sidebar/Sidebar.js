import React, { Component } from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { history } from '../_helpers'
import { userActions } from '../_actions'


class Sidebar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            pathname: '/'
        }

        history.listen((location, action) => {
            this.setState({ pathname: location.pathname })
        })
    }

    handleLogout(e) {
        this.props.dispatch(userActions.logout())
    }

    renderPublicMenu(currentPath) {
        return (
            <Menu fluid vertical pointing icon='labeled'>
                <Menu.Item active={currentPath === '/login' || currentPath === '/register'} as={Link} to='/'>
                    <Icon name='home' /> Home
                </Menu.Item>
            </Menu>
        )
    }

    renderPrivateMenu(currentPath) {
        return (
            <Menu fluid vertical pointing icon='labeled'>
                <Menu.Item active={currentPath === '/'} as={Link} to='/'>
                    <Icon name='home' /> Home
                </Menu.Item>
                <Menu.Item active={currentPath === '/users'} as={Link} to='/users'>
                    <Icon name='users' /> Users
                </Menu.Item>
                <Menu.Item active={currentPath === '/todo'} as={Link} to='/todo'>
                    <Icon name='tasks' /> Todo
                </Menu.Item>
                <Menu.Item as={Link} to='/' onClick={e => this.handleLogout(e)}>
                    <Icon name='sign out' /> Logout
                </Menu.Item>
            </Menu>
        )
    }

    render() {

        const { user } = this.props
        const { pathname } = this.state

        return user ? this.renderPrivateMenu(pathname) : this.renderPublicMenu(pathname)
    }

}

function mapStateToProps(state) {
    const { authentication } = state
    const { user } = authentication
    return {
        user,
    }
}

const connectedSidebar = connect(mapStateToProps)(Sidebar)
export { connectedSidebar as Sidebar }
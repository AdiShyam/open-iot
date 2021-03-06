import React, { Component } from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { userActions } from '../_actions'
import { ACCESS_LEVEL } from '../_constants'


class Sidebar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            pathname: this.props.history.location.pathname
        }

        this.props.history.listen((location, action) => {
            this.setState({ pathname: location.pathname })
        })
    }

    handleLogout(e) {
        this.props.dispatch(userActions.logout(this.props.history))
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
        const { user } = this.props

        return (
            <Menu fluid vertical pointing icon='labeled'>
                <Menu.Item active={currentPath === '/'} as={Link} to='/'>
                    <Icon name='home' /> Home
                </Menu.Item>
                <Menu.Item active={currentPath.startsWith('/apps')} as={Link} to='/apps'>
                    <Icon name='lab' /> Apps
                </Menu.Item>
                <Menu.Item active={currentPath.startsWith('/integrations')} as={Link} to='/integrations'>
                    <Icon name='fast forward' /> Integrations
                </Menu.Item>
                <Menu.Item active={currentPath.startsWith('/playground')} as={Link} to='/playground'>
                    <Icon name='soccer' /> Playground
                </Menu.Item>
                <Menu.Item active={currentPath.startsWith('/messages')} as={Link} to='/messages'>
                    <Icon name='mail' /> Messages
                </Menu.Item>
                <Menu.Item active={currentPath.startsWith('/cron')} as={Link} to='/cron'>
                    <Icon name='clock outline' /> Crons
                </Menu.Item>
                { user.accessLevel >= ACCESS_LEVEL.MANAGER && <Menu.Item active={currentPath.startsWith('/users')} as={Link} to='/users'>
                    <Icon name='users' /> Users
                </Menu.Item> }
                { user.accessLevel >= ACCESS_LEVEL.ADMIN && <Menu.Item active={currentPath.startsWith('/settings')} as={Link} to='/settings'>
                    <Icon name='settings' /> Settings
                </Menu.Item> }
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

const connectedSidebar = connect(mapStateToProps)(withRouter(Sidebar))
export { connectedSidebar as Sidebar }

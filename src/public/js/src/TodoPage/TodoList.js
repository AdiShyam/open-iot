import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'

import { todoActions } from '../_actions'
import { todoConstants } from '../_constants'
import { Todo } from './'

class TodoList extends Component {
    render() {
        let elements = this.props.todos.map(todo => (
            <Table.Row key={todo.id}>
                <Table.Cell style={{ cursor: 'pointer' }} onClick={() => this.props.onTodoClick(todo.id)}>
                    <Todo {...todo} />
                </Table.Cell>
                <Table.Cell>{ todo.created.format('h:mm:ss a') }</Table.Cell>
                <Table.Cell>{ todo.updated.format('h:mm:ss a') }</Table.Cell>
            </Table.Row>
        ));
        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Todo List</Table.HeaderCell>
                        <Table.HeaderCell>Created</Table.HeaderCell>
                        <Table.HeaderCell>Updated</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {elements}
                </Table.Body>
            </Table>
        )
    }
}

TodoList.propTypes = {
    todos: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            completed: PropTypes.bool.isRequired,
            text: PropTypes.string.isRequired,
            created: PropTypes.any.isRequired,
            updated: PropTypes.any.isRequired,
        }).isRequired
    ).isRequired,
    onTodoClick: PropTypes.func.isRequired
}

const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case todoConstants.FILTER_SHOW_ALL:
            return todos
        case todoConstants.FILTER_SHOW_COMPLETED:
            return todos.filter(t => t.completed)
        case todoConstants.FILTER_SHOW_ACTIVE:
            return todos.filter(t => !t.completed)
    }
}

const mapStateToProps = state => {
    return {
        todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTodoClick: id => {
            dispatch(todoActions.toggleTodo(id))
        }
    }
}

const connectedTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList)
export { connectedTodoList as TodoList }

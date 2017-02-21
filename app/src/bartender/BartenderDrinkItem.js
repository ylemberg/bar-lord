import React, { Component } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import '../App.css'


class DrinkItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      buttonActive: false,
    }
  }

  componentDidMount() {
  }

  toggleButton() {
    if (!this.state.buttonActive) {
      this.setState({ buttonActive: !this.state.buttonActive })
    } else {
      this.setState({ buttonActive: !this.state.buttonActive })
    }
  }

  render() {
    const tabId = this.props.order.tabId
    const id = this.props.order.id
    const iconType = (this.props.order.drink.type === 'shot') ? 'lab' : this.props.order.drink.type

    return (
      <Button onClick={() => this.props.removeDrink(tabId, id)}>
        <Button.Content visible>
          <Icon name={iconType} /> {this.props.order.drink.name}
        </Button.Content>
      </Button>
    )
  }
}

export default DrinkItem

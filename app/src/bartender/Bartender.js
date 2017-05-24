import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid, Label, Header } from 'semantic-ui-react'
import axios from 'axios'

import '../App.css'
import { actions } from './duck.Bartender'
import DrinkGroup from './BartenderDrinkGroup'
import CompletedDrinks from './BartenderCompletedDrinks'

@connect(store => ({
  visible: store.dash.visible,
  unfufilledOrders: store.bar.unfufilledOrders,
  fetchedOrders: store.bar.fetchedOrders,
  completingOrders: store.bar.completingOrders,
  donePickupOrders: store.bar.donePickupOrders,
  doneTableOrders: store.bar.doneTableOrders,
}))

class Bartender extends Component {
  static sendServerClosedTab(tab) {
    axios.put('/orders/closeorders/', tab)
  }

  constructor(props) {
    super(props)

    this.checkIfAllOrdersDone = ::this.checkIfAllOrdersDone
    this.completeTab = ::this.completeTab
    this.getNonCompletedOrders = ::this.getNonCompletedOrders
  }

  componentDidMount() {
    const externalIp = 'http://ec2-54-197-9-47.compute-1.amazonaws.com'
    const webSocketUri = `ws://${externalIp}:3000`
    const socket = io(webSocketUri)
    console.log('socket is', socket)

    socket.on('neworder', order => {
      console.log('socket message emitted', order)
      this.props.dispatch(actions.addOrder(order))
    })

    // axios.get('/meta/')
    //   .then(res => {
    //     console.log('res.data', res.data)

    //     const externalIp = res.data
    //     const webSocketUri = `ws://${externalIp}:3000`

    //     const socket = io(webSocketUri)

    //     console.log('socket is', socket)

    //     socket.on('neworder', order => {
    //       console.log('socket message emitted', order)
    //       this.props.dispatch(actions.addOrder(order))
    //     })
    //   }).catch(err => {
    //     console.log('err in axios request', err)
    //   })
  }

  componentDidUpdate() {
    this.checkIfAllOrdersDone()
  }

  getNonCompletedOrders(ordersToComplete) {
    return this.props.unfufilledOrders.filter(currTab => currTab[0].id !== ordersToComplete[0].id)
  }

  completeTab(ordersToComplete) {
    const tab = [ordersToComplete]

    ordersToComplete[0].tableNum === 0
    ? this.props.dispatch(actions.setDonePickupOrders(tab))
    : this.props.dispatch(actions.setDoneTableOrders(tab))

    this.props.dispatch(actions.resetRemainingTabs(this.getNonCompletedOrders(ordersToComplete)))
  }

  findAndRemove(tabId, id) {
    const newOrders = this.props.unfufilledOrders.map(tab => tab.map(order => {
      return order.id === id ? Object.assign(order, { complete: true }) : order
    }))

    this.props.dispatch(actions.resetOrders(newOrders))
  }

  checkIfAllOrdersDone() {
    const context = this
    this.props.unfufilledOrders.forEach(tab => {
      if (tab.filter(order => order.complete).length === tab.length) {
        context.completeTab(tab)
        context.constructor.sendServerClosedTab(tab)
      }
    })
  }

  numOfOrders() {
    return this.props.unfufilledOrders.reduce((numOfOrders, currTab) => numOfOrders + currTab.filter(order => !order.complete).length, 0)
  }

  render() {
    const props = {
      removeDrink: ::this.findAndRemove,
      numOfOrders: ::this.numOfOrders,
    }

    return (
      <Grid id="height100">
        <Grid.Row>
          <CompletedDrinks completedTables={this.props.doneTableOrders} completedPickups={this.props.donePickupOrders} />
          <Grid.Column width={4} id="bar_queue_container" className="revealer">
            <Header as="h2" className="header_container">
              <div className="header_content_container">
                <Header.Content>
                  Bar Queue
                </Header.Content>
                <Label id="order-cnt" circular size="large" color="red">{props.numOfOrders()}</Label>
              </div>
            </Header>
            <div className="drink_group_container">
              {this.props.unfufilledOrders.map(tab => <DrinkGroup {...props} key={tab[0].id} tab={tab} />)}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default Bartender

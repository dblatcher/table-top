function handleListItemQuantityChange(event, datum) {
    datum.quantity[event.index] = Number(event.newValue)
    if (this.handleUpdate) {this.handleUpdate()}
  }

function  handleListItemChange(event, datum) {
    datum.value[event.index] = event.newValue
    if (this.handleUpdate) {this.handleUpdate()}
  }

function handleListItemDelete(event, datum) {
    datum.value.splice(event.index,1)
    if (datum.quantity) {datum.quantity.splice(event.index,1)}
    if (this.handleUpdate) {this.handleUpdate()}
}

function handleListItemAdd(datum) {
    datum.value.push('')
    if (datum.quantity) {datum.quantity.push(1)}
    if (this.handleUpdate) {this.handleUpdate()}
}

export {
    handleListItemQuantityChange, 
    handleListItemChange,
    handleListItemDelete,
    handleListItemAdd,
}
import React, { Component } from 'react'
import axios from 'axios'

class App extends Component {
  // initialize state
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  }

  // when component mounts, the first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic (watcher) so that we can easily see if our db has
  // changed and then implement those changes into our UI

  componentDidMount() {
    this.getDataFromDb()
    if(!this.state.intervalIsSet) {
      let interval = setInterval(this.getDatFromDb, 1000)
      this.setState({ intervalIsSet: interval })
    }
  }

  // Nothing lives forever!
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet)
      this.setState({ intervalIsSet: null })
    }
  }

  // The front end uses the idkey of the data object to identify what to Update or delete
  // the backend uses the object id assigned by MongoDB to modify DB enteries

  // The first get uses the backend to fetch data from the database
  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }))
  }


  // Put message uses the backend API to create a new query
  putDataToDB = (message) => {
    // This is surely an antipattern.  Best to let Mongo handle ID creation in the schema
    let currentIds = this.state.data.map((data) => data.id)
    let idToBeAdded = 0
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded
    }

    axios.post('http://localhost:3001/api/putData', {
      id: idToBeAdded,
      message: message
    })
  }

  // delete removes existing db information( duh )
  deleteFromDB = (idToDelete) => {
    // This too is a lame pattern.  Pretty sure you can structure the query to delete
    // by ID directly
    parseInt(idToDelete)
    let objIdToDelete = null
    this.state.data.forEach((dat) => {
      if (dat.id === idToDelete) {
        objIdToDelete = dat._id
      }
    })

    axios.delete('http://localhost:3001/api/deleteData', {
      data: {
        id: objIdToDelete
      }
    })
  }

  // update overwrites existing db information
  updateDB = (idToUpdate, updateToApply) => {
    // And again, you can grab the id directly!
    let objIdToUpdate = null
    parseInt(idToUpdate)
    this.state.data.forEach((dat) => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id
      }
    })

    axios.post('http://localhost:3001/api/updateData', {
      id: objIdToUpdate,
      update: { message: updateToApply }
    })
  }


  render() {
    const { data } = this.state
      return (
        <div>
          <h1>DAVE ROCKS THE BACK END!</h1>
          <ul>
            {data.length <= 0
              ? 'NO DB ENTRIES YET' 
              : data.msp((dat) => (
                <li style={{ padding: '10px'}} key={data.message}>
                  <span style={{ color: 'gray' }}> id: </span> {dat.id} <br />
                  <span style={{ color: 'gray' }}> data: </span> {dat.message}
                </li>
              ))}
          </ul>
          <div style={{ padding: '10px' }}>
            <input
              type="text"
              onChange={(e) => this.setState({ message: e.target.value })}
              placeholder="Add something!"
              style={{ width: '200px' }}
            />
            <button onClick={() => this.putDataToDB(this.state.message)}>
              ADD
            </button>
          </div>
          <div style={{ padding: '10px' }}>
            <input
              type="text"
              onChange={(e) => this.setState({ iToDelete: e.target.value })}
              placeholder="ID of message to delete?"
              style={{ width: '200px' }}
            />
            <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
              DELETE
            </button>
          </div>
          <div style={{ padding: '10px' }}>
            <input
              type="text"
              onChange={(e) => this.setState({ idToUpdate: e.target.value })}
              placeholder="ID of item to update?"
              style={{ width: '200px' }}
            />
            <input 
              type="text"
              style={{ width: '200px' }}
              onChange={(e) => this.setState({ updateToApply: e.target.value})}
              placeholder="New item value?"
            />
            <button onClick={() => this.updateDB(this.state.idToUpdate, this.state.updateToApply)}>
              UPDATE
            </button>
          </div>
        </div>
      ) // return 
  }
}

export default App;

import Vue from 'vue'
import axios from 'axios'
import Vuex from 'vuex'
Vue.use(Vuex)
// { id: 1, title: 'Random Előétel 1', price: 3000 }
export default new Vuex.Store({
  state: {
    items: [
      {
          action: 'mdi-food-apple',
          items: [],
          title: 'Eloetelek',
      },
      {
          action: 'mdi-noodles',
          items: [],
          title: 'Levesek',
      },
      {
          action: 'mdi-food-turkey',
          items: [],
          title: 'Foetelek',
      },
      {
          action: 'mdi-cupcake',
          items: [],
          title: 'Desszertek',
      },
      {
          action: 'mdi-glass-cocktail',
          items: [],
          title: 'Italok',
      }
  ],
    userSession: {
      username: "",
      isLoggedIn: false,
      isAdmin: false
    },
    employeeList: [],
    drinkList: [],
    foodList: [],
    tableStates: {
      1 : {
        // chairMoveLock: false,
        chairTop: { chairState: false, chairMoveLock: false},
        chairBot: { chairState: false, chairMoveLock: false},
        orderState: 'idle',
        basket: [],
        orders: [],
        activeOrderId: 0
      },
      2 : {
        // chairMoveLock: false,
        chairTop: { chairState: false, chairMoveLock: false},
        chairBot: { chairState: false, chairMoveLock: false},
        orderState: 'idle',
        basket: [],
        orders: [],
        activeOrderId: 0
      },
      3 : {
        // chairMoveLock: false,
        chairTop: { chairState: false, chairMoveLock: false},
        chairBot: { chairState: false, chairMoveLock: false},
        orderState: 'idle',
        basket: [],
        orders: [],
        activeOrderId: 0
      },
      4 : {
        // chairMoveLock: false,
        chairTop: { chairState: false, chairMoveLock: false},
        chairBot: { chairState: false, chairMoveLock: false},
        orderState: 'idle',
        basket: [],
        orders: [],
        activeOrderId: 0
      },
      5 : {
        // chairMoveLock: false,
        chairTop: { chairState: false, chairMoveLock: false},
        chairBot: { chairState: false, chairMoveLock: false},
        orderState: 'idle',
        basket: [],
        orders: [],
        activeOrderId: 0
      },
    },
    menu: {
      open: false
    },
    invoice: {
      open: false
    },
    dynamicButtonText: true,
    dynamicButtonRoute: "/dashboard",
    alert: {
      open: false,
      type: 'payTrouble',
      alertText: {
        payTrouble: 'Az asztal még nem fizetett! A szék állapotának megváltoztatásához rendezze a vendég számláját, majd tisztítsa le az asztalt.',
        cleanTrouble: 'Az asztal még nem tiszta! A szék állapotának megváltoztatásához tsiztítsa le az asztalt'
      }
    },
    categories: {
      food: ['Leves', 'Eloetel', 'Foetel', 'Desszert'],
      drink: ['Ital'],
      employee: ['Admin','Felhasznalo']
    }
  },
  mutations: {
    resetOrders(state, payload){
      state.tableStates[payload].orders = []
    },
    updateBill(state, payload){
      let updatedOrderData;
      // state.tableStates[payload.tableId].orders = []
      // let updatedOrderData = {counter: payload.orderData.etelDarabszam, orderTitle: "Unknown", orderPrice: 0}
      state.foodList.forEach(food => {
        if (food.id == payload.orderData.etelAzonosito){
          updatedOrderData = { counter: payload.orderData.etelDarabszam, orderTitle: food.name, orderPrice: food.price}
        }
      })
      state.drinkList.forEach(drink => {
        if (drink.id == payload.orderData.etelAzonosito){
          updatedOrderData = { counter: payload.orderData.etelDarabszam, orderTitle: drink.name, orderPrice: drink.price}
        }
      })

      state.tableStates[payload.tableId].orders.push(updatedOrderData)

    },
    syncTables(state,payload){
      payload.forEach((table,index) => {
        state.tableStates[index+1]['chairTop'].chairState = table.felsoSzekFoglalt == 0 ? false : true
        state.tableStates[index+1]['chairBot'].chairState = table.alsoSzekFoglalt == 0 ? false : true
        state.tableStates[index+1]['chairTop'].chairMoveLock = table.felsoSzekZarolva == 0 ? false : true
        state.tableStates[index+1]['chairBot'].chairMoveLock = table.alsoSzekZarolva == 0 ? false : true
        state.tableStates[index+1].orderState = table.rendelesAllapot
        state.tableStates[index+1].activeOrderId = table.aktivRendeles
      })
    },
    loadFoodStore(state, payload){
      if (payload.kategoria == 'Ital'){
        state.drinkList.push({
          name: payload.nev,
          category: payload.kategoria,
          price: payload.ar,
          id: payload.id,
          allergens: payload.allergenek
        })
      } else {
        state.foodList.push({
          name: payload.nev,
          category: payload.kategoria,
          price: payload.ar,
          id: payload.id,
          allergens: payload.allergenek
        })
      }
      let categoryIndex = 0
      if (payload.kategoria == 'Leves') categoryIndex = 1
      else if (payload.kategoria == 'Foetel') categoryIndex = 2
      else if (payload.kategoria == 'Desszert') categoryIndex = 3
      else if (payload.kategoria == 'Ital') categoryIndex = 4
      state.items[categoryIndex].items.push({
        id: payload.id,
        title: payload.nev,
        price: payload.ar
      })
    },
    loadUserStore(state, payload){
      state.employeeList.push({
        name: payload.felhasznalonev,
        category: payload.admin == 0 ? 'Admin':'Felhasznalo',
        id: payload.id,
        firstName: payload.vezeteknev,
        lastName: payload.keresztnev,
        password: payload.jelszo
      })
    },
    delete(state, payload){
      let targetIndex
      if (payload.type == 'food'){
        state.foodList.forEach(element => {
          if (element.id == payload.item.id) targetIndex = state.foodList.indexOf(element)
        });
        state.foodList.splice(targetIndex,1)
      } else if (payload.type == 'drink'){
        state.drinkList.forEach(element => {
          if (element.id == payload.item.id) targetIndex = state.drinkList.indexOf(element)
        });
        state.drinkList.splice(targetIndex,1)

      } else {
        state.employeeList.forEach(element => {
          if (element.id == payload.item.id) targetIndex = state.employeeList.indexOf(element)
        });
        state.employeeList.splice(targetIndex,1)
      }

    },
    editItem(state,payload){
      let index
      if (payload.type == 'food'){
        state.foodList.forEach(food => {
          if (food.id == payload.item.id){
            index = state.foodList.indexOf(food)
            state.foodList[index] = payload.item
          }
        })
      } else if (payload.type == 'drink'){
        state.drinkList.forEach(food => {
          if (food.id == payload.item.id){
            index = state.drinkList.indexOf(food)
            state.drinkList[index] = payload.item
          }
        })
      } else {
        let temp = []
        state.employeeList.forEach(employee => temp.push(employee))
        state.employeeList = []
        temp.forEach(employee => state.employeeList.push(employee))

        state.employeeList.forEach(employee => {
          if (employee.id == payload.item.id){
            index = state.employeeList.indexOf(employee)
            let emp = state.employeeList.splice(index,1)
            emp.name = payload.item.felhasznalonev
            emp.category = payload.item.admin == 0 ? 'Admin':'Felhasznalo'
            state.employeeList.push(emp)
          }
        })
      }
    },
    addItem(state,payload){
      // let index
      let max = 1
      state.foodList.forEach(food => {
        if (food.id >= max ){
          max = food.id
        }
      })
      if (payload.type == 'food'){
        payload.item.id = max
        state.foodList.push(payload.item);
      } else if (payload.type == 'drink'){
        payload.item.id = max
        state.drinkList.push(payload.item);
      } else {
        let temp = []
        state.employeeList.forEach(employee => temp.push(employee))
        state.employeeList = []
        temp.forEach(employee => state.employeeList.push(employee))

        let emp = payload.item
        emp.name = payload.item.felhasznalonev
        emp.category = payload.item.admin == 0 ? 'Admin':'Felhasznalo'
        state.employeeList.push(emp)
      }
    },
    changeLoginState(state,payload){
      state.userSession.isLoggedIn = true
      state.userSession.username = "tesztJúzer"
      if (payload.identity == "admin"){
        state.userSession.isAdmin = true
      }
    },
    logout(state){
      state.userSession.username = ""
      state.userSession.isLoggedIn = false
      state.userSession.isAdmin = false
    },

    changeMenuState(state){
      state.menu.open = !state.menu.open
    },
    changeInvoiceState(state){
      state.invoice.open = !state.invoice.open
    },
    changeChairState(state, payload){

      const chairPos = payload.chairId == 0 ? 'chairTop' : 'chairBot'
      const chairOther = chairPos == 'chairTop' ? 'chairBot' : 'chairTop'
      const szandek = payload.state

      if(state.tableStates[payload.tableId].orderState != 'idle'){
        

        if(szandek == true && state.tableStates[payload.tableId][chairOther].chairMoveLock == true){
          let toBeUnlocked = payload.chairId == 1 ? 0:1 
          axios.post(`http://localhost:3000/tables/${payload.tableId}/chair/${toBeUnlocked}/lock/0/`)
        }

        if (szandek == false && state.tableStates[payload.tableId][chairPos].chairState == true && state.tableStates[payload.tableId][chairOther].chairState == true){
          let toBeLocked = payload.chairId == 1 ? 0:1
          axios.post(`http://localhost:3000/tables/${payload.tableId}/chair/${toBeLocked}/lock/1/`)
        }
      }

      if (!state.tableStates[payload.tableId][chairPos].chairMoveLock){
        axios.post(`http://localhost:3000/tables/${payload.tableId}/chair/${payload.chairId}/state/${payload.state == true ? 1 : 0}/`)
      } else {
        state.alert.open = true
      }
    },
    emptyBasket(state,payload){
      state.tableStates[payload].basket = []
    },
    updateBasket(state,payload){

      if (payload.action == '+'){
        let basketItemIds = []
        state.tableStates[payload.tableId].basket.forEach(basketItem => basketItemIds.push(basketItem.orderId))
        if (basketItemIds.indexOf(payload.orderId) >= 0){
          state.tableStates[payload.tableId].basket[basketItemIds.indexOf(payload.orderId)].counter++
        } else {
          state.tableStates[payload.tableId].basket.push({
            orderId: payload.orderId,
            orderTitle: payload.orderTitle,
            orderPrice: payload.orderPrice,
            counter: 1
          })
        }

      } else {
        let basketItemIds = []
        state.tableStates[payload.tableId].basket.forEach(basketItem => basketItemIds.push(basketItem.orderId))
        if (basketItemIds.indexOf(payload.orderId) >= 0){
          if (state.tableStates[payload.tableId].basket[basketItemIds.indexOf(payload.orderId)].counter > 1){
            state.tableStates[payload.tableId].basket[basketItemIds.indexOf(payload.orderId)].counter--
          }else{
            state.tableStates[payload.tableId].basket.splice(basketItemIds.indexOf(payload.orderId),1)
          }
        }
      }
    },
    
    payOrder(state,payload){
      state.tableStates[payload].orders = []
      state.alert.type = 'cleanTrouble'
      axios.put(`http://localhost:3000/tables/${payload}/paid`)
      axios.post(`http://localhost:3000/tables/${payload}/chair/0/lock/1/`)
      axios.post(`http://localhost:3000/tables/${payload}/chair/1/lock/1/`)
    },
    cleanTable(state,payload){
      axios.put(`http://localhost:3000/tables/${payload}/idle`)
      axios.post(`http://localhost:3000/tables/${payload}/chair/0/lock/0/`)
      axios.post(`http://localhost:3000/tables/${payload}/chair/1/lock/0/`)
      axios.post(`http://localhost:3000/tables/${payload}/chair/0/state/0/`)
      axios.post(`http://localhost:3000/tables/${payload}/chair/1/state/0/`)
      state.alert.type = 'payTrouble'
    },
    deliverOrder(state,payload){
      axios.put(`http://localhost:3000/tables/${payload}/delivered`)
    },
    placeOrder(state,payload){
      const existingOrderIds = []
      state.tableStates[payload].orders.forEach(order => existingOrderIds.push(order.orderId))

      if (state.tableStates[payload].orders.length == 0){
        state.tableStates[payload].orders = state.tableStates[payload].basket
      } else {
        state.tableStates[payload].basket.forEach(basketItem => {
          if(existingOrderIds.indexOf(basketItem.orderId) >= 0){
            state.tableStates[payload].orders[existingOrderIds.indexOf(basketItem.orderId)].counter++
          }
          else{
            state.tableStates[payload].orders.push(basketItem)
          }
        })
      }
      let finalizedOrders = [] 
      state.tableStates[payload].orders.forEach(order => {
        finalizedOrders.push({
          orderId: order.orderId,
          orderCount: order.counter
        })
      })
      state.tableStates[payload].orders = []
      axios.post(`http://localhost:3000/orders/create/${payload}`, finalizedOrders)

      if(state.tableStates[payload]['chairTop'].chairState == true && state.tableStates[payload]['chairBot'].chairState == false){
        axios.post(`http://localhost:3000/tables/${payload}/chair/0/lock/1/`)
      } else if (state.tableStates[payload]['chairBot'].chairState == true && state.tableStates[payload]['chairTop'].chairState == false){
        axios.post(`http://localhost:3000/tables/${payload}/chair/1/lock/1/`)
      }
      
    },
    alertToggle(state){
      state.alert.open = !state.alert.open
    },

  },
  actions: {
    foodApi({commit}){
      console.log('getting food...')
      axios
      .get('http://localhost:3000/food/list')
      .then(response => {
        response.data.forEach(food =>{
          commit('loadFoodStore', food)
        })
      })
    },
    employeesApi({commit}){
      console.log('getting employees...')
      axios
      .get('http://localhost:3000/users/list')
      .then(response => {
        response.data.forEach(user =>{
          commit('loadUserStore', user)
        })
      })
    },
    tablesApi({commit}){
      setInterval(() => {
        axios
        .get('http://localhost:3000/tables/list')
        .then(response => {
          commit('syncTables', response.data)
        })
        
      }, 500);
    },
    getBillApi({ commit }, payload){
      axios.get(`http://localhost:3000/tables/${payload.id}/orders`)
      .then(response => {
        response.data.forEach(order =>{
          commit('updateBill', { tableId: payload.id, orderData: order})
        })
      })
    },

    deleteApi({ commit }, payload){
      if (payload.type == 'employee'){
        axios
      .delete(`http://localhost:3000/users/remove/${payload.item.id}`)
      } else {
        axios
        .delete(`http://localhost:3000/food/remove/${payload.item.id}`)
      }

      commit('delete', payload)
    },
    editItem({ commit }, payload){
      commit('editItem', payload)
      if (payload.type == 'employee'){
      axios
      .put(`http://localhost:3000/users/edit/${payload.item.id}`,payload.item)
      } else {
        axios
        .put(`http://localhost:3000/food/edit/${payload.item.id}`,payload.item)
      }
    },
    createItem({ commit }, payload){
      if (payload.type == 'employee'){
        axios.post(`http://localhost:3000/users/create`, payload.item)
      } else {
        axios
        .post(`http://localhost:3000/food/create`, {name: payload.item.name, category: payload.item.category, allergens: payload.item.allergens, price: payload.item.price})
      }
      commit('addItem', payload)
    },
    placeOrderApi({ commit }, payload){
      commit('placeOrder', payload)
      commit('emptyBasket', payload)
    },

    payOrderApi({ commit }, payload){
        commit('payOrder', payload)
    },
    
    deliverOrderApi({ commit }, payload){
      commit('deliverOrder', payload)
    }
    
  },
  getters: {
    getMenuItems(state){
      return state.items
    },
    mayIUpdate: (state) => (payload) =>{
      var chair = 'chairTop'
      if (payload.chair.id == 1){
        chair = 'chairBot'
      }
      return !state.tableStates[payload.table.id][chair].chairMoveLock
    },
    getCategories: (state) => (id) =>{
      return state.categories[id]
    },
    tableStates(state){
      return state.tableStates
    },
    tableState: (state) => (id) => {
      return state.tableStates[id]
    },
    menuState(state){
      return state.menu
    },
    dynamicButtonTextState(state){
      return state.dynamicButtonText
    },
    dynamicButtonRouteState(state){
      return state.dynamicButtonRoute
    },
    basketState: (state) => (id) => {
      return state.tableStates[id].basket
    },
    orderState: (state) => (id) =>{
      return state.tableStates[id].orders
    },
    invoiceState(state){
      return state.invoice.open
    },
    alertState(state){
      return state.alert
    },
    userState(state){
      return state.userSession
    },
    authenticated(state){
      return state.userSession.isLoggedIn
    },
    adminLoggedIn(state){
      return state.userSession.isLoggedIn && state.userSession.isAdmin
    },
    employeeListState(state){
      return state.employeeList
    },
    foodListState(state){
      return state.foodList
    },
    drinkListState(state){


      return state.drinkList
    },
    foodState: (state) => (id) =>{
      let food2return = null
      state.foodList.forEach(food => {
        if(food.id == id){
          food2return = food
        }
      })
      return food2return
    },
    drinkState: (state) => (id) =>{
      let drink2return = null
      state.drinkList.forEach(drink => {
        if(drink.id == id){
          drink2return = drink
        }
      })
      return drink2return
    },
    employeeState: (state) => (id) =>{
      let employee2return = null
      state.employeeList.forEach(employee => {
        if(employee.id == id){
          employee2return = employee
        }
      })
      return employee2return
    }
  }
})

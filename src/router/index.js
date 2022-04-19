import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Customers from '../views/Customers.vue'
import Zoom from '../views/Zoom.vue'
import Welcome from '../views/Welcome.vue'
import Login from '../views/Login.vue'
import HomeAdmin from '../views/HomeAdmin.vue'
import HomeUser from '../views/HomeUser.vue'
import FoodList from '../views/FoodList.vue'
import DrinkList from '../views/DrinkList.vue'
import EmployeeList from '../views/EmployeeList.vue'
import Logout from '../views/Logout.vue'
import EditSomething from '../views/EditSomething.vue'
import AddSomething from '../views/AddSomething.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/login/:claim',
    name: 'Login',
    component: Login
  },
  {
    path: '/home/user',
    name: 'HomeUser',
    component: HomeUser
  },
  {
    path: '/home/admin',
    name: 'HomeAdmin',
    component: HomeAdmin
  },
  {
    path: '/kijelentkezes',
    name: 'Logout',
    component: Logout
  },
  {
    path: '/home/foodlist',
    name: 'FoodList',
    component: FoodList
  },
  {
    path: '/home/drinklist',
    name: 'DrinkList',
    component: DrinkList
  },
  {
    path: '/home/admin/employeelist',
    name: 'EmployeeList',
    component: EmployeeList
  },
  {
    path: '/home/admin/items/:target/new',
    name: 'AddSomething',
    component: AddSomething
  },
  {
    path: '/home/admin/items/:target/edit/:id',
    name: 'EditSomething',
    component: EditSomething
  },
  {
    path: '/home/admin/foodlist/edit/:id',
    name: 'EditSomething',
    component: EditSomething
  },
  {
    path: '/home/admin/drinklist/edit/:id',
    name: 'EditSomething',
    component: EditSomething
  },
  {
    path: '/home/admin/employeelist/edit/:id',
    name: 'EditSomething',
    component: EditSomething
  },
  
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/customers',
    name: 'Customers',
    component: Customers
  },
  {
    path: '/table/:id',
    name: 'Zoom',
    component: Zoom
  }

]

const router = new VueRouter({
  routes
})

export default router

import axios from 'axios'
import { decode } from 'jsonwebtoken'
import { OrderStatus } from './models'

const baseURL = 'http://localhost:8082'
const secret = 'X_CHANGE_THIS_X'

test('init', async () => {
  const client = axios.create({ baseURL })
  try {
    const { data: { message } } = await client.post('admin', {token: secret})
    expect(message).toBe('success')
    const { data: { roles } } = await client.get('roles')
    const [customer, owner] = roles
    expect(customer.name).toBe('Customer')
    expect(owner.name).toBe('Owner')
  } catch (error) {
    if (error.message) {
      expect(error.message).toBe(undefined)
    }
    if (error.response) {
      const {response: {data}} = error
      expect(data.message).toBe(undefined)
    }
  }
})

test('user', async () => {
  const client = axios.create({ baseURL })
  try {
    const { data: { roles } } = await client.get('roles')
    const [customer, owner] = roles
    const { data: { user: john } } = await client.post('users/register', {
      username: 'John',
      password: 'Test-1',
      confirmation: 'Test-1',
      role: customer.id
    })
    expect(john.username).toBe('John')
    const { data: { user: mario } } = await client.post('users/register', {
      username: 'Mario',
      password: 'Test-2',
      confirmation: 'Test-2',
      role: owner.id
    })
    expect(mario.username).toBe('Mario')
  } catch (error) {
    if (error.message) {
      expect(error.message).toBe(undefined)
    }
    if (error.response) {
      const {response: {data}} = error
      expect(data.message).toBe(undefined)
    }
  }
})

test('restaurant', async () => {
  const client = axios.create({ baseURL })
  try {
    const { data: { token } } = await client.post('users/login', {
      username: 'Mario',
      password: 'Test-2'
    })
    const user = decode(token)
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const { data: { restaurant: created } } = await client.post('restaurants', {
      name: 'Little Italy',
      description: 'Best italian food in town'
    })
    expect(created.name).toBe('Little Italy')
    expect(created.description).toBe('Best italian food in town')
    expect(created.status).toBe('OPEN')
    expect(created.owner.username).toBe('Mario')

    const { data: { restaurants: [ littleItaly ] } } = await client.get('restaurants')
    expect(littleItaly.name).toBe('Little Italy')
    expect(littleItaly.description).toBe('Best italian food in town')
    expect(littleItaly.status).toBe('OPEN')
    expect(littleItaly.owner.username).toBe('Mario')

    const { data: { restaurant: updated } } = await client.put(`restaurants/${littleItaly.id}`, {
      name: 'My Little Italy',
      description: 'The Best italian food in town'
    })
    expect(updated.name).toBe('My Little Italy')
    expect(updated.description).toBe('The Best italian food in town')
    expect(updated.status).toBe('OPEN')
    expect(updated.owner.username).toBe('Mario')

    const { data: { restaurants: [ myLittleItaly ] } } = await client.get('restaurants')
    expect(myLittleItaly.name).toBe('My Little Italy')
    expect(myLittleItaly.description).toBe('The Best italian food in town')
    expect(myLittleItaly.status).toBe('OPEN')
    expect(myLittleItaly.owner.username).toBe('Mario')

    const { data: { restaurant: deleted } } = await client.delete(`restaurants/${littleItaly.id}`)
    expect(deleted.name).toBe('My Little Italy')
    expect(deleted.description).toBe('The Best italian food in town')
    expect(deleted.status).toBe('CLOSED')
    expect(deleted.owner.username).toBe('Mario')

    const { data: { restaurants } } = await client.get('restaurants')
    expect(restaurants.length).toBe(0)
  } catch (error) {
    if (error.message) {
      expect(error.message).toBe(undefined)
    }
    if (error.response) {
      const {response: {data}} = error
      expect(data.message).toBe(undefined)
    }
  }
})

test('meal', async () => {
  const client = axios.create({ baseURL })
  try {
    const { data: { token } } = await client.post('users/login', {
      username: 'Mario',
      password: 'Test-2'
    })
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const { data: { restaurant } } = await client.post('restaurants', {
      name: 'Sushi Palace',
      description: 'Best Sushi in town'
    })

    const { data: { meal: created } } = await client.post(`meals/${restaurant['id']}`, {
      name: 'Dragon Sushi',
      description: 'Sushi with avocado and salmon',
      price: 2.5
    })
    expect(created.name).toBe('Dragon Sushi')
    expect(created.description).toBe('Sushi with avocado and salmon')
    expect(created.price).toBe(2.5)
    expect(created.status).toBe('AVAILABLE')

    const { data: { meals: [ dragonSushi ] } } = await client.get(`meals/${restaurant['id']}`)
    expect(dragonSushi.name).toBe('Dragon Sushi')
    expect(dragonSushi.description).toBe('Sushi with avocado and salmon')
    expect(dragonSushi.price).toBe(2.5)
    expect(dragonSushi.status).toBe('AVAILABLE')

    const { data: { meal: updated } } = await client.put(`meals/${restaurant['id']}/${dragonSushi.id}`, {
      name: 'Spicy Dragon Sushi',
      description: 'Spicy Sushi with avocado and salmon',
      price: 3.5
    })
    expect(updated.name).toBe('Spicy Dragon Sushi')
    expect(updated.description).toBe('Spicy Sushi with avocado and salmon')
    expect(updated.price).toBe(3.5)
    expect(updated.status).toBe('AVAILABLE')

    const { data: { meals: [ spicySushi ] } } = await client.get(`meals/${restaurant['id']}`)
    expect(spicySushi.name).toBe('Spicy Dragon Sushi')
    expect(spicySushi.description).toBe('Spicy Sushi with avocado and salmon')
    expect(spicySushi.price).toBe(3.5)
    expect(spicySushi.status).toBe('AVAILABLE')

    const { data: { meal: deleted } } = await client.delete(`meals/${restaurant['id']}/${dragonSushi.id}`)
    expect(spicySushi.name).toBe('Spicy Dragon Sushi')
    expect(spicySushi.description).toBe('Spicy Sushi with avocado and salmon')
    expect(spicySushi.price).toBe(3.5)
    expect(deleted.status).toBe('OUT_OF_STOCK')

    const { data: { meals } } = await client.get(`meals/${restaurant['id']}`)
    expect(meals.length).toBe(0)
  } catch (error) {
    if (error.message) {
      expect(error.message).toBe(undefined)
    }
    if (error.response) {
      const {response: {data}} = error
      expect(data.message).toBe(undefined)
    }
  }
})

test('order', async () => {
  const client = axios.create({ baseURL })
  try {
    const { data: { token: johnToken } } = await client.post('users/login', {
      username: 'John',
      password: 'Test-1'
    })
    const { data: { token: marioToken } } = await client.post('users/login', {
      username: 'Mario',
      password: 'Test-2'
    })

    const john = decode(johnToken)

    client.defaults.headers.common['Authorization'] = `Bearer ${marioToken}`

    const { data: { restaurant } } = await client.post('restaurants', {
      name: 'Chez Mamy',
      description: 'French homemade food like in the old days'
    })
    const { data: { meal } } = await client.post(`meals/${restaurant['id']}`, {
      name: 'Ratatouille',
      description: 'Mix of all kind of fresh vegetables',
      price: 8.5
    })

    client.defaults.headers.common['Authorization'] = `Bearer ${johnToken}`

    const { data: { order: temp } } = await client.post('orders', {
      restaurant: restaurant.id,
      meals: [{ meal: meal.id, amount: 3 }]
    })
    expect(temp.customer.id).toBe(john['id'])
    expect(temp.meals[0].meal.id).toBe(meal.id)
    expect(temp.meals[0].meal.name).toBe(meal.name)
    expect(temp.meals[0].amount).toBe(3)
    expect(temp.total).toBe(25.5)
    expect(temp.status).toBe(OrderStatus.Placed)

    const { data: { order: canceled } } = await client.delete(`orders/${temp.id}`)
    expect(canceled.status).toBe(OrderStatus.Canceled)

    const { data: { order: placed } } = await client.post('orders', {
      restaurant: restaurant.id,
      meals: [{ meal: meal.id, amount: 5 }]
    })
    expect(placed.customer.id).toBe(john['id'])
    expect(placed.meals[0].meal.id).toBe(meal.id)
    expect(placed.meals[0].meal.name).toBe(meal.name)
    expect(placed.meals[0].amount).toBe(5)
    expect(placed.total).toBe(42.5)
    expect(placed.status).toBe(OrderStatus.Placed)

    client.defaults.headers.common['Authorization'] = `Bearer ${marioToken}`

    const { data: { order: processed } } = await client.put(`orders/${placed.id}/process`)
    expect(processed.status).toBe(OrderStatus.Processing)

    const { data: { order: inRoute } } = await client.put(`orders/${placed.id}/in-route`)
    expect(inRoute.status).toBe(OrderStatus.InRoute)

    const { data: { order: delivered } } = await client.put(`orders/${placed.id}/delivered`)
    expect(delivered.status).toBe(OrderStatus.Delivered)

    client.defaults.headers.common['Authorization'] = `Bearer ${johnToken}`

    const { data: { order: received } } = await client.put(`orders/${placed.id}/received`)
    expect(received.status).toBe(OrderStatus.Received)

  } catch (error) {
    if (error.message) {
      expect(error.message).toBe(undefined)
    }
    if (error.response) {
      const {response: {data}} = error
      expect(data.message).toBe(undefined)
    }
  }
})

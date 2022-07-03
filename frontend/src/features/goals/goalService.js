import axios from "axios";

const API_URL = '/api/goals/'

// Create a new goal
const createGoal = async (goalData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  // Making post request with our "goalData" with "config" we defined to "API_URL" route.
  const response = await axios.post(API_URL, goalData, config)

  return response.data
}


// Getting all goals
const getGoals = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  // Making post request with our "goalData" with "config" we defined to "API_URL" route.
  const response = await axios.get(API_URL, config)

  return response.data
}


// Delet a user goal
const deleteGoal = async (goalId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  // Making delete request with our "id" with "config" we defined to "API_URL" route.
  const response = await axios.delete(API_URL + goalId, config)

  return response.data
}


const goalService = {
  createGoal,
  getGoals,
  deleteGoal
}

export default goalService
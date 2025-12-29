import axios from 'axios'

const GITHUB_USERNAME = process.env.GITHUB_USERNAME
const GITHUB_REPO = process.env.GITHUB_REPO
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

const githubApi = axios.create({
  baseURL: `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents`,
  headers: {
    Authorization: `token ${GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
  }
})

export const getGitHubData = async (path) => {
  try {
    const response = await githubApi.get(path)
    const content = Buffer.from(response.data.content, 'base64').toString()
    return JSON.parse(content)
  } catch (error) {
    if (error.response?.status === 404) {
      return []
    }
    throw error
  }
}

export const updateGitHubData = async (path, data) => {
  try {
    let sha
    try {
      const current = await githubApi.get(path)
      sha = current.data.sha
    } catch (error) {
      sha = null
    }

    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64')
    
    await githubApi.put(path, {
      message: `Update ${path}`,
      content,
      sha
    })

    return true
  } catch (error) {
    console.error('GitHub API Error:', error)
    throw error
  }
}

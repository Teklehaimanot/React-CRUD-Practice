import './App.css';
import { useState, useEffect } from 'react'

function App() {
  const [posts, setPosts] = useState([])
  const [input, setInput] = useState('')
  const [formValue, setFormValue] = useState({
    title: "",
    body: "",
    userId: ""
  })

  useEffect(() => {
    const getPosts = async () => {
      const postsFromServer = await fetchPosts()
      setPosts(postsFromServer)
      console.log(postsFromServer)
    }
    getPosts()

  }, [])
  const fetchPosts = async () => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts')
      const data = await res.json()
      return data
    } catch (error) {
      console.log(error)
    }

  }
  const filterInputByUserId = async (e) => {
    try {
      const id = e.target.value
      setInput(id)
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`)
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      console.log(error)
    }


  }

  const handleSubmit = async (e) => {
    const { title, body, userId } = formValue
    e.preventDefault()
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: title,
          body: body,
          userId: userId
        }),
        Headers: {
          'Content-type': 'application/json; charset=UTF-8',
        }
      })
      const data = await res.json()
      const updatedData = { ...formValue, id: data.id }
      console.log(updatedData)
      setPosts([...posts, updatedData])

    } catch (error) {
      console.log(error)
    }

  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValue((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const updatePost = async () => {
    const formData = {
      id: 1,
      title: 'tekila',
      body: 'my name is tekila',
      userId: 1
    }
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'PUT',
        body: JSON.stringify({
          id: formData.id,
          title: formData.title,
          body: formData.body,
          userId: formData.userId
        }),
        Headers: {
          'Content-type': 'application/json; charset=UTF-8',
        }
      })
      const data = await res.json()
      const updatedData = { ...formData, id: data.id }
      setPosts(
        posts.map((post) => post.id === data.id ? { ...post, title: updatedData.title, body: updatedData.body, userId: updatedData.userId } : post)
      )
    } catch (error) {

    }
  }

  const deletePost = async () => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'DELETE',
      })
      const data = await res.json()
      console.log(data)
      setPosts(posts.filter((post) => post.id !== 1))
    } catch (error) {
      console.log(error)
    }
  }
  const { title, body, userId } = formValue

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='title' name='title' value={title} onChange={handleChange} />
        <input type="text" placeholder='body' name='body' value={body} onChange={handleChange} />
        <input type="number" placeholder='userId' name='userId' value={userId} onChange={handleChange} />
        <input type="submit" value="submit" />
      </form>
      <button onClick={updatePost}>update</button>
      <button onClick={deletePost}>delete</button>
      <input type="number" value={input} onChange={filterInputByUserId} />
      <ul>
        {posts.map((post) => (
          <li style={{ listStyle: 'none', display: 'flex' }} key={post.id}><span style={{ marginRight: '100px' }}>{post.userId}</span>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

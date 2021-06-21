import {useState, useEffect} from 'react'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import {useQuery} from 'react-query'
import {QueryClientProvider, QueryClient} from 'react-query'


const queryClient = new QueryClient()




const App = () => {

  const [showAddTask, setShowAddTask] =useState(false)
  const [tasks, setTasks]= useState([])

  //Fetch Tasks
const fetchTasks= async () =>{
      const res= await fetch ('http://localhost:5000/tasks')
       const data= await res.json()
  
       return data
}

//Fetch Task
const fetchTask= async (id) =>{
      const res=  await fetch(`http://
      localhost:5000/tasks/${id}`)
       const data= await res.json()
  
       return data
}


  const {data, status} =useQuery('posts',fetchTasks,{onSuccess: (data)=>{
    setTasks(data)
    console.log("here on success")
  }});


  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])


 
 

  // Add Task
  const addTask = async(task) => {

     const res= await fetch('http://localhost:5000/tasks',
     {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(task),
     }
     )
     const data= await res.json()

     setTasks([...tasks, data])

 
}


  // Delete Task
  const deleteTask = async(id) => {
   await fetch(`http://localhost:5000/tasks/${id}`,
    {method: 'DELETE',
  }) 

   setTasks(tasks.filter((task)=> task.id !==
   id))
  }
  
  //Toggle reminder
  const toggleReminder = async(id) => { 
   const taskToToggle = await fetchTask(id)
   const updTask = {...taskToToggle, 
   reminder: !taskToToggle.reminder}

   const res = await fetch
   (`http://localhost:5000/tasks/${id}`, {
     method: 'PUT',
     headers: {
       'Content-Type': 'application/json'
     }, 
     body: JSON.stringify(updTask)

   })

   const data= await res.json()

    setTasks
    (tasks.map((task) => task.id === id
    ? { ...task, reminder: !data.reminder}: task)) 
  } 


  return(
    <QueryClientProvider client={queryClient} contextSharing= {true}>

    <Router>
    <div className= 'container'>
      <Header onAdd = {() => setShowAddTask(!showAddTask)}
      showAdd= {showAddTask}/>
      {showAddTask && <AddTask onAdd = {addTask}/>}
      {tasks.length > 0? (
      <Tasks tasks={tasks} 
      onDelete={deleteTask} 
      onToggle={toggleReminder}
      /> 
      ): (
        'No Tasks to show'
      )}
      <Footer />
    </div>
    </Router>
    </QueryClientProvider>

  ) 
}
  
export default App;
